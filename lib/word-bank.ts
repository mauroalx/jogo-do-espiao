import { ENCODED_BANK } from './word-bank.data'

export type BankWord = {
  /** palavra secreta */
  w: string
  /** dicas possíveis para o espião */
  h: string[]
}

export type BankCategory = {
  name: string
  words: BankWord[]
}

function decodeBank(encoded: string): BankCategory[] {
  const binary =
    typeof atob === 'function'
      ? atob(encoded)
      : Buffer.from(encoded, 'base64').toString('binary')

  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)

  return JSON.parse(new TextDecoder().decode(bytes)) as BankCategory[]
}

let cache: BankCategory[] | null = null

export function getBank(): BankCategory[] {
  if (!cache) cache = decodeBank(ENCODED_BANK)
  return cache
}

export function getCategoryNames(): string[] {
  return getBank().map((category) => category.name)
}

export function wordKey(category: string, word: string) {
  return `${category}::${word}`
}

export type Draw = {
  category: string
  word: string
  hint: string | null
}

/**
 * Sorteia categoria + palavra evitando o que já saiu neste aparelho.
 * Se o estoque de uma categoria acabar, ele é liberado novamente.
 */
export function drawWord(
  enabledCategories: string[],
  usedKeys: string[],
): { draw: Draw; usedKeys: string[] } {
  const bank = getBank()
  const pool = bank.filter(
    (category) =>
      enabledCategories.length === 0 ||
      enabledCategories.includes(category.name),
  )
  const categories = pool.length > 0 ? pool : bank

  const used = new Set(usedKeys)
  const availableByCategory = categories.map((category) => ({
    category,
    words: category.words.filter((w) => !used.has(wordKey(category.name, w.w))),
    usedCount: usedKeys.filter((key) =>
      key.startsWith(`${category.name}::`),
    ).length,
  }))

  const available = availableByCategory.filter((entry) => entry.words.length > 0)
  const minimumUsed = Math.min(...available.map((entry) => entry.usedCount))
  let candidates = available.filter((entry) => entry.usedCount === minimumUsed)
  let nextUsedKeys = usedKeys

  // Estoque esgotado: recomeça mantendo apenas o histórico de outras categorias.
  if (candidates.length === 0) {
    const activeNames = new Set(categories.map((c) => c.name))
    nextUsedKeys = usedKeys.filter((key) => !activeNames.has(key.split('::')[0]))
    candidates = categories.map((category) => ({
      category,
      words: category.words,
      usedCount: 0,
    }))
  }

  const picked = candidates[Math.floor(Math.random() * candidates.length)]
  const entry = picked.words[Math.floor(Math.random() * picked.words.length)]
  const hint =
    entry.h.length > 0
      ? entry.h[Math.floor(Math.random() * entry.h.length)]
      : null

  return {
    draw: { category: picked.category.name, word: entry.w, hint },
    usedKeys: [...nextUsedKeys, wordKey(picked.category.name, entry.w)],
  }
}
