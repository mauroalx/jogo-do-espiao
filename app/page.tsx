'use client'

import { SkeletonText } from '@carbon/react'
import { GameProvider, useGame } from '@/components/game-provider'
import { PlayersScreen } from '@/components/screens/players-screen'
import { SettingsScreen } from '@/components/screens/settings-screen'
import { RevealScreen } from '@/components/screens/reveal-screen'
import { TimerScreen } from '@/components/screens/timer-screen'
import { ResultScreen } from '@/components/screens/result-screen'
import { GuessScreen } from '@/components/screens/guess-screen'
import { AccusationScreen } from '@/components/screens/accusation-screen'

function CurrentScreen() {
  const { ready, phase } = useGame()

  if (!ready) {
    return (
      <div className="screen">
        <SkeletonText heading />
        <SkeletonText paragraph lineCount={4} />
      </div>
    )
  }

  switch (phase) {
    case 'settings':
      return <SettingsScreen />
    case 'reveal':
      return <RevealScreen />
    case 'timer':
      return <TimerScreen />
    case 'accusation':
      return <AccusationScreen />
    case 'guess':
      return <GuessScreen />
    case 'result':
      return <ResultScreen />
    default:
      return <PlayersScreen />
  }
}

export default function Page() {
  return (
    <main id="main-content" className="page-main">
      <GameProvider>
        <CurrentScreen />
      </GameProvider>
    </main>
  )
}
