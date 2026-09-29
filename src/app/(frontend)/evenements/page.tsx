import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Search } from 'lucide-react'

import { FeatureStrip, Glow, PageHero, QuoteCard, toFeatures } from '@/components/pages/blocks'
import {
  DateBadge,
  EventCalendar,
  EventCard,
  EventMeta,
  eventHref,
} from '@/components/pages/events'
import { JsonLd } from '@/components/site/JsonLd'
import { NewsletterForm } from '@/components/site/NewsletterForm'
import { EditZone } from '@/components/site/EditZone'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { asMedia, getAllUpcomingEvents, getPage } from '@/lib/content'
import { categoryLabels, eventDate, formatLabels } from '@/lib/events'
import { breadcrumbJsonLd, pageMetadata, siteUrl } from '@/lib/seo'
import type { Event } from '@/payload-types'

export const metadata: Metadata = pageMetadata({
  title: 'Événements',
  description:
    'Soirées de louange, enseignements, prière, jeunesse et familles : tous les prochains événements de MKMI Québec, sur place et en ligne, avec inscription.',
  path: '/evenements',
  eyebrow: 'Événements',
  ogTitle: 'Des rencontres qui transforment.',
  keywords: [
    'événements église Québec',
    'soirée de louange Québec',
    'activités chrétiennes Québec',
  ],
})

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Select({
  name,
  label,
  value,
  options,
}: {
  name: string
  label: string
  value: string
  options: [string, string][]
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-900 focus:border-gold-400 focus:outline-none"
      >
        <option value="">{label}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}

export default async function EvenementsPage({ searchParams }: Props) {
  const params = await searchParams
  const [page, events] = await Promise.all([getPage('page-evenements'), getAllUpcomingEvents()])
  const { hero, features, featured: featuredSection, list, newsletter } = page

  const filters = {
    q: one(params.q),
    categorie: one(params.categorie),
    format: one(params.format),
    mois: /^\d{4}-\d{2}$/.test(one(params.mois)) ? one(params.mois) : '',
    jour: /^\d{4}-\d{2}-\d{2}$/.test(one(params.jour)) ? one(params.jour) : '',
  }
  const q = normalize(filters.q)
  const filtered = events.filter((e) => {
    const key = eventDate(e).key
    return (
      (!q || normalize(`${e.title} ${e.summary ?? ''} ${e.location ?? ''}`).includes(q)) &&
      (!filters.categorie || (e.category ?? 'rencontre') === filters.categorie) &&
      (!filters.format ||
        e.format === filters.format ||
        (filters.format !== 'hybrid' && e.format === 'hybrid')) &&
      (!filters.jour ? !filters.mois || key.startsWith(filters.mois) : key === filters.jour)
    )
  })
  const isFiltering = Boolean(
    filters.q || filters.categorie || filters.format || filters.jour || filters.mois,
  )

  const featured = events.find((e) => e.featured) ?? events[0]
  const next = events.filter((e) => e.id !== featured?.id).slice(0, 4)
  const calendarMonth =
    filters.mois ||
    filters.jour.slice(0, 7) ||
    (events[0]
      ? eventDate(events[0]).key.slice(0, 7)
      : new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' })
          .format(new Date())
          .slice(0, 7))
  const months = [...new Set(events.map((e) => eventDate(e).key.slice(0, 7)))].map((mo) => [
    mo,
    new Intl.DateTimeFormat('fr-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(`${mo}-15T12:00:00Z`),
    ),
  ]) as [string, string][]
  const calendarParams = Object.fromEntries(
    Object.entries({ q: filters.q, categorie: filters.categorie, format: filters.format }).filter(
      ([, v]) => v,
    ),
  )

  const eventsJsonLd = events.slice(0, 20).map((e: Event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.startsAt,
    ...(e.endsAt ? { endDate: e.endsAt } : {}),
    ...(e.summary ? { description: e.summary } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      e.format === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : e.format === 'hybrid'
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
    location:
      e.format === 'online'
        ? { '@type': 'VirtualLocation', url: e.streamUrl || undefined }
        : {
            '@type': 'Place',
            name: e.location || 'MKMI Québec',
            address: e.location || 'Québec, QC',
          },
    organizer: { '@type': 'Organization', name: 'MKMI Québec' },
    url: `${siteUrl}${eventHref(e)}`,
  }))

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Événements', path: '/evenements' }])} />
      {eventsJsonLd.length > 0 && <JsonLd data={eventsJsonLd} />}
      <EditZone page="page-evenements" section="Haut de page">
        <PageHero
          id="evenements-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo d’événement à venir"
          actions={
            <>
              <ButtonLink href="#tous">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/planifier-ma-visite" variant="outline-light">
                <CalendarDays className="h-4 w-4" aria-hidden="true" /> {hero?.secondary}
              </ButtonLink>
            </>
          }
          aside={
            hero?.quoteText ? (
              <QuoteCard text={hero.quoteText} source={hero.quoteSource} />
            ) : undefined
          }
        />
      </EditZone>

      <EditZone page="page-evenements" section="Atouts">
        <FeatureStrip items={toFeatures(features?.items)} />
      </EditZone>

      {/* À la une */}
      {featured && (
        <EditZone page="page-evenements" section="À la une">
          <section aria-labelledby="une-title" className="py-16 lg:py-20">
            <div className="container-site">
              <Eyebrow>{featuredSection?.eyebrow}</Eyebrow>
              <div className="mt-4 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <article className="relative isolate grid overflow-hidden rounded-3xl bg-navy-950 text-white shadow-2xl md:grid-cols-2">
                  <div className="relative min-h-72">
                    <Photo
                      media={asMedia(featured.image)}
                      placeholder=""
                      className="h-full min-h-72 w-full"
                      sizes="(min-width:1024px) 30vw, 100vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-navy-950/60" />
                    <span className="absolute top-5 left-5 flex flex-col items-center rounded-xl bg-gold-400 px-3 py-2 leading-none text-navy-900 shadow-lg">
                      <span className="text-[11px] font-bold uppercase">
                        {eventDate(featured).weekday}
                      </span>
                      <span className="font-display text-4xl font-extrabold">
                        {eventDate(featured).day}
                      </span>
                      <span className="text-xs font-bold uppercase">
                        {eventDate(featured).month}
                      </span>
                    </span>
                  </div>
                  <div className="relative p-7 sm:p-9">
                    <Glow />
                    <span className="inline-block rounded-md border border-gold-400/60 px-2 py-1 text-[10px] font-bold tracking-wider text-gold-400 uppercase">
                      {categoryLabels[featured.category ?? 'rencontre']}
                    </span>
                    <h2 id="une-title" className="mt-4 text-3xl font-extrabold">
                      {featured.title}
                    </h2>
                    {featured.summary && <p className="mt-3 text-white/75">{featured.summary}</p>}
                    <div className="mt-5">
                      <EventMeta event={featured} light />
                    </div>
                    <ButtonLink
                      href={`${eventHref(featured)}${featured.registrationEnabled ? '#inscription' : ''}`}
                      className="mt-7"
                    >
                      {featured.registrationEnabled ? 'S’inscrire maintenant' : 'En savoir plus'}{' '}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </ButtonLink>
                  </div>
                </article>

                {next.length > 0 && (
                  <ul className="space-y-3" aria-label="Prochains événements">
                    {next.map((e) => (
                      <li key={e.id}>
                        <Link
                          href={eventHref(e)}
                          className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-navy-900/5 transition-shadow hover:shadow-md"
                        >
                          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                            <Photo
                              media={asMedia(e.image)}
                              placeholder=""
                              className="h-full w-full"
                              sizes="96px"
                            />
                            <DateBadge
                              event={e}
                              className="absolute top-1.5 left-1.5 w-11 scale-90 py-1"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold tracking-wider text-muted uppercase">
                              {categoryLabels[e.category ?? 'rencontre']}
                            </span>
                            <p className="truncate font-bold text-navy-900">{e.title}</p>
                            {e.summary && (
                              <p className="line-clamp-2 text-xs text-muted">{e.summary}</p>
                            )}
                          </div>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-gold-500 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </EditZone>
      )}

      {/* Tous les événements */}
      <EditZone page="page-evenements" section="Tous les événements">
        <section
          id="tous"
          aria-labelledby="tous-title"
          className="scroll-mt-20 bg-mist py-16 lg:py-20"
        >
          <div className="container-site">
            <form
              action="/evenements#tous"
              className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"
            >
              <label className="relative block sm:col-span-2 lg:col-span-1">
                <span className="sr-only">Rechercher un événement</span>
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Rechercher un événement…"
                  className="w-full rounded-xl border border-navy-900/15 py-3 pr-4 pl-11 text-sm text-navy-900 focus:border-gold-400 focus:outline-none"
                />
              </label>
              <Select
                name="categorie"
                label="Toutes les catégories"
                value={filters.categorie}
                options={Object.entries(categoryLabels)}
              />
              <Select
                name="format"
                label="Tous les formats"
                value={filters.format}
                options={Object.entries(formatLabels)}
              />
              <Select name="mois" label="Tous les mois" value={filters.mois} options={months} />
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Filtrer
              </button>
            </form>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2
                    id="tous-title"
                    className="flex items-center gap-3 text-2xl font-extrabold text-navy-900"
                  >
                    <span className="h-1 w-8 rounded bg-gold-400" aria-hidden="true" />
                    {filters.jour ? (
                      `Le ${new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${filters.jour}T12:00:00Z`))}`
                    ) : isFiltering ? (
                      `${filtered.length} événement${filtered.length > 1 ? 's' : ''}`
                    ) : (
                      <Rich text={list?.title} />
                    )}
                  </h2>
                  {isFiltering && (
                    <Link
                      href="/evenements#tous"
                      className="text-sm font-semibold text-navy-900 underline decoration-gold-400 underline-offset-4"
                    >
                      Effacer les filtres
                    </Link>
                  )}
                </div>
                {filtered.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-navy-900/20 bg-white p-8 text-center text-muted">
                    {events.length === 0
                      ? 'Les prochains événements seront annoncés très bientôt.'
                      : 'Aucun événement ne correspond à votre recherche.'}
                  </p>
                ) : (
                  <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((e) => (
                      <li key={e.id}>
                        <EventCard event={e} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <EventCalendar
                  events={events}
                  month={calendarMonth}
                  selectedDay={filters.jour}
                  params={calendarParams}
                />
              </aside>
            </div>
          </div>
        </section>
      </EditZone>

      {/* Infolettre */}
      <EditZone page="page-evenements" section="Infolettre">
        <section
          aria-labelledby="informe-title"
          className="relative isolate overflow-hidden bg-navy-900 py-14 text-white"
        >
          <div className="absolute inset-0 -z-20">
            <Photo
              media={asMedia(newsletter?.image)}
              alt=""
              placeholder=""
              className="h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-950/80" />
          </div>
          <Glow />
          <div className="container-site grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Eyebrow light>{newsletter?.eyebrow}</Eyebrow>
              <h2 id="informe-title" className="text-3xl font-extrabold">
                <Rich text={newsletter?.title} />
              </h2>
              <p className="mt-2 text-white/75">{newsletter?.text}</p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </EditZone>
    </>
  )
}
