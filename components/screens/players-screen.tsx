'use client'

import { useState } from 'react'
import {
  Button,
  IconButton,
  InlineNotification,
  Stack,
  Tag,
  TextInput,
  Tile,
} from '@carbon/react'
import {
  Add,
  Checkmark,
  Edit,
  Play,
  Settings,
  TrashCan,
  UserMultiple,
} from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { MIN_PLAYERS, maxSpies } from '@/lib/game'

export function PlayersScreen() {
  const {
    players,
    settings,
    history,
    addPlayer,
    renamePlayer,
    removePlayer,
    canStart,
    startRound,
    goTo,
  } = useGame()
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const editingDuplicate = players.some(
    (player) =>
      player.id !== editingId &&
      player.name.toLocaleLowerCase('pt-BR') ===
        editingName.trim().toLocaleLowerCase('pt-BR'),
  )
  const nameDuplicate = players.some(
    (player) =>
      player.name.toLocaleLowerCase('pt-BR') ===
      name.trim().toLocaleLowerCase('pt-BR'),
  )

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (nameDuplicate) return
    addPlayer(name)
    setName('')
  }

  const spies = Math.min(settings.spyCount, maxSpies(Math.max(players.length, 3)))

  return (
    <div className="screen">
      <header className="screen__head">
        <p className="screen__eyebrow">Passe o celular entre os amigos</p>
        <h1 className="screen__title">Quem é o espião?</h1>
        <p className="screen__lead">
          Todos veem a categoria. Só o espião não sabe a palavra e precisa
          disfarçar até o fim.
        </p>
      </header>

      <form onSubmit={submit} className="add-player">
        <TextInput
          id="player-name"
          labelText="Adicionar jogador"
          placeholder="Nome do jogador"
          value={name}
          maxLength={18}
          invalid={nameDuplicate}
          invalidText="Esse nome já está na lista."
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return
          }}
        />
        <Button
          type="submit"
          renderIcon={Add}
          iconDescription="Adicionar"
          hasIconOnly
          disabled={!name.trim() || nameDuplicate}
          kind="primary"
          size="lg"
        />
      </form>

      <div className="players__meta">
        <span className="players__count">
          <UserMultiple size={16} /> {players.length}{' '}
          {players.length === 1 ? 'jogador' : 'jogadores'}
        </span>
        {canStart ? (
          <Tag type="red" size="sm">
            {spies} {spies === 1 ? 'espião' : 'espiões'}
          </Tag>
        ) : null}
      </div>

      {players.length === 0 ? (
        <Tile className="empty">
          <p>Nenhum jogador ainda. Adicione o grupo — a lista fica salva neste aparelho.</p>
        </Tile>
      ) : (
        <ul className="player-list">
          {players.map((player) => (
            <li key={player.id}>
              <Tile className="player-row">
                {editingId === player.id ? (
                  <form
                    className="player-row__edit"
                    onSubmit={(event) => {
                      event.preventDefault()
                      if (editingDuplicate) return
                      renamePlayer(player.id, editingName)
                      setEditingId(null)
                    }}
                  >
                    <TextInput
                      id={`edit-${player.id}`}
                      labelText={`Novo nome de ${player.name}`}
                      hideLabel
                      value={editingName}
                      maxLength={18}
                      autoFocus
                      invalid={editingDuplicate}
                      invalidText="Esse nome já está na lista."
                      onChange={(event) => setEditingName(event.target.value)}
                    />
                    <IconButton
                      type="submit"
                      label={`Salvar nome de ${player.name}`}
                      kind="ghost"
                      size="sm"
                      disabled={!editingName.trim() || editingDuplicate}
                    >
                      <Checkmark size={16} />
                    </IconButton>
                  </form>
                ) : (
                  <>
                    <span className="player-row__name">{player.name}</span>
                    <span className="player-row__actions">
                      <IconButton
                        label={`Renomear ${player.name}`}
                        kind="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(player.id)
                          setEditingName(player.name)
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        label={`Remover ${player.name}`}
                        kind="ghost"
                        size="sm"
                        align="left"
                        onClick={() => removePlayer(player.id)}
                      >
                        <TrashCan size={16} />
                      </IconButton>
                    </span>
                  </>
                )}
              </Tile>
            </li>
          ))}
        </ul>
      )}

      {!canStart && players.length > 0 ? (
        <InlineNotification
          lowContrast
          kind="info"
          hideCloseButton
          title="Faltam jogadores"
          subtitle={`São necessários pelo menos ${MIN_PLAYERS} jogadores.`}
        />
      ) : null}

      <Stack gap={3} className="screen__actions">
        <Button
          size="lg"
          renderIcon={Play}
          disabled={!canStart}
          onClick={startRound}
        >
          Começar rodada
        </Button>
        <Button
          size="lg"
          kind="tertiary"
          renderIcon={Settings}
          onClick={() => goTo('settings')}
        >
          Configurar jogo
        </Button>
      </Stack>

      {history.length > 0 ? (
        <section className="history" aria-labelledby="history-title">
          <div className="history__head">
            <p className="screen__eyebrow">Neste aparelho</p>
            <h2 id="history-title" className="history__title">
              Rodadas recentes
            </h2>
          </div>
          <ol className="history__list">
            {history.slice(0, 5).map((entry) => (
              <li key={entry.id}>
                <Tile className="history__item">
                  <div>
                    <strong>{entry.word}</strong>
                    <p>
                      {entry.category} · {entry.spies.join(', ')}
                    </p>
                    {entry.accused.length > 0 ? (
                      <p>Apontados pelo grupo: {entry.accused.join(', ')}</p>
                    ) : null}
                  </div>
                  <Tag
                    type={entry.winner === 'spies' ? 'red' : 'green'}
                    size="sm"
                  >
                    {entry.winner === 'spies' ? 'Espião venceu' : 'Grupo venceu'}
                  </Tag>
                </Tile>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  )
}
