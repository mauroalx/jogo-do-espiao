'use client'

import { useState } from 'react'
import { Button, Stack, Tile } from '@carbon/react'
import { Checkmark, UserFollow } from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { tone, vibrate } from '@/lib/feedback'

export function AccusationScreen() {
  const { players, accusePlayer } = useGame()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = players.find((player) => player.id === selectedId)

  const confirm = () => {
    if (!selectedId) return
    tone(320, 0.12)
    vibrate(60)
    accusePlayer(selectedId)
  }

  return (
    <div className="screen">
      <header className="screen__head">
        <p className="screen__eyebrow">Votação concluída</p>
        <h1 className="screen__title">Quem o grupo aponta?</h1>
        <p className="screen__lead">
          Conversem e votem em voz alta. Depois, selecione apenas o nome escolhido
          pela maioria.
        </p>
      </header>

      <div className="name-grid" role="radiogroup" aria-label="Suspeito escolhido">
        {players.map((player) => {
          const selectedPlayer = player.id === selectedId
          return (
            <Button
              key={player.id}
              kind={selectedPlayer ? 'primary' : 'tertiary'}
              size="lg"
              className="name-grid__item"
              role="radio"
              aria-checked={selectedPlayer}
              renderIcon={selectedPlayer ? Checkmark : undefined}
              onClick={() => setSelectedId(player.id)}
            >
              {player.name}
            </Button>
          )
        })}
      </div>

      {selected ? (
        <Tile className="accusation__confirm">
          <p>
            O grupo está apontando <strong>{selected.name}</strong>.
          </p>
          <p>Depois de confirmar, o papel será revelado.</p>
        </Tile>
      ) : null}

      <Stack gap={3} className="screen__actions">
        <Button
          size="lg"
          renderIcon={UserFollow}
          disabled={!selected}
          onClick={confirm}
        >
          Confirmar acusação
        </Button>
      </Stack>
    </div>
  )
}
