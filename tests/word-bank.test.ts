import { describe, expect, it } from 'vitest'
import { getBank } from '../lib/word-bank'

describe('banco de palavras', () => {
  const bank = getBank()

  it('possui 12 categorias, 480 palavras e 960 dicas', () => {
    expect(bank).toHaveLength(12)
    expect(bank.flatMap((category) => category.words)).toHaveLength(480)
    expect(
      bank.flatMap((category) => category.words.flatMap((word) => word.h)),
    ).toHaveLength(960)
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
