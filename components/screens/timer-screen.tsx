'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, ProgressBar, Stack, Tag, Tile } from '@carbon/react'
import { Add, Pause, Play, Subtract, UserFollow } from '@carbon/icons-react'
import { useGame } from '@/components/game-provider'
import { tone, vibrate } from '@/lib/feedback'
import { shouldRevealSpyHint } from '@/lib/game'

function format(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function TimerScreen() {
  const { players, settings, round, beginAccusation, expireRound } = useGame()
  const initial = settings.timerMinutes * 60
  const [total, setTotal] = useState(initial)
  const [left, setLeft] = useState(initial)
  const [running, setRunning] = useState(true)
  const [hintRevealed, setHintRevealed] = useState(false)
  const alerted = useRef(false)
  const endsAt = useRef(Date.now() + initial * 1000)

  const starter = players.find((player) => player.id === round?.starterId)

  useEffect(() => {
    if (!running) return
    const update = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endsAt.current - Date.now()) / 1000),
      )
      setLeft(remaining)
      if (remaining === 0) window.clearInterval(id)
    }
    const id = window.setInterval(update, 250)
    update()
    return () => window.clearInterval(id)
  }, [running])

  useEffect(() => {
    if (
      shouldRevealSpyHint(left, settings.spyGetsHint, round?.draw.hint) &&
      !hintRevealed
    ) {
      setHintRevealed(true)
      tone(520, 0.14, 0.035)
      vibrate([40, 40, 40])
    }
    if (left > 0 && left <= 10) {
      tone(left <= 3 ? 660 : 440, 0.05, 0.025)
      vibrate(20)
    }
    if (left === 0 && !alerted.current) {
      alerted.current = true
      setRunning(false)
      tone(180, 0.35, 0.05)
      vibrate([200, 100, 200])
      expireRound()
    }
  }, [
    expireRound,
    hintRevealed,
    left,
    round?.draw.hint,
    settings.spyGetsHint,
  ])

  const addMinute = () => {
    if (running) endsAt.current += 60_000
    setTotal((current) => current + 60)
    setLeft((current) => current + 60)
    alerted.current = false
  }

  const removeHalfMinute = () => {
    if (left <= 60) return
    if (running) endsAt.current -= 30_000
    setTotal((current) => Math.max(1, current - 30))
    setLeft((current) => Math.max(0, current - 30))
  }

  const toggleTimer = () => {
    if (running) {
      setLeft(
        Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000)),
      )
      setRunning(false)
      return
    }
    endsAt.current = Date.now() + left * 1000
    setRunning(true)
  }

  return (
    <div className="screen screen--card">
      <Tile className="timer">
        <p className="screen__eyebrow">Categoria da rodada</p>
        <Tag type="blue" size="md">
          {round?.draw.category ?? '—'}
        </Tag>

        <p className={`timer__clock${left === 0 ? ' timer__clock--over' : ''}`}>
          {format(left)}
        </p>
        <ProgressBar
          label="Tempo restante"
          hideLabel
          value={total - left}
          max={total}
        />

        <p className="timer__starter">
          Começa falando: <strong>{starter?.name ?? '—'}</strong>
        </p>
        <p className="timer__tip">
          Cada um diz uma palavra ligada ao segredo. Depois votem em quem parece
          ser o espião.
        </p>

        {hintRevealed && round?.draw.hint ? (
          <div className="timer__hint" role="status" aria-live="polite">
            <p className="screen__eyebrow">
              Dica recebida{' '}
              {round.spyIds.length === 1 ? 'pelo espião' : 'pelos espiões'}
            </p>
            <strong>{round.draw.hint}</strong>
            <p>Agora todos podem usar essa informação na discussão.</p>
          </div>
        ) : null}

        <Stack gap={3} className="timer__actions">
          <div className="timer__row">
            <Button
              kind="tertiary"
              size="lg"
              renderIcon={running ? Pause : Play}
              onClick={toggleTimer}
              disabled={left === 0}
            >
              {running ? 'Pausar' : 'Retomar'}
            </Button>
            <Button kind="tertiary" size="lg" renderIcon={Add} onClick={addMinute}>
              1 min
            </Button>
            <Button
              kind="tertiary"
              size="lg"
              renderIcon={Subtract}
              onClick={removeHalfMinute}
              disabled={left <= 60}
            >
              30 s
            </Button>
          </div>
          <Button
            size="lg"
            kind="danger"
            renderIcon={UserFollow}
            onClick={beginAccusation}
          >
            Apontar espião
          </Button>
        </Stack>
      </Tile>
    </div>
  )
}
