import { EventsAndSermon } from '@/components/home/EventsAndSermon'
import { FinalCta } from '@/components/home/FinalCta'
import { Hero } from '@/components/home/Hero'
import { Ministries } from '@/components/home/Ministries'
import { Missions } from '@/components/home/Missions'
import { Pillars } from '@/components/home/Pillars'
import { Prayer } from '@/components/home/Prayer'
import { Welcome } from '@/components/home/Welcome'
import { getFeaturedSermon, getHomePage, getMinistries, getSettings, getUpcomingEvents } from '@/lib/content'

// Contenu géré dans l’administration : régénéré au plus toutes les 60 s.
export const revalidate = 60

export default async function HomePage() {
  const [home, settings, events, sermon, ministries] = await Promise.all([
    getHomePage(),
    getSettings(),
    getUpcomingEvents(),
    getFeaturedSermon(),
    getMinistries(),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: settings.name,
    description: home.hero?.subtitle,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    address: { '@type': 'PostalAddress', addressLocality: 'Québec', addressRegion: 'QC', addressCountry: 'CA' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
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
