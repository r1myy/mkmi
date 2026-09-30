import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, CalendarDays, Clock, MessageCircle, Play, Search, Users } from 'lucide-react'

import { faithLevels, faithThemes, faithTypes } from '@/collections/FaithResources'
import { PageHero, QuoteCard } from '@/components/pages/blocks'
import { EditZone } from '@/components/site/EditZone'
import { iconFor } from '@/components/site/icons'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getFaithResources, getPage } from '@/lib/content'
import { youtubeThumb } from '@/lib/sermons'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import type { FaithResource } from '@/payload-types'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Découvrir la foi',
  description:
    'Articles, vidéos, guides et parcours pour connaître Dieu, découvrir Jésus-Christ, lire la Bible et grandir dans la foi, proposés par MKMI Québec.',
  path: '/decouvrir/foi',
  eyebrow: 'Découvrir la foi',
  ogTitle: 'Un chemin de foi pour aujourd’hui.',
  keywords: ['découvrir la foi chrétienne', 'qui est Jésus', 'lire la Bible', 'apprendre à prier'],
})

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const P = 'page-foi'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const typeLabel = (v?: string | null) => faithTypes.find((t) => t.value === v)?.label ?? 'Ressource'
const themeLabel = (v?: string | null) => faithThemes.find((t) => t.value === v)?.label ?? 'Autres'
const day = (iso: string) =>
  new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
const imageOf = (r: FaithResource) => {
  const m = asMedia(r.cover)
  return m ? (m.sizes?.card?.url ?? m.url) : youtubeThumb(r)
}
const hrefOf = (r: FaithResource) => `/decouvrir/foi/${r.slug ?? r.id}`

function ResourceCard({ r }: { r: FaithResource }) {
  const img = imageOf(r)
  const video = r.type === 'video' || Boolean(r.youtubeUrl)
  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-30px_rgba(11,22,40,.5)] ring-1 ring-navy-900/5">
      <Link href={hrefOf(r)} className="relative block aspect-video bg-navy-900 bg-cover bg-center" style={img ? { backgroundImage: `url(${img})` } : undefined}>
        <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-navy-900 uppercase">
          {typeLabel(r.type)}
        </span>
        {!img && <BookOpen className="absolute inset-0 m-auto h-10 w-10 text-gold-400" aria-hidden="true" />}
        {video && (
          <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/15 text-white backdrop-blur">
            <Play className="h-6 w-6" fill="currentColor" aria-hidden="true" />
          </span>
        )}
        {video && r.duration && (
          <span className="absolute right-3 bottom-3 rounded-md bg-navy-950/85 px-2 py-0.5 text-xs font-bold text-white">{r.duration}</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-navy-900">
          <Link href={hrefOf(r)} className="hover:underline">
            {r.title}
          </Link>
        </h3>
        {r.summary && <p className="mt-2 line-clamp-3 text-sm text-muted">{r.summary}</p>}
        <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {day(r.publishedAt)}
          </span>
          {!video && r.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {r.duration}
            </span>
          )}
          <span>{themeLabel(r.theme)}</span>
        </p>
      </div>
    </li>
  )
}

