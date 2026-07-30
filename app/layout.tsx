import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { RegisterServiceWorker } from '@/components/register-service-worker'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Quem é o espião?',
  description:
    'Jogo de festa para jogar em um só celular: todos veem a categoria, só o espião não sabe a palavra. Configure espiões, dicas, categorias e tempo de discussão.',
  applicationName: 'Quem é o espião?',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Espião',
  },
  icons: {
    icon: '/icon-512.png',
    apple: '/icon-512.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#161616',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="cds--g100" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader />
          {children}
        </ThemeProvider>
        <RegisterServiceWorker />
      </body>
    </html>
  )
}
