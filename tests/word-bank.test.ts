import { describe, expect, it } from 'vitest'
import { drawWord, getBank } from '../lib/word-bank'

describe('banco de palavras', () => {
  const bank = getBank()

  it('possui 15 categorias, 600 palavras e 1.200 dicas', () => {
    expect(bank).toHaveLength(15)
    expect(bank.flatMap((category) => category.words)).toHaveLength(600)
    expect(
      bank.flatMap((category) => category.words.flatMap((word) => word.h)),
    ).toHaveLength(1200)
    expect(bank.map((category) => category.name)).toEqual(
      expect.arrayContaining(['Novelas', 'História do Brasil', 'Atualidades']),
    )
  })

  it('equilibra as categorias ativas ao longo das rodadas', () => {
    const enabled = ['Filmes', 'Séries', 'Novelas']
    let used: string[] = []
    const counts = new Map(enabled.map((category) => [category, 0]))

    for (let round = 0; round < 12; round += 1) {
      const result = drawWord(enabled, used)
      used = result.usedKeys
      counts.set(result.draw.category, (counts.get(result.draw.category) ?? 0) + 1)
    }

    expect([...counts.values()]).toEqual([4, 4, 4])
  })

  it('mantém 40 palavras válidas em cada categoria', () => {
    for (const category of bank) {
      expect(category.words, category.name).toHaveLength(40)
      const normalized = category.words.map((word) =>
        word.w.trim().toLocaleLowerCase('pt-BR'),
      )
      expect(new Set(normalized).size, category.name).toBe(40)
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
