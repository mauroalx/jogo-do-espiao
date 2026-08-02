'use client'

import { Button, Stack, Tag, Tile } from '@carbon/react'
import { Checkmark, Close, UserAdmin } from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { tone, vibrate } from '@/lib/feedback'

export function GuessScreen() {
  const { players, round, resolveLastChance } = useGame()

  if (!round) return null

  const spies = players.filter((player) => round.spyIds.includes(player.id))

  const resolve = (correct: boolean) => {
    tone(correct ? 740 : 180, correct ? 0.18 : 0.28)
    vibrate(correct ? [80, 50, 80] : 180)
    resolveLastChance(correct)
  }

  return (
    <div className="screen screen--card">
      <Tile className="last-chance">
        <UserAdmin size={32} />
        <p className="screen__eyebrow">Última chance</p>
        <h1 className="last-chance__title">
          {spies.length === 1 ? 'O espião foi descoberto' : 'Os espiões foram descobertos'}
        </h1>
        <div className="result__spies">
          {spies.map((spy) => (
            <Tag key={spy.id} type="red" size="md">
              {spy.name}
            </Tag>
          ))}
        </div>
        <p className="last-chance__help">
          {spies.length === 1 ? 'O espião fala' : 'A equipe de espiões combina'}{' '}
          um único palpite em voz alta. Sem pesquisar e sem segunda tentativa.
        </p>
        <Stack gap={3} className="last-chance__actions">
          <Button size="lg" renderIcon={Checkmark} onClick={() => resolve(true)}>
            Acertou a palavra
          </Button>
          <Button
            size="lg"
            kind="danger--tertiary"
            renderIcon={Close}
            onClick={() => resolve(false)}
          >
            Errou a palavra
          </Button>
        </Stack>
      </Tile>
    </div>
  )
}
