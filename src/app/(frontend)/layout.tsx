import type { Metadata, Viewport } from 'next'
import React from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { PageViewTracker } from '@/components/site/PageViewTracker'
import { getSettings } from '@/lib/content'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MKMI Québec — Église chrétienne à Québec',
    template: '%s — MKMI Québec',
  },
  description:
    'MKMI Québec (Messianic Kingdom Miracles International) : église chrétienne charismatique à Charlesbourg, Québec. Communion, prière et croissance spirituelle.',
  openGraph: { type: 'website', locale: 'fr_CA', siteName: 'MKMI Québec' },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = { themeColor: '#0b1628' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="fr-CA">
      <body>
        <Header siteName={settings.name ?? 'MKMI Québec'} />
        <main id="contenu">{children}</main>
        <Footer settings={settings} />
        <PageViewTracker />
      </body>
    </html>
  )
}
