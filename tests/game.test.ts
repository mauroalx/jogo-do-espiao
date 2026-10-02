import { describe, expect, it } from 'vitest'
import {
  TIME_EXPIRED_DECISION,
  accusationDecision,
  accusationFoundSpies,
  lastChanceDecision,
  normalizeHistory,
  pickSpies,
  pickStarter,
  shouldRevealSpyHint,
  spyTurnCounts,
  isSuperAdminName,
} from '../lib/game'

describe('super admin', () => {
  it('reconhece somente Mauro com normalização de caixa, acento e espaços', () => {
    expect(isSuperAdminName('mauro')).toBe(true)
    expect(isSuperAdminName(' MAURO ')).toBe(true)
    expect(isSuperAdminName('Máuro')).toBe(true)
    expect(isSuperAdminName('Maurício')).toBe(false)
    expect(isSuperAdminName('Mauro Silva')).toBe(false)
  })
})

describe('accusationFoundSpies', () => {
  it('exige exatamente a quantidade de acusações da rodada', () => {
    expect(accusationFoundSpies(['s1', 's2'], ['s1'], false)).toBe(false)
    expect(accusationFoundSpies(['s1'], ['s1', 'p1'], true)).toBe(false)
  })

  it('rejeita a repetição do mesmo jogador', () => {
    expect(accusationFoundSpies(['s1', 's2'], ['s1', 's1'], true)).toBe(false)
  })

  it.each([
    [['s1'], ['s1'], true],
    [['s1', 's2'], ['s2', 's1'], true],
    [['s1', 's2', 's3'], ['s3', 's1', 's2'], true],
  ])('exige todos os espiões na regra padrão', (spies, accused, expected) => {
    expect(accusationFoundSpies(spies, accused, false)).toBe(expected)
  })

  it.each([
    [['s1', 's2'], ['s1', 'p1'], false],
    [['s1', 's2', 's3'], ['s1', 's2', 'p1'], false],
    [['s1', 's2', 's3'], ['p1', 'p2', 'p3'], false],
  ])('rejeita seleção parcial na regra padrão', (spies, accused, expected) => {
    expect(accusationFoundSpies(spies, accused, false)).toBe(expected)
  })

  it('aceita um único acerto quando a eliminação da equipe está ligada', () => {
    expect(accusationFoundSpies(['s1', 's2'], ['s1', 'p1'], true)).toBe(true)
    expect(
      accusationFoundSpies(['s1', 's2', 's3'], ['p1', 's2', 'p2'], true),
    ).toBe(true)
    expect(
      accusationFoundSpies(['s1', 's2', 's3'], ['p1', 'p2', 'p3'], true),
    ).toBe(false)
  })
})

describe('desfechos da rodada', () => {
  it('dá a vitória aos espiões quando a acusação falha', () => {
    expect(accusationDecision(['s1', 's2'], ['s1', 'p1'], false, true)).toEqual({
      winner: 'spies',
      outcome: 'wrong-accusation',
      needsLastChance: false,
    })
  })

  it('abre a última chance somente depois de uma acusação vitoriosa', () => {
    expect(accusationDecision(['s1', 's2'], ['s1', 's2'], false, true)).toEqual({
      winner: null,
      outcome: null,
      needsLastChance: true,
    })
    expect(accusationDecision(['s1'], ['s1'], false, false).winner).toBe(
      'players',
    )
  })

  it('resolve o palpite em equipe e o tempo esgotado', () => {
    expect(lastChanceDecision(true).winner).toBe('spies')
    expect(lastChanceDecision(false).winner).toBe('players')
    expect(TIME_EXPIRED_DECISION).toMatchObject({
      winner: 'spies',
      outcome: 'time',
    })
  })
})

describe('normalizeHistory', () => {
  it('migra uma acusação antiga para a lista nova', () => {
    const [entry] = normalizeHistory([
      {
        id: 'round-1',
        playedAt: 1,
        category: 'Filmes',
        word: 'matrix',
        spies: ['Ana'],
        accused: 'Ana',
        spyGuessedWord: null,
        winner: 'players',
        outcome: 'discovered',
      },
    ])
    expect(entry.accused).toEqual(['Ana'])
  })

  it('preenche o resultado ausente de históricos mais antigos', () => {
    const [entry] = normalizeHistory([
      {
        id: 'round-0',
        playedAt: 1,
        category: 'Animais',
        word: 'lobo',
        spies: ['Bia'],
        spyGuessedWord: null,
      },
    ])
    expect(entry.accused).toEqual([])
    expect(entry.starter).toBeNull()
    expect(entry.winner).toBe('players')
    expect(entry.outcome).toBe('discovered')
  })
})

describe('dica no fim do cronômetro', () => {
  it('aparece somente nos 60 segundos finais quando o espião recebeu dica', () => {
    expect(shouldRevealSpyHint(61, true, 'contexto')).toBe(false)
    expect(shouldRevealSpyHint(60, true, 'contexto')).toBe(true)
    expect(shouldRevealSpyHint(1, true, 'contexto')).toBe(true)
    expect(shouldRevealSpyHint(0, true, 'contexto')).toBe(false)
    expect(shouldRevealSpyHint(30, false, 'contexto')).toBe(false)
    expect(shouldRevealSpyHint(30, true, null)).toBe(false)
  })
})

const table = [
  { id: 'mauro', name: 'Mauro' },
  { id: 'joao', name: 'João' },
  { id: 'jose', name: 'José' },
  { id: 'jeniffer', name: 'Jeniffer' },
]

