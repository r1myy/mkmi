import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, LayoutGrid, Mic, Play, Quote, RotateCcw, Search, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { faithTypes } from '@/collections/FaithResources'
import { testimonialCategories } from '@/collections/Testimonials'
import { EditZone } from '@/components/site/EditZone'
import { NewsletterForm } from '@/components/site/NewsletterForm'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { Eyebrow } from '@/components/site/ui'
import { Glow } from '@/components/pages/blocks'
import {
  asMedia,
  getAllMinistries,
  getAllTestimonials,
  getAllUpcomingEvents,
  getFaithResources,
  getPage,
  getSermons,
} from '@/lib/content'
import { formatSermonDate, youtubeThumb } from '@/lib/sermons'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Recherche',
    description: 'Recherchez dans les prédications, ressources, témoignages, événements et ministères de MKMI Québec.',
    path: '/recherche',
    eyebrow: 'Recherche',
  }),
  robots: { index: false, follow: true },
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
type Kind = 'messages' | 'foi' | 'temoignages' | 'evenements' | 'ministeres'
type Result = {
  key: string
  kind: Kind
  badge: string
  title: string
  text?: string | null
  href: string
  image?: string | null
  meta?: string
  date?: string
  year?: string
  duration?: string | null
  video?: boolean
  score: number
}

const P = 'page-recherche'
const PER_PAGE = 9
const kinds: { key: Kind; label: string; icon: LucideIcon }[] = [
  { key: 'messages', label: 'Messages', icon: Mic },
  { key: 'foi', label: 'Découvrir la foi', icon: BookOpen },
  { key: 'temoignages', label: 'Témoignages', icon: Quote },
  { key: 'evenements', label: 'Événements', icon: CalendarDays },
  { key: 'ministeres', label: 'Ministères', icon: Users },
]
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim().slice(0, 100) ?? ''
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const mediaUrl = (v: unknown) => {
  const m = asMedia(v)
  return m ? (m.sizes?.card?.url ?? m.url ?? null) : null
}

/** Pertinence simple : le titre compte davantage que le texte ; tous les mots doivent être trouvés. */
function scoreOf(words: string[], title: string, body: string) {
  if (!words.length) return 1
  const t = norm(title)
  const b = norm(body)
  let score = 0
  for (const w of words) {
    if (t.includes(w)) score += 3
    else if (b.includes(w)) score += 1
    else return 0
  }
  return score
}

