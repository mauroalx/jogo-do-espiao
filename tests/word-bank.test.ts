import { describe, expect, it } from 'vitest'
import { getBank } from '../lib/word-bank'

describe('banco de palavras', () => {
  const bank = getBank()

  it('possui 12 categorias, 360 palavras e 720 dicas', () => {
    expect(bank).toHaveLength(12)
    expect(bank.flatMap((category) => category.words)).toHaveLength(360)
    expect(
      bank.flatMap((category) => category.words.flatMap((word) => word.h)),
    ).toHaveLength(720)
  })

  it('mantém 30 palavras válidas em cada categoria', () => {
    for (const category of bank) {
      expect(category.words, category.name).toHaveLength(30)
      const normalized = category.words.map((word) =>
        word.w.trim().toLocaleLowerCase('pt-BR'),
      )
      expect(new Set(normalized).size, category.name).toBe(30)
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
