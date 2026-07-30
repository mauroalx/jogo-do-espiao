'use client'

import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from '@carbon/react'
import { Asleep, Light } from '@carbon/icons-react'
import { useTheme } from '@/components/theme-provider'

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'g100'

  return (
    <Header aria-label="Quem é o espião">
      <SkipToContent />
      <HeaderName href="/" prefix="">
        Quem é o espião?
      </HeaderName>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label={isDark ? 'Usar tema claro' : 'Usar tema escuro'}
          tooltipAlignment="end"
          onClick={toggleTheme}
        >
          {isDark ? <Light size={20} /> : <Asleep size={20} />}
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </Header>
  )
}
