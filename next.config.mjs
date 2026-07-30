/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite testar o servidor de desenvolvimento em celulares na rede local.
  // Em produção, esta opção não altera as origens aceitas pela aplicação.
  allowedDevOrigins: ['192.168.1.8'],
  sassOptions: {
    // Carbon's published Sass still uses some patterns the latest dart-sass
    // flags as deprecated. Silence those warnings; they are upstream noise.
    silenceDeprecations: [
      'global-builtin',
      'import',
      'if-function',
    ],
    quietDeps: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy-Report-Only',
            value:
              "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://1.www.s81c.com; font-src 'self' https://1.www.s81c.com data:; connect-src 'self'",
          },
        ],
      },
    ]
  },
}

export default nextConfig
