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
}

export type Round = {
  id: string
  draw: Draw
  spyIds: string[]
  revealedIds: string[]
  spyGuessedWord: boolean | null
  accusedPlayerId: string | null
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
  accused: string | null
  spyGuessedWord: boolean | null
  winner: 'spies' | 'players'
  outcome: 'time' | 'discovered' | 'wrong-accusation' | 'guessed' | 'missed'
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
}

export const MIN_PLAYERS = 3

export function maxSpies(playerCount: number) {
  return Math.max(1, Math.floor((playerCount - 1) / 2))
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickSpies(players: Player[], count: number): string[] {
  return shuffle(players)
    .slice(0, Math.min(count, Math.max(1, players.length - 1)))
    .map((player) => player.id)
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
    read<HistoryEntry[]>(KEYS.history, []).map((entry) => ({
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
      accused: entry.accused ?? null,
    })),
  saveHistory: (history: HistoryEntry[]) => write(KEYS.history, history),
}
