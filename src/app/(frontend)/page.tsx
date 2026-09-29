import { EventsAndSermon } from '@/components/home/EventsAndSermon'
import { FinalCta } from '@/components/home/FinalCta'
import { Hero } from '@/components/home/Hero'
import { Ministries } from '@/components/home/Ministries'
import { Missions } from '@/components/home/Missions'
import { Pillars } from '@/components/home/Pillars'
import { Prayer } from '@/components/home/Prayer'
import { Welcome } from '@/components/home/Welcome'
import type { Metadata } from 'next'

import { JsonLd } from '@/components/site/JsonLd'
import { asMedia, getFeaturedSermon, getHomePage, getMinistries, getSettings, getUpcomingEvents } from '@/lib/content'
import { ogImageUrl, siteUrl } from '@/lib/seo'

// Contenu géré dans l’administration : régénéré au plus toutes les 60 s.
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = 'MKMI Québec — Église chrétienne à Québec (Charlesbourg)'
  const description = settings.description ?? undefined
  return {
    title: { absolute: title },
    description,
    keywords: ['MKMI Québec', 'église Québec', 'église chrétienne Québec', 'église Charlesbourg', 'église charismatique', 'culte dimanche Québec'],
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'fr_CA',
      siteName: 'MKMI Québec',
      url: '/',
      title,
      description,
      images: [{ url: ogImageUrl('Une famille. Une foi. Une mission.'), width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function HomePage() {
  const [home, settings, events, sermon, ministries] = await Promise.all([
    getHomePage(),
    getSettings(),
    getUpcomingEvents(),
    getFeaturedSermon(),
    getMinistries(),
  ])

  const sameAs = [settings.facebook, settings.instagram, settings.youtube, settings.tiktok].filter(Boolean)
  const logo = asMedia(settings.logo)?.url
  const church = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    '@id': `${siteUrl}/#eglise`,
    name: settings.name,
    alternateName: 'Messianic Kingdom Miracles International — Québec',
    description: settings.description,
    url: siteUrl,
    image: `${siteUrl}${ogImageUrl('Une famille. Une foi. Une mission.')}`,
    ...(logo ? { logo: `${siteUrl}${logo}` } : {}),
    telephone: settings.phone,
    ...(settings.email?.includes('@') ? { email: settings.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      postalCode: settings.postalCode,
      addressLocality: 'Québec',
      addressRegion: 'QC',
      addressCountry: 'CA',
    },
    ...(settings.directionsUrl ? { hasMap: settings.directionsUrl } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.name,
    url: siteUrl,
    inLanguage: 'fr-CA',
    publisher: { '@id': `${siteUrl}/#eglise` },
  }

  return (
    <>
      <JsonLd data={church} />
      <JsonLd data={website} />
      <Hero hero={home.hero!} settings={settings} />
      <Welcome welcome={home.welcome!} />
      <Pillars pillars={home.pillars!} />
      <EventsAndSermon events={events} sermon={sermon} />
      <Ministries ministries={ministries} />
      <Prayer prayer={home.prayer!} />
      <Missions missions={home.missions!} />
      <FinalCta cta={home.finalCta!} />
    </>
  )
}
