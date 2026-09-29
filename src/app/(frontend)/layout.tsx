import type { Metadata, Viewport } from 'next'
import React from 'react'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { PageViewTracker } from '@/components/site/PageViewTracker'
import { getSettings } from '@/lib/content'
import { ogImageUrl } from '@/lib/seo'
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
  applicationName: 'MKMI Québec',
  authors: [{ name: 'MKMI Québec' }],
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    siteName: 'MKMI Québec',
    images: [{ url: ogImageUrl('Une famille. Une foi. Une mission.'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
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