describe('pickSpies', () => {
  it('dá 10% mais peso às grafias-alvo, ignorando caixa, acento e espaços', () => {
    const players = [
      { id: 'jen', name: ' JÉN ' },
      { id: 'ana', name: 'Ana' },
    ]
    const samples = Array.from({ length: 30000 }, () => pickSpies(players, 1)[0])
    const jenShare = samples.filter((id) => id === 'jen').length / samples.length
    expect(jenShare).toBeGreaterThan(0.515)
    expect(jenShare).toBeLessThan(0.535)
  })
  it('devolve a quantidade pedida, sem repetir na mesma rodada', () => {
    const spies = pickSpies(table, 2, [])
    expect(spies).toHaveLength(2)
    expect(new Set(spies).size).toBe(2)
    expect(spies.every((id) => table.some((player) => player.id === id))).toBe(
      true,
    )
  })

  it('nunca transforma a mesa inteira em espião', () => {
    expect(pickSpies(table, 8, [])).toHaveLength(3)
  })

  it('não torna óbvio quem ainda não foi: quem já saiu ainda pode repetir', () => {
    const history = [
      { spies: ['José'] },
      { spies: ['João'] },
      { spies: ['José'] },
      { spies: ['João'] },
    ]
    const samples = Array.from({ length: 4000 }, () =>
      pickSpies(table, 1, history)[0],
    )
    const alreadyWent =
      samples.filter((id) => id === 'joao' || id === 'jose').length / samples.length
    const notYet =
      samples.filter((id) => id === 'jeniffer' || id === 'mauro').length /
      samples.length

    expect(notYet).toBeGreaterThan(0.55)
    expect(alreadyWent).toBeGreaterThan(0.18)
    expect(alreadyWent).toBeLessThan(0.45)
  })

  it('equilibra a mesa em 10 rodadas melhor do que o acaso puro', () => {
    const spreads: number[] = []
    const neverSpy: number[] = []

    for (let session = 0; session < 500; session += 1) {
      const history: { spies: string[] }[] = []
      const counts = new Map(table.map((player) => [player.name, 0]))

      for (let round = 0; round < 10; round += 1) {
        const [spyId] = pickSpies(table, 1, history)
        const spy = table.find((player) => player.id === spyId)
        if (!spy) throw new Error('espião inválido')
        counts.set(spy.name, (counts.get(spy.name) ?? 0) + 1)
        history.unshift({ spies: [spy.name] })
      }

      const values = [...counts.values()]
      spreads.push(Math.max(...values) - Math.min(...values))
      neverSpy.push(values.filter((value) => value === 0).length)
    }

    const meanSpread = spreads.reduce((sum, value) => sum + value, 0) / spreads.length
    const meanNever =
      neverSpy.reduce((sum, value) => sum + value, 0) / neverSpy.length

    expect(meanSpread).toBeLessThan(2.4)
    expect(meanNever).toBeLessThan(0.15)
  })

  it('quem entra no meio da mesa pesa mais, mas não vira o próximo automático', () => {
    const withNewcomer = [...table, { id: 'paulo', name: 'Paulo' }]
    const history = [
      { spies: ['Jeniffer'] },
      { spies: ['José'] },
      { spies: ['João'] },
      { spies: ['Mauro'] },
      { spies: ['José'] },
      { spies: ['João'] },
      { spies: ['Mauro'] },
      { spies: ['Jeniffer'] },
    ]
    expect(spyTurnCounts(withNewcomer, history).get('paulo')).toBe(0)

    const samples = Array.from({ length: 3000 }, () =>
      pickSpies(withNewcomer, 1, history)[0],
    )
    const pauloShare =
      samples.filter((id) => id === 'paulo').length / samples.length
    expect(pauloShare).toBeGreaterThan(0.28)
    expect(pauloShare).toBeLessThan(0.52)
  })
})

describe('pickStarter', () => {
  it('evita repetir quem acabou de começar', () => {
    const history = [
      { starter: 'José' },
      { starter: 'João' },
      { starter: 'Mauro' },
    ]
    const samples = Array.from({ length: 3000 }, () =>
      pickStarter(table, history),
    )
    const lastShare =
      samples.filter((id) => id === 'jose').length / samples.length
    expect(lastShare).toBeLessThan(0.12)
  })

  it('equilibra quem começa ao longo das rodadas', () => {
    const spreads: number[] = []
    const neverStart: number[] = []

    for (let session = 0; session < 400; session += 1) {
      const history: { starter: string }[] = []
      const counts = new Map(table.map((player) => [player.id, 0]))

      for (let round = 0; round < 12; round += 1) {
        const starterId = pickStarter(table, history)
        counts.set(starterId, (counts.get(starterId) ?? 0) + 1)
        const starter = table.find((player) => player.id === starterId)
        if (!starter) throw new Error('starter inválido')
        history.unshift({ starter: starter.name })
      }

      const values = [...counts.values()]
      spreads.push(Math.max(...values) - Math.min(...values))
      neverStart.push(values.filter((value) => value === 0).length)
    }

    const meanSpread =
      spreads.reduce((sum, value) => sum + value, 0) / spreads.length
    const meanNever =
      neverStart.reduce((sum, value) => sum + value, 0) / neverStart.length

    expect(meanSpread).toBeLessThan(2.6)
    expect(meanNever).toBeLessThan(0.08)
  })
})
