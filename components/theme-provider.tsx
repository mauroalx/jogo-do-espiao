'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { GlobalTheme } from '@carbon/react'

type CarbonTheme = 'white' | 'g100'
const THEME_KEY = 'espiao:theme'

type ThemeContextValue = {
  theme: CarbonTheme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'g100',
  toggleTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<CarbonTheme>('g100')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY)
      if (saved === 'white' || saved === 'g100') setTheme(saved)
    } catch {
      /* preferência opcional: mantém o tema padrão */
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('cds--white', 'cds--g100')
    root.classList.add(`cds--${theme}`)
  }, [theme])

  const toggleTheme = () =>
    setTheme((current) => {
      const next = current === 'white' ? 'g100' : 'white'
      try {
        window.localStorage.setItem(THEME_KEY, next)
      } catch {
        /* preferência opcional: a troca ainda funciona nesta sessão */
      }
      return next
    })

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <GlobalTheme theme={theme}>{children}</GlobalTheme>
    </ThemeContext.Provider>
  )
}
