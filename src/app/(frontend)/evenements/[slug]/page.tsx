import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, CalendarDays, Radio, Users } from 'lucide-react'

import { Glow } from '@/components/pages/blocks'
import { EventCard, EventMeta } from '@/components/pages/events'
import { EventRegistrationForm } from '@/components/pages/forms'
import { JsonLd } from '@/components/site/JsonLd'
import { Photo } from '@/components/site/Photo'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { asMedia, getAllUpcomingEvents, getEventBySlug } from '@/lib/content'
import { categoryLabels, eventDate } from '@/lib/events'
import { breadcrumbJsonLd, pageMetadata, siteUrl } from '@/lib/seo'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug((await params).slug)
  if (!event) return { title: 'Événement introuvable', robots: { index: false } }
  const d = eventDate(event)
  return pageMetadata({
    title: event.title,
    description: `${event.summary ? `${event.summary} ` : ''}Le ${d.long}${event.location ? `, ${event.location}` : ''}. Événement de MKMI Québec.`,
    path: `/evenements/${event.slug}`,
    eyebrow: `${d.day} ${d.month} · ${categoryLabels[event.category ?? 'rencontre']}`,
    image: asMedia(event.image)?.url,
  })
}

export default async function EventPage({ params }: Props) {
  const event = await getEventBySlug((await params).slug)
  if (!event) notFound()
  const d = eventDate(event)
  const path = `/evenements/${event.slug}`
  const others = (await getAllUpcomingEvents()).filter((e) => e.id !== event.id).slice(0, 3)
  const image = asMedia(event.image)

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Événements', path: '/evenements' }, { name: event.title, path }])} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: event.title,
          startDate: event.startsAt,
          ...(event.endsAt ? { endDate: event.endsAt } : {}),
          ...(event.summary ? { description: event.summary } : {}),
          ...(image?.url ? { image: `${siteUrl}${image.url}` } : {}),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode:
            event.format === 'online'
              ? 'https://schema.org/OnlineEventAttendanceMode'
              : event.format === 'hybrid'
                ? 'https://schema.org/MixedEventAttendanceMode'
                : 'https://schema.org/OfflineEventAttendanceMode',
          location:
            event.format === 'online'
              ? { '@type': 'VirtualLocation', url: event.streamUrl || `${siteUrl}${path}` }
              : { '@type': 'Place', name: event.location || 'MKMI Québec', address: event.location || 'Québec, QC' },
          organizer: { '@type': 'Organization', name: 'MKMI Québec', url: siteUrl },
          url: `${siteUrl}${path}`,
        }}
      />

      <section aria-labelledby="event-title" className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-16 text-white">
        <Glow />
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow light>{categoryLabels[event.category ?? 'rencontre']}</Eyebrow>
            <h1 id="event-title" className="text-4xl font-extrabold sm:text-5xl">
              {event.title}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-lg font-semibold text-gold-300 first-letter:uppercase">
              <CalendarDays className="h-5 w-5" aria-hidden="true" /> {d.long}
            </p>
            {event.summary && <p className="mt-4 max-w-lg text-white/80">{event.summary}</p>}
            <div className="mt-6">
              <EventMeta event={event} light />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {event.registrationEnabled && <ButtonLink href="#inscription">S’inscrire</ButtonLink>}
              {event.streamUrl && (
                <ButtonLink href={event.streamUrl} target="_blank" rel="noopener noreferrer" variant="outline-light">
                  <Radio className="h-4 w-4" aria-hidden="true" /> Suivre en ligne
                </ButtonLink>
              )}
            </div>
          </div>
          <Photo media={image} placeholder="Photo à venir" className="aspect-[4/3] rounded-3xl shadow-2xl" sizes="(min-width:1024px) 50vw, 100vw" priority />
        </div>
      </section>

      <section className="py-16">
        <div className="container-site grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900">À propos de cet événement</h2>
            {event.description ? (
              <div className="rich-text mt-4 leading-relaxed">
                <RichText data={event.description} />
              </div>
            ) : (
              <p className="mt-4 text-muted">Plus de détails seront publiés prochainement.</p>
            )}
            <ButtonLink href="/evenements" variant="outline-dark" className="mt-10">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous les événements
            </ButtonLink>
          </div>
          {event.registrationEnabled && (
            <div id="inscription" className="scroll-mt-24 self-start rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-navy-900">
                <Users className="h-5 w-5 text-gold-500" aria-hidden="true" /> Je m’inscris
              </h2>
              <p className="mt-1 mb-6 text-sm text-muted">Gratuit. Réservez votre place en quelques secondes.</p>
              <EventRegistrationForm eventId={event.id} />
            </div>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="autres-title" className="bg-mist py-16">
          <div className="container-site">
            <h2 id="autres-title" className="text-2xl font-extrabold text-navy-900">
              Autres événements à venir
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
