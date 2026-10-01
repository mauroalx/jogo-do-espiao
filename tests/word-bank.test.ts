import { describe, expect, it } from 'vitest'
import { drawWord, getBank } from '../lib/word-bank'

describe('banco de palavras', () => {
  const bank = getBank()

  it('possui 7 categorias, 350 palavras e 700 dicas', () => {
    expect(bank).toHaveLength(7)
    expect(bank.flatMap((category) => category.words)).toHaveLength(350)
    expect(
      bank.flatMap((category) => category.words.flatMap((word) => word.h)),
    ).toHaveLength(700)
    expect(bank.map((category) => category.name)).toEqual([
      'Animações',
      'Atualidades',
      'Esportes',
      'Objetos do dia a dia',
      'Conhecimentos gerais',
      'Profissões',
      'Área da saúde',
    ])
  })

  it('equilibra as categorias ativas ao longo das rodadas', () => {
    const enabled = ['Animações', 'Atualidades', 'Esportes']
    let used: string[] = []
    const counts = new Map(enabled.map((category) => [category, 0]))

    for (let round = 0; round < 12; round += 1) {
      const result = drawWord(enabled, used)
      used = result.usedKeys
      counts.set(result.draw.category, (counts.get(result.draw.category) ?? 0) + 1)
    }

    expect([...counts.values()]).toEqual([4, 4, 4])
  })

  it('mantém 50 palavras válidas em cada categoria', () => {
    for (const category of bank) {
      expect(category.words, category.name).toHaveLength(50)
      const normalized = category.words.map((word) =>
        word.w.trim().toLocaleLowerCase('pt-BR'),
      )
      expect(new Set(normalized).size, category.name).toBe(50)
    }
  })

  it('não repete palavras entre categorias, mesmo com caixa ou acento diferentes', () => {
    const allWords = bank.flatMap((category) => category.words.map((word) => word.w))
    const normalized = allWords.map((word) =>
      word
        .trim()
        .toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
    )
    expect(new Set(normalized).size).toBe(normalized.length)
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
        expect(
          hints.every((hint) => !/— situação \d+$/.test(hint)),
          `${category.name}: ${word.w}`,
        ).toBe(true)
      }
    }
  })
})