export default async function FoiPage({ searchParams }: Props) {
  const params = await searchParams
  const [page, all] = await Promise.all([getPage(P), getFaithResources()])
  const { hero, shortcuts, themes, start, verses, cta } = page
  const q = one(params.q)
  const theme = one(params.theme)
  const type = one(params.type)
  const level = one(params.niveau)
  const filtering = Boolean(q || theme || type || level || one(params.tout) === '1')

  const featuredFirst = (list: FaithResource[]) => [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  const filtered = all.filter(
    (r) =>
      (!theme || r.theme === theme) &&
      (!type || r.type === type) &&
      (!level || r.level === level) &&
      (!q || norm(`${r.title} ${r.summary ?? ''} ${r.author ?? ''}`).includes(norm(q))),
  )
  const recent = featuredFirst(all.filter((r) => r.type !== 'video')).slice(0, 3)
  const videos = featuredFirst(all.filter((r) => r.type === 'video' || r.youtubeUrl)).slice(0, 3)
  const verseList = verses?.list ?? []
  const verse = verseList.length ? verseList[Math.floor(new Date().getTime() / 86400000) % verseList.length] : null

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Découvrir', path: '/decouvrir' },
          { name: 'Découvrir la foi', path: '/decouvrir/foi' },
        ])}
      />
      <EditZone page={P} section="Haut de page">
        <PageHero
          id="foi-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo de paysage à venir"
          actions={
            <>
              <ButtonLink href="#commencer">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#themes" variant="outline-light">
                {hero?.secondary}
              </ButtonLink>
            </>
          }
          aside={hero?.quoteText ? <QuoteCard text={hero.quoteText} source={hero.quoteSource} /> : undefined}
        />
      </EditZone>

      <EditZone page={P} section="Raccourcis">
        <div className="container-site relative z-10 -mt-12">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(shortcuts?.items ?? []).map((s, i) => {
              const Icon = iconFor(s.icon)
              const target = faithThemes[i]?.value
              return (
                <li key={s.id ?? s.title}>
                  <Link
                    href={target ? `/decouvrir/foi?theme=${target}#ressources` : '#ressources'}
                    className="flex h-full flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-[0_24px_60px_-30px_rgba(11,22,40,.5)] ring-1 ring-navy-900/5 transition-transform hover:-translate-y-0.5"
                  >
                    <Icon className="h-7 w-7 text-navy-900" aria-hidden="true" />
                    <span className="text-sm font-bold text-navy-900">{s.title}</span>
                    <span className="text-xs text-muted">{s.text}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </EditZone>

      {/* Recherche et filtres */}
      <section id="ressources" aria-labelledby="ressources-title" className="scroll-mt-20 pt-16">
        <div className="container-site">
          <form action="/decouvrir/foi#ressources" className="flex flex-wrap gap-3 rounded-2xl bg-mist p-4">
            <label className="relative min-w-0 flex-1 basis-60">
              <span className="sr-only">Rechercher une ressource</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Rechercher une ressource, un thème…"
                className="w-full rounded-xl border border-navy-900/15 bg-white py-3 pr-4 pl-11 text-sm focus:border-gold-400 focus:outline-none"
              />
            </label>
            {(
              [
                ['theme', 'Tous les thèmes', faithThemes, theme],
                ['type', 'Tous les types', faithTypes, type],
                ['niveau', 'Tous les niveaux', faithLevels, level],
              ] as const
            ).map(([name, label, options, value]) => (
              <label key={name}>
                <span className="sr-only">{label}</span>
                <select
                  name={name}
                  defaultValue={value}
                  className="rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-sm focus:border-gold-400 focus:outline-none"
                >
                  <option value="">{label}</option>
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <button type="submit" className="rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-800">
              Rechercher
            </button>
            {filtering && (
              <Link href="/decouvrir/foi#ressources" className="self-center text-sm font-semibold text-navy-900 underline">
                Tout afficher
              </Link>
            )}
          </form>
          {filtering && (
            <>
              <h2 id="ressources-title" className="mt-10 text-2xl font-extrabold text-navy-900">
                {filtered.length} ressource(s) trouvée(s)
              </h2>
              {filtered.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-muted">
                  Aucune ressource ne correspond à votre recherche pour l’instant.
                </p>
              ) : (
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((r) => (
                    <ResourceCard key={r.id} r={r} />
                  ))}
                </ul>
              )}
            </>
          )}
          {!filtering && <h2 id="ressources-title" className="sr-only">Ressources</h2>}
        </div>
      </section>

      {!filtering && (
        <>
          {/* Thèmes */}
          <EditZone page={P} section="Explorer par thème">
            <section id="themes" aria-labelledby="themes-title" className="scroll-mt-20 pt-14">
              <div className="container-site">
                <h2 id="themes-title" className="text-2xl font-extrabold text-navy-900">
                  <Rich text={themes?.title} />
                </h2>
                <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {(themes?.cards ?? []).map((c) => {
                    const n = all.filter((r) => r.theme === c.theme).length
                    return (
                      <li key={c.id ?? c.theme}>
                        <Link
                          href={`/decouvrir/foi?theme=${c.theme}#ressources`}
                          className="group relative block aspect-[4/3.2] overflow-hidden rounded-2xl bg-navy-900"
                        >
                          <Photo media={asMedia(c.image)} alt="" placeholder="" className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" sizes="(min-width:1024px) 20vw, 50vw" />
                          <span className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white">
                            <span>
                              <span className="block text-sm font-bold">{themeLabel(c.theme)}</span>
                              <span className="text-xs text-white/75">{n} ressource{n > 1 ? 's' : ''}</span>
                            </span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400 text-gold-400">
                              <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          </EditZone>

          {/* Ressources récentes et Par où commencer */}
          <section aria-labelledby="recentes-title" className="py-14">
            <div className="container-site grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 id="recentes-title" className="text-2xl font-extrabold text-navy-900">
                    Ressources récentes
                  </h2>
                  {all.length > 0 && (
                    <Link href="/decouvrir/foi?tout=1#ressources" className="text-sm font-semibold text-navy-900 hover:underline">
                      Voir toutes les ressources <ArrowRight className="inline h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
                {recent.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-muted">
                    Les premiers articles, guides et parcours seront publiés ici très bientôt.
                  </p>
                ) : (
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {recent.map((r) => (
                      <ResourceCard key={r.id} r={r} />
                    ))}
                  </ul>
                )}
              </div>
              <EditZone page={P} section="Par où commencer ?">
                <div id="commencer" className="scroll-mt-24 rounded-3xl bg-gold-400/15 p-6">
                  <h2 className="font-display text-xl font-extrabold text-navy-900">
                    <Rich text={start?.title} />
                  </h2>
                  <ol className="mt-5 space-y-2">
                    {(start?.steps ?? []).map((s, i) => (
                      <li key={s.id ?? s.title}>
                        <Link
                          href={s.link || '#ressources'}
                          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-navy-900 shadow-sm hover:ring-2 hover:ring-gold-400"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-400 text-xs font-extrabold">{i + 1}</span>
                          {s.title}
                          <ArrowRight className="ml-auto h-4 w-4" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ol>
                  {start?.button && (
                    <ButtonLink href={start.buttonLink || '#ressources'} className="mt-5 w-full justify-center">
                      <BookOpen className="h-4 w-4" aria-hidden="true" /> {start.button}
                    </ButtonLink>
                  )}
                </div>
              </EditZone>
            </div>
          </section>

          {/* Vidéos et verset du jour */}
          <section aria-labelledby="videos-title" className="bg-mist py-14">
            <div className="container-site grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="min-w-0">
                <h2 id="videos-title" className="text-2xl font-extrabold text-navy-900">
                  Vidéos populaires
                </h2>
                {videos.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-navy-900/20 bg-white p-10 text-center text-muted">
                    Les premières vidéos seront publiées ici très bientôt.
                  </p>
                ) : (
                  <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {videos.map((r) => (
                      <ResourceCard key={r.id} r={r} />
                    ))}
                  </ul>
                )}
              </div>
              <EditZone page={P} section="Versets du jour">
                <div>
                  <h2 className="text-2xl font-extrabold text-navy-900">
                    <Rich text={verses?.title} />
                  </h2>
                  {verse && (
                    <figure className="relative isolate mt-6 overflow-hidden rounded-3xl bg-navy-900 p-7 text-white">
                      <Photo media={asMedia(verses?.image)} alt="" placeholder="" className="absolute inset-0 -z-10 h-full w-full opacity-80" />
                      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/85 to-navy-950/25" />
                      <blockquote className="text-lg leading-relaxed font-semibold">« {verse.text} »</blockquote>
                      <figcaption className="mt-4 flex items-center gap-3 text-sm text-gold-300">
                        <span className="h-0.5 w-5 rounded bg-gold-400" aria-hidden="true" />
                        {verse.reference}
                      </figcaption>
                    </figure>
                  )}
                </div>
              </EditZone>
            </div>
          </section>
        </>
      )}

      <EditZone page={P} section="Appel final">
        <section aria-labelledby="foi-cta-title" className="bg-navy-900 py-12 text-white">
          <div className="container-site flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold-400 text-gold-400">
                <Users className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 id="foi-cta-title" className="text-2xl font-extrabold">
                  <Rich text={cta?.title} />
                </h2>
                <p className="mt-1 text-white/75">{cta?.text}</p>
              </div>
            </div>
            <ButtonLink href="/contact#ecrire" variant="outline-light">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> {cta?.primary}
            </ButtonLink>
          </div>
        </section>
      </EditZone>
    </>
  )
}
