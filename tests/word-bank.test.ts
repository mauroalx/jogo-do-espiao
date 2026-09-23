import { describe, expect, it } from 'vitest'
import { drawWord, getBank } from '../lib/word-bank'

describe('banco de palavras', () => {
  const bank = getBank()

  it('possui 7 categorias, 315 palavras e 630 dicas', () => {
    expect(bank).toHaveLength(7)
    expect(bank.flatMap((category) => category.words)).toHaveLength(315)
    expect(
      bank.flatMap((category) => category.words.flatMap((word) => word.h)),
    ).toHaveLength(630)
    expect(bank.map((category) => category.name)).toEqual([
      'Animes',
      'Objetos do dia a dia',
      'Séries',
      'Bandas',
      'Países e cidades',
      'Curiosidades',
      'Conhecimentos gerais',
    ])
  })

  it('equilibra as categorias ativas ao longo das rodadas', () => {
    const enabled = ['Animes', 'Séries', 'Bandas']
    let used: string[] = []
    const counts = new Map(enabled.map((category) => [category, 0]))

    for (let round = 0; round < 12; round += 1) {
      const result = drawWord(enabled, used)
      used = result.usedKeys
      counts.set(result.draw.category, (counts.get(result.draw.category) ?? 0) + 1)
    }

    expect([...counts.values()]).toEqual([4, 4, 4])
  })

  it('mantém 45 palavras válidas em cada categoria', () => {
    for (const category of bank) {
      expect(category.words, category.name).toHaveLength(45)
      const normalized = category.words.map((word) =>
        word.w.trim().toLocaleLowerCase('pt-BR'),
      )
      expect(new Set(normalized).size, category.name).toBe(45)
    }
  })

  it('mantém duas dicas distintas e não literais por palavra', () => {
    for (const category of bank) {
      for (const word of category.words) {
        expect(word.h, `${category.name}: ${word.w}`).toHaveLength(2)
        const normalizedWord = word.w.trim().toLocaleLowerCase('pt-BR')
        const hints = word.h.map((hint) => hint.trim().toLocaleLowerCase('pt-BR'))
        expect(hints.every(Boolean), `${category.name}: ${word.w}`).toBe(true)
        expect(new Set(hints).size, `${category.name}: ${word.w}`).toBe(2)
        expect(hints).not.toContain(normalizedWord)
      }
    }
  })
})