export default async function RecherchePage({ searchParams }: Props) {
  const params = await searchParams
  const q = one(params.q)
  const kind = one(params.type) as '' | Kind
  const year = one(params.annee)
  const sort = one(params.tri) === 'recents' ? 'recents' : 'pertinence'
  const current = Math.max(1, Number(one(params.p)) || 1)
  const words = norm(q).split(/\s+/).filter((w) => w.length > 1)

  const [page, sermons, resources, testimonials, events, ministries] = await Promise.all([
    getPage(P),
    getSermons(),
    getFaithResources(),
    getAllTestimonials(),
    getAllUpcomingEvents(),
    getAllMinistries(),
  ])
  const { hero, newsletter } = page

  const all: Result[] = [
    ...sermons.map((s) => ({
      key: `m${s.id}`,
      kind: 'messages' as const,
      badge: s.category || 'Prédication',
      title: s.title,
      text: s.series ? `Série : ${s.series}` : null,
      href: `/messages/${s.slug ?? s.id}`,
      image: mediaUrl(s.thumbnail) ?? youtubeThumb(s),
      meta: s.preacher ?? undefined,
      date: formatSermonDate(s.date, 'medium'),
      year: s.date.slice(0, 4),
      duration: s.duration,
      video: Boolean(s.youtubeUrl),
      score: scoreOf(words, s.title, `${s.preacher ?? ''} ${s.series ?? ''} ${s.category ?? ''}`),
    })),
    ...resources.map((r) => ({
      key: `f${r.id}`,
      kind: 'foi' as const,
      badge: faithTypes.find((t) => t.value === r.type)?.label ?? 'Ressource',
      title: r.title,
      text: r.summary,
      href: `/decouvrir/foi/${r.slug ?? r.id}`,
      image: mediaUrl(r.cover) ?? youtubeThumb(r),
      meta: r.author ?? undefined,
      date: formatSermonDate(r.publishedAt, 'medium'),
      year: r.publishedAt.slice(0, 4),
      duration: r.duration,
      video: r.type === 'video' || Boolean(r.youtubeUrl),
      score: scoreOf(words, r.title, `${r.summary ?? ''} ${r.author ?? ''}`),
    })),
    ...testimonials.map((t) => ({
      key: `t${t.id}`,
      kind: 'temoignages' as const,
      badge: testimonialCategories.find((c) => c.value === t.category)?.label ?? 'Témoignage',
      title: t.title,
      text: t.text,
      href: `/temoignages?q=${encodeURIComponent(t.title)}#liste`,
      image: mediaUrl(t.photo) ?? youtubeThumb(t),
      meta: t.firstName,
      date: formatSermonDate(t.createdAt, 'medium'),
      year: t.createdAt.slice(0, 4),
      duration: t.duration,
      video: Boolean(t.youtubeUrl),
      score: scoreOf(words, t.title, `${t.text} ${t.firstName}`),
    })),
    ...events.map((e) => ({
      key: `e${e.id}`,
      kind: 'evenements' as const,
      badge: 'Événement',
      title: e.title,
      text: e.summary,
      href: `/evenements/${e.slug ?? e.id}`,
      image: mediaUrl(e.image),
      meta: e.location ?? undefined,
      date: formatSermonDate(e.startsAt, 'medium'),
      year: e.startsAt.slice(0, 4),
      score: scoreOf(words, e.title, `${e.summary ?? ''} ${e.location ?? ''}`),
    })),
    ...ministries.map((m) => ({
      key: `n${m.id}`,
      kind: 'ministeres' as const,
      badge: 'Ministère',
      title: m.name,
      text: m.summary,
      href: `/ministeres/${m.slug ?? m.id}`,
      image: mediaUrl(m.image),
      meta: m.schedule ?? undefined,
      score: scoreOf(words, m.name, `${m.summary ?? ''} ${m.leader ?? ''}`),
    })),
  ].filter((r) => r.score > 0)

  const inKind = all.filter((r) => !kind || r.kind === kind)
  const years = [...new Set(all.map((r) => r.year).filter((y): y is string => Boolean(y)))].sort().reverse()
  const filtered = inKind
    .filter((r) => !year || r.year === year)
    .sort((a, b) => (sort === 'recents' ? (b.year ?? '').localeCompare(a.year ?? '') : b.score - a.score))
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageNo = Math.min(current, pages)
  const rows = filtered.slice((pageNo - 1) * PER_PAGE, pageNo * PER_PAGE)
  const count = (k: Kind) => all.filter((r) => r.kind === k).length
  const href = (extra: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, type: kind, annee: year, tri: sort === 'recents' ? 'recents' : undefined, ...extra }))
      if (v !== undefined && v !== '') sp.set(k, String(v))
    return `/recherche?${sp.toString()}#resultats`
  }
  const chip = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold ${active ? 'bg-navy-900 text-white' : 'bg-white text-navy-900 ring-1 ring-navy-900/10 hover:ring-gold-400'}`

  return (
    <>
      <EditZone page={P} section="Haut de page">
        <section aria-labelledby="recherche-title" className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-14 text-white">
          <div className="absolute inset-0 -z-20">
            <Photo media={asMedia(hero?.image)} alt="" placeholder="" className="h-full w-full" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
          </div>
          {!asMedia(hero?.image) && <Glow />}
          <div className="container-site">
            <Eyebrow light>{hero?.eyebrow}</Eyebrow>
            <h1 id="recherche-title" className="text-4xl font-extrabold sm:text-5xl">
              <Rich text={hero?.title} />
            </h1>
            <p className="mt-4 max-w-xl text-white/80">{hero?.text}</p>
            <form action="/recherche" role="search" className="mt-8 flex max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
              <label className="relative flex-1">
                <span className="sr-only">Que recherchez-vous ?</span>
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Un thème, un titre, un prédicateur…"
                  className="w-full py-4 pr-4 pl-12 text-navy-900 focus:outline-none"
                />
              </label>
              {kind && <input type="hidden" name="type" value={kind} />}
              <button type="submit" className="bg-gold-400 px-6 text-sm font-bold text-navy-900 hover:bg-gold-300">
                Rechercher
              </button>
            </form>
            <p className="mt-4 text-sm text-white/80" aria-live="polite">
              {q ? `${inKind.length} résultat${inKind.length > 1 ? 's' : ''} pour « ${q} »` : `${all.length} contenus à explorer`}
            </p>
          </div>
        </section>
      </EditZone>

      <section id="resultats" aria-labelledby="resultats-title" className="scroll-mt-20 py-14">
        <div className="container-site grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside aria-label="Affiner la recherche" className="h-fit space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy-900/5">
            <h2 className="font-display text-lg font-extrabold text-navy-900">Affiner la recherche</h2>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Type de contenu</h3>
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <Link href={href({ type: undefined, p: undefined })} className="flex justify-between rounded-lg px-2 py-1.5 hover:bg-mist" aria-current={!kind ? 'true' : undefined}>
                    <span className={!kind ? 'font-bold text-navy-900' : ''}>Tous les contenus</span>
                    <span className="text-muted">{all.length}</span>
                  </Link>
                </li>
                {kinds.map((k) => (
                  <li key={k.key}>
                    <Link href={href({ type: k.key, p: undefined })} className="flex justify-between rounded-lg px-2 py-1.5 hover:bg-mist" aria-current={kind === k.key ? 'true' : undefined}>
                      <span className={kind === k.key ? 'font-bold text-navy-900' : ''}>{k.label}</span>
                      <span className="text-muted">{count(k.key)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {years.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-navy-900">Années</h3>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>
                    <Link href={href({ annee: undefined, p: undefined })} className="block rounded-lg px-2 py-1.5 hover:bg-mist">
                      <span className={!year ? 'font-bold text-navy-900' : ''}>Toutes les années</span>
                    </Link>
                  </li>
                  {years.map((y) => (
                    <li key={y}>
                      <Link href={href({ annee: y, p: undefined })} className="flex justify-between rounded-lg px-2 py-1.5 hover:bg-mist">
                        <span className={year === y ? 'font-bold text-navy-900' : ''}>{y}</span>
                        <span className="text-muted">{inKind.filter((r) => r.year === y).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href={q ? `/recherche?q=${encodeURIComponent(q)}#resultats` : '/recherche'} className="flex items-center justify-center gap-2 rounded-xl border border-navy-900/15 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-gold-400">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Réinitialiser les filtres
            </Link>
          </aside>

          <div className="min-w-0">
            <nav aria-label="Type de contenu" className="flex flex-wrap gap-2">
              <Link href={href({ type: undefined, p: undefined })} className={chip(!kind)}>
                <LayoutGrid className="h-4 w-4" aria-hidden="true" /> Tous ({all.length})
              </Link>
              {kinds.map(({ key, label, icon: Icon }) => (
                <Link key={key} href={href({ type: key, p: undefined })} className={chip(kind === key)}>
                  <Icon className="h-4 w-4" aria-hidden="true" /> {label} ({count(key)})
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <h2 id="resultats-title" className="text-2xl font-extrabold text-navy-900">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              </h2>
              <p className="text-sm text-muted">
                Trier par :{' '}
                <Link href={href({ tri: undefined, p: undefined })} className={sort === 'pertinence' ? 'font-bold text-navy-900' : 'underline'}>
                  pertinence
                </Link>{' '}
                ·{' '}
                <Link href={href({ tri: 'recents', p: undefined })} className={sort === 'recents' ? 'font-bold text-navy-900' : 'underline'}>
                  plus récents
                </Link>
              </p>
            </div>

            {rows.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-muted">
                <p>{q ? `Aucun résultat pour « ${q} ». Essayez un autre mot, ou explorez nos pages :` : 'Aucun contenu pour l’instant.'}</p>
                <p className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-semibold text-navy-900">
                  <Link href="/messages" className="underline">Messages</Link>
                  <Link href="/decouvrir/foi" className="underline">Découvrir la foi</Link>
                  <Link href="/evenements" className="underline">Événements</Link>
                  <Link href="/ministeres" className="underline">Ministères</Link>
                </p>
              </div>
            ) : (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rows.map((r) => (
                  <li key={r.key} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-30px_rgba(11,22,40,.5)] ring-1 ring-navy-900/5">
                    <Link href={r.href} className="relative block aspect-video bg-navy-900 bg-cover bg-center" style={r.image ? { backgroundImage: `url(${r.image})` } : undefined} tabIndex={-1} aria-hidden="true">
                      <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-navy-900 uppercase">{r.badge}</span>
                      {r.video && (
                        <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/15 text-white backdrop-blur">
                          <Play className="h-5 w-5" fill="currentColor" />
                        </span>
                      )}
                      {r.duration && <span className="absolute right-3 bottom-3 rounded-md bg-navy-950/85 px-2 py-0.5 text-xs font-bold text-white">{r.duration}</span>}
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold tracking-widest text-muted uppercase">{kinds.find((k) => k.key === r.kind)?.label}</p>
                      <h3 className="mt-1 text-lg font-bold text-navy-900">
                        <Link href={r.href} className="hover:underline">
                          {r.title}
                        </Link>
                      </h3>
                      {r.text && <p className="mt-2 line-clamp-2 text-sm text-muted">{r.text}</p>}
                      <p className="mt-auto pt-4 text-xs text-muted">
                        {[r.meta, r.date].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center gap-2">
                <Link href={href({ p: Math.max(1, pageNo - 1) })} aria-label="Page précédente" className="rounded-lg p-2.5 ring-1 ring-navy-900/10">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={href({ p: n })}
                    aria-current={n === pageNo ? 'page' : undefined}
                    className={`min-w-10 rounded-lg px-3 py-2 text-center text-sm font-semibold ${n === pageNo ? 'bg-navy-900 text-white' : 'ring-1 ring-navy-900/10'}`}
                  >
                    {n}
                  </Link>
                ))}
                <Link href={href({ p: Math.min(pages, pageNo + 1) })} aria-label="Page suivante" className="rounded-lg p-2.5 ring-1 ring-navy-900/10">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <span className="ml-auto text-sm text-muted">
                  Affichage de {(pageNo - 1) * PER_PAGE + 1} à {Math.min(pageNo * PER_PAGE, filtered.length)} sur {filtered.length} résultats
                </span>
              </nav>
            )}
          </div>
        </div>
      </section>

      <EditZone page={P} section="Infolettre">
        <section aria-labelledby="recherche-nouvelles-title" className="bg-navy-900 py-14 text-white">
          <div className="container-site grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Eyebrow light>{newsletter?.eyebrow}</Eyebrow>
              <h2 id="recherche-nouvelles-title" className="text-3xl font-extrabold">
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
