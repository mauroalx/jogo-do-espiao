'use client'

import { useState } from 'react'
import { Button, Stack, Tile } from '@carbon/react'
import { Checkmark, UserFollow } from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { tone, vibrate } from '@/lib/feedback'

export function AccusationScreen() {
  const { players, round, accusePlayers } = useGame()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  if (!round) return null

  const required = round.spyIds.length
  const selected = players.filter((player) => selectedIds.includes(player.id))
  const complete = selectedIds.length === required

  const toggle = (playerId: string) => {
    setSelectedIds((current) => {
      if (current.includes(playerId)) {
        return current.filter((id) => id !== playerId)
      }
      return current.length < required ? [...current, playerId] : current
    })
  }

  const confirm = () => {
    if (!complete) return
    tone(320, 0.12)
    vibrate(60)
    accusePlayers(selectedIds)
  }

  return (
    <div className="screen">
      <header className="screen__head">
        <p className="screen__eyebrow">Votação concluída</p>
        <h1 className="screen__title">
          {required === 1 ? 'Quem o grupo aponta?' : 'Quem o grupo aponta como espiões?'}
        </h1>
        <p className="screen__lead">
          Conversem e votem em voz alta. Depois, selecione apenas o nome escolhido
          pela maioria. Escolha {required} {required === 1 ? 'pessoa' : 'pessoas'}.
        </p>
      </header>

      <p className="accusation__progress" aria-live="polite">
        {selectedIds.length} de {required} selecionados
      </p>

      <div className="name-grid" role="group" aria-label="Suspeitos escolhidos">
        {players.map((player) => {
          const selectedPlayer = selectedIds.includes(player.id)
          return (
            <Button
              key={player.id}
              kind={selectedPlayer ? 'primary' : 'tertiary'}
              size="lg"
              className="name-grid__item"
              aria-pressed={selectedPlayer}
              disabled={!selectedPlayer && selectedIds.length >= required}
              renderIcon={selectedPlayer ? Checkmark : undefined}
              onClick={() => toggle(player.id)}
            >
              {player.name}
            </Button>
          )
        })}
      </div>

      {selected.length > 0 ? (
        <Tile className="accusation__confirm">
          <p>
            O grupo está apontando{' '}
            <strong>{selected.map((player) => player.name).join(', ')}</strong>.
          </p>
          <p>Depois de confirmar, o papel será revelado.</p>
        </Tile>
      ) : null}

      <Stack gap={3} className="screen__actions">
        <Button
          size="lg"
          renderIcon={UserFollow}
          disabled={!complete}
          onClick={confirm}
        >
          Confirmar acusação
        </Button>
      </Stack>
    </div>
  )
}
