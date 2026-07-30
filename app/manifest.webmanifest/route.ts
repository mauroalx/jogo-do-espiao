export const dynamic = 'force-static'

export function GET() {
  return Response.json(
    {
      name: 'Quem é o espião?',
      short_name: 'Espião',
      description:
        'Jogo de festa em um só celular: todos veem a categoria, só o espião não sabe a palavra.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#161616',
      theme_color: '#161616',
      lang: 'pt-BR',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    { headers: { 'Content-Type': 'application/manifest+json' } },
  )
}
