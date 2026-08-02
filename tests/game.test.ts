import { describe, expect, it } from 'vitest'
import {
  TIME_EXPIRED_DECISION,
  accusationDecision,
  accusationFoundSpies,
  lastChanceDecision,
  normalizeHistory,
} from '../lib/game'

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
    expect(entry.winner).toBe('players')
    expect(entry.outcome).toBe('discovered')
  })
})
