'use client'

import { useState } from 'react'
import { Button, Stack, Tile } from '@carbon/react'
import { Checkmark, Shuffle } from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { tone, vibrate } from '@/lib/feedback'

export function TieBreakScreen() {
  const { players, round, resolveTieBreak, goTo } = useGame()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  if (!round) return null

  const selected = players.filter((player) => selectedIds.includes(player.id))
  const toggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((currentId) => currentId !== id)
        : current.length < 2
          ? [...current, id]
          : current,
    )
  }

  const confirm = () => {
    if (selectedIds.length !== 2) return
    tone(520, 0.12)
    vibrate([30, 40, 30])
    resolveTieBreak(selectedIds)
  }

  return (
    <div className="screen">
      <header className="screen__head">
        <p className="screen__eyebrow">Empate na votação</p>
        <h1 className="screen__title">Quem vai para o desempate?</h1>
        <p className="screen__lead">
          Selecione as duas pessoas empatadas. O jogo sorteará uma delas como a votada.
        </p>
      </header>

      <p className="accusation__progress" aria-live="polite">
        {selectedIds.length} de 2 selecionados
      </p>
      <div className="name-grid" role="group" aria-label="Pessoas empatadas">
        {players.map((player) => {
          const isSelected = selectedIds.includes(player.id)
          return (
            <Button key={player.id} kind={isSelected ? 'primary' : 'tertiary'} size="lg"
              className="name-grid__item" aria-pressed={isSelected}
              disabled={!isSelected && selectedIds.length >= 2}
              renderIcon={isSelected ? Checkmark : undefined} onClick={() => toggle(player.id)}>
              {player.name}
            </Button>
          )
        })}
      </div>
      {selected.length === 2 ? (
        <Tile className="accusation__confirm">
          <p>O sorteio será entre <strong>{selected.map((player) => player.name).join(' e ')}</strong>.</p>
          <p>O resultado encerra a rodada e revela quem era o espião.</p>
        </Tile>
      ) : null}
      <Stack gap={3} className="screen__actions">
        <Button size="lg" renderIcon={Shuffle} disabled={selectedIds.length !== 2} onClick={confirm}>
          Sortear desempate
        </Button>
        <Button size="lg" kind="ghost" onClick={() => goTo('timer')}>Voltar à discussão</Button>
      </Stack>
    </div>
  )
}
