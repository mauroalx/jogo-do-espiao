import type { Draw } from './word-bank'

export type Player = {
  id: string
  name: string
}

export type Settings = {
  spyCount: number
  spiesKnowEachOther: boolean
  spyGetsHint: boolean
  showCategoryToEveryone: boolean
  enabledCategories: string[]
  timerMinutes: number
  spyLastChance: boolean
  oneSpyEliminatesTeam: boolean
}

export type Round = {
  id: string
  draw: Draw
  spyIds: string[]
  revealedIds: string[]
  spyGuessedWord: boolean | null
  accusedPlayerIds: string[]
  winner: 'spies' | 'players' | null
  outcome:
    | 'time'
    | 'discovered'
    | 'wrong-accusation'
    | 'guessed'
    | 'missed'
    | null
}

export type HistoryEntry = {
  id: string
  playedAt: number
  category: string
  word: string
  spies: string[]
  accused: string[]
  spyGuessedWord: boolean | null
  winner: 'spies' | 'players'
  outcome: 'time' | 'discovered' | 'wrong-accusation' | 'guessed' | 'missed'
}

type StoredHistoryEntry = Omit<HistoryEntry, 'accused' | 'winner' | 'outcome'> & {
  accused?: string | string[]
  winner?: HistoryEntry['winner']
  outcome?: HistoryEntry['outcome']
}

export type Phase =
  | 'players'
  | 'settings'
  | 'reveal'
  | 'timer'
  | 'accusation'
  | 'guess'
  | 'result'

export const DEFAULT_SETTINGS: Settings = {
  spyCount: 1,
  spiesKnowEachOther: false,
  spyGetsHint: true,
  showCategoryToEveryone: true,
  enabledCategories: [],
  timerMinutes: 8,
  spyLastChance: false,
  oneSpyEliminatesTeam: false,
}

export const MIN_PLAYERS = 3

export function maxSpies(playerCount: number) {
  return Math.max(1, Math.floor((playerCount - 1) / 2))
}

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Temperatura alta = mais surpresa; baixa = mais “vez de quem ainda não foi”. */
const SPY_PICK_TEMPERATURE = 2
const LAST_SPY_FACTOR = 0.5

function playerNameKey(name: string) {
  return name.trim().toLocaleLowerCase('pt-BR')
}

function pickWeighted<T>(
  items: T[],
  weights: number[],
  random: () => number,
): T {
  const total = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0)
  if (items.length === 0) {
    throw new Error('pickWeighted precisa de candidatos')
  }
  if (total <= 0) {
    return items[Math.floor(random() * items.length)] ?? items[0]
  }
  let cursor = random() * total
  for (let index = 0; index < items.length; index += 1) {
    cursor -= Math.max(0, weights[index] ?? 0)
    if (cursor <= 0) return items[index] as T
  }
  return items[items.length - 1] as T
}

/**
 * Conta quantas vezes cada jogador atual foi espião no histórico da mesa.
 */
