'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_SETTINGS,
  MIN_PLAYERS,
  createId,
  accusationDecision,
  lastChanceDecision,
  maxSpies,
  pickSpies,
  storage,
  TIME_EXPIRED_DECISION,
  type Phase,
  type HistoryEntry,
  type Player,
  type Round,
  type Settings,
} from '@/lib/game'
import { drawWord } from '@/lib/word-bank'

type GameContextValue = {
  ready: boolean
  phase: Phase
  players: Player[]
  settings: Settings
  round: Round | null
  history: HistoryEntry[]
  canStart: boolean
  goTo: (phase: Phase) => void
  addPlayer: (name: string) => void
  renamePlayer: (id: string, name: string) => void
  removePlayer: (id: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  startRound: () => void
  markRevealed: (id: string) => void
  finishReveal: () => void
  beginAccusation: () => void
  accusePlayers: (playerIds: string[]) => void
  expireRound: () => void
  resolveLastChance: (correct: boolean) => void
  playAgain: () => void
  backToLobby: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function useGame() {
  const value = useContext(GameContext)
  if (!value) throw new Error('useGame precisa estar dentro de GameProvider')
  return value
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState<Phase>('players')
  const [players, setPlayers] = useState<Player[]>([])
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [round, setRound] = useState<Round | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    setPlayers(storage.loadPlayers())
    setSettings(storage.loadSettings())
    setHistory(storage.loadHistory())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) storage.savePlayers(players)
  }, [players, ready])

  useEffect(() => {
    if (ready) storage.saveSettings(settings)
  }, [settings, ready])

  useEffect(() => {
    if (ready) storage.saveHistory(history)
  }, [history, ready])

  const addPlayer = useCallback((name: string) => {
    const clean = name.trim()
    if (!clean) return
    setPlayers((current) =>
      current.some((p) => p.name.toLowerCase() === clean.toLowerCase())
        ? current
        : [...current, { id: createId(), name: clean }],
    )
  }, [])

  const renamePlayer = useCallback((id: string, name: string) => {
    const clean = name.trim()
    if (!clean) return
    setPlayers((current) => {
      const duplicate = current.some(
        (player) =>
          player.id !== id &&
          player.name.toLocaleLowerCase('pt-BR') ===
            clean.toLocaleLowerCase('pt-BR'),
      )
      return duplicate
        ? current
        : current.map((player) =>
            player.id === id ? { ...player, name: clean } : player,
          )
    })
  }, [])

  const removePlayer = useCallback((id: string) => {
    setPlayers((current) => current.filter((p) => p.id !== id))
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...patch }))
  }, [])

  const startRound = useCallback(() => {
    if (players.length < MIN_PLAYERS) return
    const used = storage.loadUsed()
    const { draw, usedKeys } = drawWord(settings.enabledCategories, used)
    storage.saveUsed(usedKeys)

    const spyCount = Math.min(settings.spyCount, maxSpies(players.length))
    setRound({
      id: createId(),
      draw,
      spyIds: pickSpies(players, spyCount, history),
      revealedIds: [],
      spyGuessedWord: null,
      accusedPlayerIds: [],
      winner: null,
      outcome: null,
    })
    setPhase('reveal')
  }, [history, players, settings.enabledCategories, settings.spyCount])

  const markRevealed = useCallback((id: string) => {
    setRound((current) =>
      current && !current.revealedIds.includes(id)
        ? { ...current, revealedIds: [...current.revealedIds, id] }
        : current,
    )
  }, [])

  const finishReveal = useCallback(() => setPhase('timer'), [])

  const saveResult = useCallback(
    (finishedRound: Round) => {
      if (!finishedRound.winner || !finishedRound.outcome) return
      const winner = finishedRound.winner
      const outcome = finishedRound.outcome
      const spies = players
        .filter((player) => finishedRound.spyIds.includes(player.id))
        .map((player) => player.name)
      const accused = players
        .filter((player) => finishedRound.accusedPlayerIds.includes(player.id))
        .map((player) => player.name)
      setHistory((current) => [
        {
          id: finishedRound.id,
          playedAt: Date.now(),
          category: finishedRound.draw.category,
          word: finishedRound.draw.word,
          spies,
          accused,
          spyGuessedWord: finishedRound.spyGuessedWord,
          winner,
          outcome,
        },
        ...current.filter((entry) => entry.id !== finishedRound.id),
      ].slice(0, 20))
    },
    [players],
  )

  const beginAccusation = useCallback(() => setPhase('accusation'), [])

  const accusePlayers = useCallback(
    (playerIds: string[]) => {
      if (
        !round ||
        playerIds.length !== round.spyIds.length ||
        playerIds.some((id) => !players.some((player) => player.id === id))
      ) return
      const decision = accusationDecision(
        round.spyIds,
        playerIds,
        settings.oneSpyEliminatesTeam,
        settings.spyLastChance,
      )
      const accusedRound: Round = { ...round, accusedPlayerIds: playerIds }

      if (decision.needsLastChance) {
        setRound(accusedRound)
        setPhase('guess')
        return
      }

      const finishedRound: Round = {
        ...accusedRound,
        winner: decision.winner,
        outcome: decision.outcome,
      }
      setRound(finishedRound)
      saveResult(finishedRound)
      setPhase('result')
    },
    [
      players,
      round,
      saveResult,
      settings.oneSpyEliminatesTeam,
      settings.spyLastChance,
    ],
  )

  const expireRound = useCallback(() => {
    if (!round) return
    const finishedRound: Round = {
      ...round,
      winner: TIME_EXPIRED_DECISION.winner,
      outcome: TIME_EXPIRED_DECISION.outcome,
    }
    setRound(finishedRound)
    saveResult(finishedRound)
    setPhase('result')
  }, [round, saveResult])

  const resolveLastChance = useCallback(
    (correct: boolean) => {
      if (!round) return
      const decision = lastChanceDecision(correct)
      const finishedRound: Round = {
        ...round,
        spyGuessedWord: correct,
        winner: decision.winner,
        outcome: decision.outcome,
      }
      setRound(finishedRound)
      saveResult(finishedRound)
      setPhase('result')
    },
    [round, saveResult],
  )
  const playAgain = useCallback(() => startRound(), [startRound])

  const backToLobby = useCallback(() => {
    setRound(null)
    setPhase('players')
  }, [])

  // Corrige o número de espiões quando o grupo muda de tamanho.
  useEffect(() => {
    if (!ready || players.length < MIN_PLAYERS) return
    const limit = maxSpies(players.length)
    if (settings.spyCount > limit) {
      setSettings((current) => ({ ...current, spyCount: limit }))
    }
  }, [players.length, ready, settings.spyCount])

  const value = useMemo<GameContextValue>(
    () => ({
      ready,
      phase,
      players,
      settings,
      round,
      history,
      canStart: players.length >= MIN_PLAYERS,
      goTo: setPhase,
      addPlayer,
      renamePlayer,
      removePlayer,
      updateSettings,
      startRound,
      markRevealed,
      finishReveal,
      beginAccusation,
      accusePlayers,
      expireRound,
      resolveLastChance,
      playAgain,
      backToLobby,
    }),
    [
      addPlayer,
      backToLobby,
      accusePlayers,
      expireRound,
      beginAccusation,
      finishReveal,
      history,
      markRevealed,
      phase,
      playAgain,
      players,
      ready,
      removePlayer,
      renamePlayer,
      round,
      resolveLastChance,
      settings,
      startRound,
      updateSettings,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
