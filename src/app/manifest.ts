import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MKMI Québec',
    short_name: 'MKMI',
    description: 'Église chrétienne MKMI Québec : une famille, une foi, une mission.',
    lang: 'fr-CA',
    start_url: '/',
    display: 'standalone',
    background_color: '#070f1d',
    theme_color: '#0b1628',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