export function spyTurnCounts(
  players: Player[],
  history: Array<Pick<HistoryEntry, 'spies'>>,
) {
  const counts = new Map(players.map((player) => [player.id, 0]))
  const byName = new Map(
    players.map((player) => [playerNameKey(player.name), player.id]),
  )

  for (const entry of history) {
    for (const spyName of entry.spies) {
      const id = byName.get(playerNameKey(spyName))
      if (!id) continue
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }

  return counts
}

/**
 * Sorteia espiões equilibrando o histórico sem rodízio previsível:
 * quem foi menos vezes pesa mais, mas quem já saiu ainda pode repetir.
 */
export function pickSpies(
  players: Player[],
  count: number,
  history: Array<Pick<HistoryEntry, 'spies'>> = [],
  random: () => number = Math.random,
): string[] {
  const target = Math.min(count, Math.max(1, players.length - 1))
  const counts = spyTurnCounts(players, history)
  const lastSpies = new Set(
    (history[0]?.spies ?? [])
      .map((name) =>
        players.find(
          (player) => playerNameKey(player.name) === playerNameKey(name),
        )?.id,
      )
      .filter((id): id is string => Boolean(id)),
  )
  const picked: string[] = []

  for (let step = 0; step < target; step += 1) {
    const candidates = players.filter((player) => !picked.includes(player.id))
    const weights = candidates.map((player) => {
      const turns = counts.get(player.id) ?? 0
      let weight = Math.exp(-turns / SPY_PICK_TEMPERATURE)
      if (lastSpies.has(player.id)) weight *= LAST_SPY_FACTOR
      return weight * (0.85 + random() * 0.3)
    })
    const chosen = pickWeighted(candidates, weights, random)
    picked.push(chosen.id)
    counts.set(chosen.id, (counts.get(chosen.id) ?? 0) + 1)
  }

  return picked
}

/** Avalia uma acusação já confirmada, sem revelar papéis à interface. */
export function accusationFoundSpies(
  spyIds: string[],
  accusedPlayerIds: string[],
  oneSpyEliminatesTeam: boolean,
) {
  if (spyIds.length === 0 || accusedPlayerIds.length !== spyIds.length) {
    return false
  }
  const spies = new Set(spyIds)
  const accused = new Set(accusedPlayerIds)
  if (accused.size !== accusedPlayerIds.length) return false
  if (oneSpyEliminatesTeam) {
    return accusedPlayerIds.some((id) => spies.has(id))
  }
  return accusedPlayerIds.every((id) => spies.has(id))
}

export type RoundDecision = Pick<Round, 'winner' | 'outcome'> & {
  needsLastChance: boolean
}

export function accusationDecision(
  spyIds: string[],
  accusedPlayerIds: string[],
  oneSpyEliminatesTeam: boolean,
  spyLastChance: boolean,
): RoundDecision {
  const found = accusationFoundSpies(
    spyIds,
    accusedPlayerIds,
    oneSpyEliminatesTeam,
  )
  if (!found) {
    return {
      winner: 'spies',
      outcome: 'wrong-accusation',
      needsLastChance: false,
    }
  }
  if (spyLastChance) {
    return { winner: null, outcome: null, needsLastChance: true }
  }
  return {
    winner: 'players',
    outcome: 'discovered',
    needsLastChance: false,
  }
}

export function lastChanceDecision(correct: boolean): RoundDecision {
  return {
    winner: correct ? 'spies' : 'players',
    outcome: correct ? 'guessed' : 'missed',
    needsLastChance: false,
  }
}

export const TIME_EXPIRED_DECISION: RoundDecision = {
  winner: 'spies',
  outcome: 'time',
  needsLastChance: false,
}

export function shouldRevealSpyHint(
  secondsLeft: number,
  spyGetsHint: boolean,
  hint: string | null | undefined,
) {
  return secondsLeft > 0 && secondsLeft <= 60 && spyGetsHint && Boolean(hint)
}

export function createId() {
  return Math.random().toString(36).slice(2, 10)
}

/* ------------------------------- persistência ------------------------------ */

const KEYS = {
  players: 'espiao:players',
  settings: 'espiao:settings',
  used: 'espiao:used-words',
  history: 'espiao:history',
} as const

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage cheio ou indisponível: o jogo segue funcionando */
  }
}

export function normalizeHistory(
  entries: StoredHistoryEntry[],
): HistoryEntry[] {
  return entries.map((entry) => ({
    ...entry,
    winner:
      entry.winner ??
      (entry.spyGuessedWord === true ? 'spies' : 'players'),
    outcome:
      entry.outcome ??
      (entry.spyGuessedWord === true
        ? 'guessed'
        : entry.spyGuessedWord === false
          ? 'missed'
          : 'discovered'),
    accused: Array.isArray(entry.accused)
      ? entry.accused
      : entry.accused
        ? [entry.accused]
        : [],
  }))
}

export const storage = {
  loadPlayers: () => read<Player[]>(KEYS.players, []),
  savePlayers: (players: Player[]) => write(KEYS.players, players),
  loadSettings: () => ({
    ...DEFAULT_SETTINGS,
    ...read<Partial<Settings>>(KEYS.settings, {}),
  }),
  saveSettings: (settings: Settings) => write(KEYS.settings, settings),
  loadUsed: () => read<string[]>(KEYS.used, []),
  saveUsed: (used: string[]) => write(KEYS.used, used),
  loadHistory: () =>
    normalizeHistory(read<StoredHistoryEntry[]>(KEYS.history, [])),
  saveHistory: (history: HistoryEntry[]) => write(KEYS.history, history),
}
