import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download, FolderOpen, Headphones, Play, Search } from 'lucide-react'
import { siApplepodcasts, siSpotify, siYoutube } from 'simple-icons'

import { Glow, PageHero, QuoteCard } from '@/components/pages/blocks'
import { EditZone } from '@/components/site/EditZone'
import { Rich } from '@/components/site/Rich'
import { Photo } from '@/components/site/Photo'
import { NewsletterForm } from '@/components/site/NewsletterForm'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { asMedia, getPage, getSermons } from '@/lib/content'
import { formatSermonDate, youtubeThumb } from '@/lib/sermons'
import type { Sermon } from '@/payload-types'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Messages et prédications',
  description:
    'Prédications, études bibliques et enseignements de MKMI Québec en vidéo et en balado, pour grandir dans la foi au quotidien.',
  path: '/messages',
  eyebrow: 'Messages',
  ogTitle: 'Des enseignements pour aujourd’hui et pour demain.',
  keywords: ['prédication', 'sermon', 'étude biblique', 'balado chrétien'],
})

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const uniq = (values: (string | null | undefined)[]) =>
  [...new Set(values.filter((v): v is string => Boolean(v)))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )

function SermonCard({ sermon }: { sermon: Sermon }) {
  const thumb = asMedia(sermon.thumbnail)
  return (
    <Link
      href={`/messages/${sermon.slug ?? sermon.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)] ring-1 ring-navy-900/5 transition-all hover:-translate-y-1"
    >
      <div className="relative">
        <Photo
          media={thumb}
          src={thumb ? null : youtubeThumb(sermon)}
          alt=""
          placeholder=""
          className="aspect-video w-full"
          sizes="(min-width:1024px) 22vw, 50vw"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-navy-900 uppercase">
          {sermon.category || 'Prédication'}
        </span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400 text-navy-900 shadow-lg">
            <Play className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true" />
          </span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold text-navy-900">{sermon.title}</h3>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <Photo
            media={asMedia(sermon.preacherPhoto)}
            placeholder=""
            tone="light"
            className="h-8 w-8 shrink-0 rounded-full"
            sizes="32px"
          />
          <p className="text-xs text-muted">
            <span className="block text-navy-900">{sermon.preacher}</span>
            {formatSermonDate(sermon.date, 'medium')}
          </p>
        </div>
      </div>
    </Link>
  )
}

function Select({
  name,
  label,
  value,
  options,
}: {
  name: string
  label: string
  value: string
  options: string[]
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
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export default async function MessagesPage({ searchParams }: Props) {
  const params = await searchParams
  const [page, sermons] = await Promise.all([getPage('page-messages'), getSermons()])
  const { hero, featured: featuredSection, library, podcast: podcastSection, newsletter } = page

  const filters = {
    q: one(params.q),
    categorie: one(params.categorie),
    predicateur: one(params.predicateur),
    annee: one(params.annee),
    serie: one(params.serie),
  }
  const q = normalize(filters.q)
  const filtered = sermons.filter(
    (s) =>
      (!q || normalize(`${s.title} ${s.preacher ?? ''} ${s.series ?? ''}`).includes(q)) &&
      (!filters.categorie || (s.category || 'Prédication') === filters.categorie) &&
      (!filters.predicateur || s.preacher === filters.predicateur) &&
      (!filters.annee || s.date.startsWith(filters.annee)) &&
      (!filters.serie || s.series === filters.serie),
  )
  const isFiltering = Object.values(filters).some(Boolean)

  const featured = sermons.find((s) => s.featured) ?? sermons[0]
  const recent = sermons.filter((s) => s.id !== featured?.id).slice(0, 4)
  const categories = uniq(sermons.map((s) => s.category || 'Prédication'))
  const series = uniq(sermons.map((s) => s.series))
  const podcast = [
    {
      href: podcastSection?.spotifyUrl,
      label: 'Écouter sur Spotify',
      icon: siSpotify,
      className: 'border-[#1DB954] text-white hover:bg-[#1DB954]/15',
    },
    {
      href: podcastSection?.applePodcastsUrl,
      label: 'Écouter sur Apple Podcasts',
      icon: siApplepodcasts,
      className: 'border-white/40 text-white hover:bg-white/10',
    },
    {
      href: podcastSection?.youtubeChannelUrl,
      label: 'Regarder sur YouTube',
      icon: siYoutube,
      className: 'border-[#FF0000] bg-[#FF0000] text-white hover:bg-[#e00000]',
    },
  ].filter((p) => p.href)

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Messages', path: '/messages' }])} />
      <EditZone page="page-messages" section="Haut de page">
        <PageHero
          id="messages-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo de prédication à venir"
          actions={
            <>
              {featured && (
                <ButtonLink href={`/messages/${featured.slug ?? featured.id}`}>
                  <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />{' '}
                  {hero?.primary}
                </ButtonLink>
              )}
              <ButtonLink href="#balado" variant="outline-light">
                <Headphones className="h-4 w-4" aria-hidden="true" /> {hero?.secondary}
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

      {/* Message de la semaine */}
      {featured && (
        <EditZone page="page-messages" section="Message de la semaine">
          <section aria-labelledby="semaine-title" className="py-16 lg:py-20">
            <div
              className={`container-site grid items-center gap-10 ${recent.length > 0 ? 'lg:grid-cols-[1fr_1.05fr_.8fr]' : 'lg:grid-cols-2'}`}
            >
              <div>
                <Eyebrow>{featuredSection?.eyebrow}</Eyebrow>
                <h2 id="semaine-title" className="text-3xl font-extrabold text-navy-900">
                  {featured.title}
                </h2>
                <div className="mt-5 flex items-center gap-3">
                  <Photo
                    media={asMedia(featured.preacherPhoto)}
                    placeholder=""
                    tone="light"
                    className="h-11 w-11 rounded-full"
                    sizes="44px"
                  />
                  <p className="text-sm text-muted">
                    <span className="block font-semibold text-navy-900">{featured.preacher}</span>
                    {formatSermonDate(featured.date)}
                    {featured.series ? ` · Série : ${featured.series}` : ''}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {featured.youtubeUrl && (
                    <ButtonLink
                      href={featured.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Regarder
                      sur YouTube
                    </ButtonLink>
                  )}
                  {featured.podcastUrl && (
                    <ButtonLink
                      href={featured.podcastUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-dark"
                    >
                      <Headphones className="h-4 w-4" aria-hidden="true" /> Écouter
                    </ButtonLink>
                  )}
                  {asMedia(featured.audioFile)?.url && (
                    <a
                      href={asMedia(featured.audioFile)!.url!}
                      download
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-navy-900/25 px-5 py-3 text-xs font-bold tracking-wide text-navy-900 uppercase hover:bg-navy-900/5"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" /> Télécharger
                    </a>
                  )}
                  <ButtonLink href={`/messages/${featured.slug ?? featured.id}`} variant="navy">
                    Voir le message <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
              <Link
                href={`/messages/${featured.slug ?? featured.id}`}
                className="group relative block self-start overflow-hidden rounded-2xl shadow-2xl"
                aria-label={`Voir « ${featured.title} »`}
              >
                <Photo
                  media={asMedia(featured.thumbnail)}
                  src={asMedia(featured.thumbnail) ? null : youtubeThumb(featured)}
                  alt=""
                  className="aspect-video w-full"
                  sizes="(min-width:1024px) 40vw, 100vw"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-navy-950/20">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/15 text-white backdrop-blur transition-transform group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true" />
                  </span>
                </span>
              </Link>
              {recent.length > 0 && (
                <ul className="space-y-4" aria-label="Messages récents">
                  {recent.map((s) => (
                    <li key={s.id}>
                      <Link href={`/messages/${s.slug ?? s.id}`} className="group flex gap-3">
                        <Photo
                          media={asMedia(s.thumbnail)}
                          src={asMedia(s.thumbnail) ? null : youtubeThumb(s)}
                          alt=""
                          placeholder=""
                          className="aspect-video w-28 shrink-0 rounded-lg"
                          sizes="112px"
                        />
                        <span className="text-sm">
                          <span className="block font-semibold text-navy-900 group-hover:underline">
                            {s.title}
                          </span>
                          <span className="text-xs text-muted">
                            {formatSermonDate(s.date, 'medium')}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </EditZone>
      )}

      {/* Tous les messages */}
      <EditZone page="page-messages" section="Tous les messages">
        <section
          id="tous"
          aria-labelledby="tous-title"
          className="scroll-mt-20 bg-mist py-16 lg:py-20"
        >
          <div className="container-site">
            <form
              action="/messages#tous"
              className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]"
            >
              <label className="relative block sm:col-span-2 lg:col-span-1">
                <span className="sr-only">Rechercher un message</span>
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Rechercher un message…"
                  className="w-full rounded-xl border border-navy-900/15 py-3 pr-4 pl-11 text-sm text-navy-900 focus:border-gold-400 focus:outline-none"
                />
              </label>
              <Select
                name="categorie"
                label="Toutes les catégories"
                value={filters.categorie}
                options={categories}
              />
              <Select
                name="predicateur"
                label="Tous les prédicateurs"
                value={filters.predicateur}
                options={uniq(sermons.map((s) => s.preacher))}
              />
              <Select
                name="annee"
                label="Toutes les années"
                value={filters.annee}
                options={uniq(sermons.map((s) => s.date.slice(0, 4))).reverse()}
              />
              <Select
                name="serie"
                label="Toutes les séries"
                value={filters.serie}
                options={series}
              />
              <button
                type="submit"
                className="min-h-11 rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Filtrer
              </button>
            </form>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_260px]">
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2
                    id="tous-title"
                    className="flex items-center gap-3 text-2xl font-extrabold text-navy-900"
                  >
                    <span className="h-1 w-8 rounded bg-gold-400" aria-hidden="true" />
                    {isFiltering ? (
                      `${filtered.length} message${filtered.length > 1 ? 's' : ''} trouvé${filtered.length > 1 ? 's' : ''}`
                    ) : (
                      <Rich text={library?.title} />
                    )}
                  </h2>
                  {isFiltering && (
                    <Link
                      href="/messages#tous"
                      className="text-sm font-semibold text-navy-900 underline decoration-gold-400 underline-offset-4"
                    >
                      Effacer les filtres
                    </Link>
                  )}
                </div>
                {filtered.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-navy-900/20 bg-white p-8 text-center text-muted">
                    {sermons.length === 0
                      ? 'Les messages seront publiés ici très bientôt.'
                      : 'Aucun message ne correspond à votre recherche.'}
                  </p>
                ) : (
                  <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((s) => (
                      <li key={s.id}>
                        <SermonCard sermon={s} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside className="space-y-10">
                <div>
                  <h2 className="font-bold text-navy-900">Catégories</h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {categories.map((c) => (
                      <li key={c}>
                        <Link
                          href={`/messages?categorie=${encodeURIComponent(c)}#tous`}
                          className="flex items-center justify-between gap-2 text-muted hover:text-navy-900"
                        >
                          <span className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-gold-500" aria-hidden="true" /> {c}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-xs">
                            {sermons.filter((s) => (s.category || 'Prédication') === c).length}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {series.length > 0 && (
                  <div>
                    <h2 className="font-bold text-navy-900">Séries</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                      {series.map((name) => (
                        <li key={name}>
                          <Link
                            href={`/messages?serie=${encodeURIComponent(name)}#tous`}
                            className="block rounded-xl bg-white p-3 hover:shadow-md"
                          >
                            <span className="block font-semibold text-navy-900">{name}</span>
                            <span className="text-xs text-muted">
                              {sermons.filter((s) => s.series === name).length} message(s)
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </EditZone>

      {/* Balado */}
      <EditZone page="page-messages" section="Balado">
        <section
          id="balado"
          aria-labelledby="balado-title"
          className="relative isolate scroll-mt-20 overflow-hidden bg-navy-950 py-16 text-white"
        >
          <Glow />
          <Headphones
            aria-hidden="true"
            className="absolute top-1/2 -left-10 h-80 w-80 -translate-y-1/2 text-white/[.04]"
            strokeWidth={1}
          />
          <div className="container-site grid items-center gap-8 lg:grid-cols-2">
            <div className="lg:col-start-2">
              <Eyebrow light>{podcastSection?.eyebrow}</Eyebrow>
              <h2 id="balado-title" className="text-3xl font-extrabold">
                <Rich text={podcastSection?.title} />
              </h2>
              <p className="mt-3 text-white/75">{podcastSection?.text}</p>
              {podcast.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-3">
                  {podcast.map((p) => (
                    <li key={p.label}>
                      <a
                        href={p.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${p.className}`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d={p.icon.path} />
                        </svg>
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 inline-block rounded-lg border border-dashed border-white/25 px-4 py-3 text-sm text-white/60">
                  Les liens Spotify, Apple Podcasts et YouTube seront ajoutés bientôt.
                </p>
              )}
            </div>
          </div>
        </section>
      </EditZone>

      {/* Infolettre */}
      <EditZone page="page-messages" section="Infolettre">
        <section aria-labelledby="nouveaux-title" className="bg-navy-900 py-14 text-white">
          <div className="container-site grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Eyebrow light>{newsletter?.eyebrow}</Eyebrow>
              <h2 id="nouveaux-title" className="text-3xl font-extrabold">
                <Rich text={newsletter?.title} />
              </h2>
              <p className="mt-2 text-white/70">{newsletter?.text}</p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </EditZone>
    </>
  )
}
