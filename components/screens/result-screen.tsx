'use client'

import { Button, Stack, Tag, Tile } from '@carbon/react'
import { Home, Renew } from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'

export function ResultScreen() {
  const { players, round, playAgain, backToLobby } = useGame()

  if (!round) return null

  const spies = players.filter((player) => round.spyIds.includes(player.id))
  const accused = players.filter((player) =>
    round.accusedPlayerIds.includes(player.id),
  )
  const accusedNames = accused.map((player) => player.name).join(', ')
  const correctlyAccused = accused.filter((player) =>
    round.spyIds.includes(player.id),
  )
  const foundEverySpy = correctlyAccused.length === round.spyIds.length
  const tieBreakWinner = players.find((player) => player.id === round.tieBreakWinnerId)

  return (
    <div className="screen screen--card">
      <Tile className="result">
        {round.winner ? (
          <Tag type={round.winner === 'spies' ? 'red' : 'green'} size="md">
            {round.winner === 'spies'
              ? spies.length === 1
                ? 'Vitória do espião'
                : 'Vitória dos espiões'
              : 'Vitória dos jogadores'}
          </Tag>
        ) : null}
        {round.outcome === 'time' ? (
          <p className="result__outcome">
            O tempo acabou antes que o espião fosse descoberto.
          </p>
        ) : null}
        {round.outcome === 'wrong-accusation' && accused.length > 0 ? (
          <p className="result__outcome">
            O grupo apontou {accusedNames}, mas não cumpriu a condição para
            encontrar os espiões.
          </p>
        ) : null}
        {round.outcome === 'tie-break' && tieBreakWinner ? (
          <p className="result__outcome">
            No desempate, o jogo sorteou <strong>{tieBreakWinner.name}</strong> entre os dois empatados.
          </p>
        ) : null}
        {round.outcome !== 'time' &&
        round.outcome !== 'wrong-accusation' &&
        round.outcome !== 'tie-break' &&
        accused.length > 0 ? (
          <p className="result__outcome">
            {foundEverySpy
              ? `O grupo encontrou todos os espiões ao apontar ${accusedNames}.`
              : `O grupo encontrou ${correctlyAccused.map((player) => player.name).join(', ')} e, pela regra da mesa, eliminou toda a equipe.`}
          </p>
        ) : null}
        <p className="screen__eyebrow">A palavra era</p>
        <h2 className="result__word">{round.draw.word}</h2>
        <Tag type="blue" size="md">
          {round.draw.category}
        </Tag>

        <div className="result__block">
          <p className="screen__eyebrow">
            {spies.length === 1 ? 'O espião era' : 'Os espiões eram'}
          </p>
          <div className="result__spies">
            {spies.map((spy) => (
              <Tag key={spy.id} type="red" size="md">
                {spy.name}
              </Tag>
            ))}
          </div>
          {round.draw.hint ? (
            <p className="result__hint">Dica do espião: {round.draw.hint}</p>
          ) : null}
          {round.spyGuessedWord !== null ? (
            <Tag type={round.spyGuessedWord ? 'green' : 'gray'} size="md">
              {round.spyGuessedWord
                ? 'O espião acertou a palavra'
                : 'O espião errou a palavra'}
            </Tag>
          ) : null}
        </div>

        <Stack gap={3} className="result__actions">
          <Button size="lg" renderIcon={Renew} onClick={playAgain}>
            Nova rodada, mesmo grupo
          </Button>
          <Button size="lg" kind="tertiary" renderIcon={Home} onClick={backToLobby}>
            Voltar ao início
          </Button>
        </Stack>
      </Tile>
    </div>
  )
}
