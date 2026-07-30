'use client'

import { useState } from 'react'
import { Button, ProgressBar, Stack, Tag, Tile } from '@carbon/react'
import {
  ArrowRight,
  Checkmark,
  UserAdmin,
  View,
  ViewOff,
} from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { tone } from '@/lib/feedback'

export function RevealScreen() {
  const { players, settings, round, markRevealed, finishReveal, backToLobby } =
    useGame()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showRole, setShowRole] = useState(false)

  if (!round) return null

  const active = players.find((player) => player.id === activeId) ?? null
  const revealedCount = round.revealedIds.length
  const allRevealed = revealedCount === players.length
  const isSpy = active ? round.spyIds.includes(active.id) : false
  const partners = players.filter(
    (player) => round.spyIds.includes(player.id) && player.id !== activeId,
  )

  const close = () => {
    if (active) markRevealed(active.id)
    setShowRole(false)
    setActiveId(null)
  }

  if (active) {
    return (
      <div className="screen screen--card">
        {!showRole ? (
          <Tile className="role-card role-card--closed">
            <ViewOff size={32} />
            <p className="role-card__eyebrow">Passe o celular para</p>
            <h2 className="role-card__name">{active.name}</h2>
            <p className="role-card__hint">
              Ninguém mais pode olhar a tela agora.
            </p>
            <Stack gap={3} className="role-card__actions">
              <Button
                size="lg"
                renderIcon={View}
                onClick={() => {
                  tone(440)
                  setShowRole(true)
                }}
              >
                Sou {active.name}, mostrar
              </Button>
              <Button size="lg" kind="ghost" onClick={() => setActiveId(null)}>
                Não sou eu
              </Button>
            </Stack>
          </Tile>
        ) : (
          <Tile className={`role-card${isSpy ? ' role-card--spy' : ''}`}>
            {isSpy ? (
              <>
                <Tag type="red" size="md">
                  Você é o espião
                </Tag>
                {settings.showCategoryToEveryone ? (
                  <p className="role-card__eyebrow">Categoria: {round.draw.category}</p>
                ) : null}
                <h2 className="role-card__word">?</h2>
                {settings.spyGetsHint && round.draw.hint ? (
                  <p className="role-card__hint">
                    Sua dica: <strong>{round.draw.hint}</strong>
                  </p>
                ) : (
                  <p className="role-card__hint">
                    Você não recebeu dica. Preste atenção no que os outros falam.
                  </p>
                )}
                {settings.spiesKnowEachOther && partners.length > 0 ? (
                  <p className="role-card__partners">
                    <UserAdmin size={16} /> Também são espiões:{' '}
                    {partners.map((partner) => partner.name).join(', ')}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <Tag type="green" size="md">
                  Você não é o espião
                </Tag>
                <p className="role-card__eyebrow">Categoria: {round.draw.category}</p>
                <h2 className="role-card__word">{round.draw.word}</h2>
                <p className="role-card__hint">
                  Dê pistas sutis. Se for óbvio, o espião descobre.
                </p>
              </>
            )}
            <Stack gap={3} className="role-card__actions">
              <Button size="lg" renderIcon={ArrowRight} onClick={close}>
                Ocultar e passar
              </Button>
            </Stack>
          </Tile>
        )}
      </div>
    )
  }

  return (
    <div className="screen">
      <header className="screen__head">
        <p className="screen__eyebrow">Rodada iniciada</p>
        <h1 className="screen__title">Cada um toca no seu nome</h1>
      </header>

      <ProgressBar
        label="Progresso da revelação"
        helperText={`${revealedCount} de ${players.length} já viram`}
        value={revealedCount}
        max={players.length}
      />

      <div className="name-grid">
        {players.map((player) => {
          const done = round.revealedIds.includes(player.id)
          return (
            <Button
              key={player.id}
              kind={done ? 'tertiary' : 'primary'}
              size="lg"
              className="name-grid__item"
              disabled={done}
              renderIcon={done ? Checkmark : undefined}
              onClick={() => {
                setShowRole(false)
                setActiveId(player.id)
              }}
            >
              {player.name}
            </Button>
          )
        })}
      </div>

      <Stack gap={3} className="screen__actions">
        <Button
          size="lg"
          renderIcon={ArrowRight}
          disabled={!allRevealed}
          onClick={finishReveal}
        >
          {allRevealed ? 'Iniciar discussão' : 'Aguardando todos verem'}
        </Button>
        <Button size="lg" kind="ghost" onClick={backToLobby}>
          Cancelar rodada
        </Button>
      </Stack>
    </div>
  )
}
