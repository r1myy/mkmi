import Link from 'next/link'
import { ArrowRight, Download, Headphones, Play } from 'lucide-react'

import { asMedia } from '@/lib/content'
import type { Event, Sermon } from '@/payload-types'
import { Photo } from '../site/Photo'
import { ButtonLink, Eyebrow } from '../site/ui'
import { EventCarousel, type EventCard } from './EventCarousel'

const TZ = 'America/Toronto'

function toCard(e: Event): EventCard {
  const d = new Date(e.startsAt)
  const part = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-CA', { timeZone: TZ, ...opts }).format(d)
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    summary: e.summary,
    location: e.location,
    day: part({ day: '2-digit' }),
    month: part({ month: 'short' }).replace('.', ''),
    year: part({ year: 'numeric' }),
    time: e.timeToConfirm ? 'Heure à confirmer' : part({ hour: '2-digit', minute: '2-digit' }),
    image: asMedia(e.image),
    registrationEnabled: Boolean(e.registrationEnabled),
  }
}

function youtubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/)
  return m?.[1] ?? null
}

export function EventsAndSermon({ events, sermon }: { events: Event[]; sermon: Sermon | null }) {
  const ytId = youtubeId(sermon?.youtubeUrl)
  const thumb = asMedia(sermon?.thumbnail)
  const audio = asMedia(sermon?.audioFile)
  const preacherPhoto = asMedia(sermon?.preacherPhoto)

  return (
    <section className="py-16 lg:py-20">
      <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-0">
        {/* Prochain événement */}
        <div aria-labelledby="events-title" role="region" className="lg:border-r lg:border-navy-900/10 lg:pr-12">
          <Eyebrow>Prochain événement</Eyebrow>
          <h2 id="events-title" className="text-3xl font-extrabold text-navy-900">
            Ne manquez pas <br className="hidden sm:block" />
            nos prochains rendez-vous !
          </h2>
          <div className="mt-8">
            {events.length > 0 ? (
              <EventCarousel events={events.map(toCard)} />
            ) : (
              <div className="rounded-[var(--radius-card)] border border-dashed border-navy-900/20 bg-mist p-8 text-center text-muted">
                Les prochains événements seront annoncés très bientôt.
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/evenements" variant="outline-dark">
              Voir tous les événements <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        {/* Message de la semaine */}
        <div aria-labelledby="sermon-title" role="region" className="lg:pl-12">
          <Eyebrow>Message de la semaine</Eyebrow>
          <h2 id="sermon-title" className="text-3xl font-extrabold text-navy-900">
            Un enseignement <br className="hidden sm:block" />
            pour aujourd’hui
          </h2>
          {sermon ? (
            <div className="mt-8">
              <a
                href={sermon.youtubeUrl || `/messages/${sermon.slug ?? ''}`}
                {...(sermon.youtubeUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group relative block overflow-hidden rounded-[var(--radius-card)]"
                aria-label={`Regarder « ${sermon.title} »`}
              >
                <Photo
                  media={thumb}
                  src={!thumb && ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : null}
                  alt=""
                  className="aspect-video w-full"
                  sizes="(min-width:1024px) 540px, 100vw"
                />
                <span className="absolute top-3 right-3 rounded bg-navy-950/80 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                  {sermon.category || 'Prédication'}
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true" />
                  </span>
                </span>
              </a>
              <h3 className="mt-5 text-lg font-bold text-navy-900">{sermon.title}</h3>
              <div className="mt-3 flex items-center gap-3">
                <Photo media={preacherPhoto} placeholder="" className="h-9 w-9 rounded-full" tone="light" />
                <div className="text-xs text-muted">
                  <p className="font-semibold text-navy-900">{sermon.preacher}</p>
                  <p>
                    {sermon.series ? `Série : ${sermon.series} · ` : ''}
                    {new Intl.DateTimeFormat('fr-CA', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(sermon.date))}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {sermon.youtubeUrl && (
                  <a
                    href={sermon.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
                  >
                    <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Regarder sur YouTube
                  </a>
                )}
                {sermon.podcastUrl && (
                  <a
                    href={sermon.podcastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-navy-900/25 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-900/5"
                  >
                    <Headphones className="h-4 w-4" aria-hidden="true" /> Écouter le podcast
                  </a>
                )}
                {audio?.url && (
                  <a
                    href={audio.url}
                    download
                    aria-label="Télécharger l’audio"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-navy-900/25 text-navy-900 hover:bg-navy-900/5"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-navy-900/20 bg-mist p-8 text-center text-muted">
              Le prochain message sera publié ici.
            </div>
          )}
          <Link
            href="/messages"
            className="mt-6 inline-flex items-center gap-2 border-b-2 border-gold-400 pb-0.5 text-sm font-semibold text-navy-900"
          >
            Voir tous les messages <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
