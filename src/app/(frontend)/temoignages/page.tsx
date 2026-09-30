import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, BookOpen, Heart, PenLine, Play, Quote, Search, UsersRound } from 'lucide-react'

import { testimonialCategories } from '@/collections/Testimonials'
import { PageHero, SectionHead } from '@/components/pages/blocks'
import { TestimonyForm } from '@/components/pages/forms'
import { EditZone } from '@/components/site/EditZone'
import { iconFor } from '@/components/site/icons'
import { NewsletterForm } from '@/components/site/NewsletterForm'
import { Rich } from '@/components/site/Rich'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { asMedia, getAllTestimonials, getPage } from '@/lib/content'
import { youtubeThumb } from '@/lib/sermons'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import type { Testimonial } from '@/payload-types'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Témoignages',
  description:
    'Des vies transformées par la puissance de Dieu : lisez et regardez les témoignages de la communauté MKMI Québec, et partagez le vôtre.',
  path: '/temoignages',
  eyebrow: 'Témoignages',
  ogTitle: 'Des vies transformées par la puissance de Dieu.',
  keywords: ['témoignages chrétiens', 'témoignage de foi', 'église Québec'],
})

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const P = 'page-temoignages'
const PER_PAGE = 9
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const catLabel = (v?: string | null) => testimonialCategories.find((c) => c.value === v)?.label ?? 'Autre'
const day = (iso: string) =>
  new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
const heroIcons = [BookOpen, Heart, UsersRound]

function Card({ t }: { t: Testimonial }) {
  const photo = asMedia(t.photo)
  const img = photo ? (photo.sizes?.card?.url ?? photo.url) : youtubeThumb(t)
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-30px_rgba(11,22,40,.5)] ring-1 ring-navy-900/5">
      {img ? (
        <a
          href={t.youtubeUrl ?? undefined}
          target={t.youtubeUrl ? '_blank' : undefined}
          rel={t.youtubeUrl ? 'noopener noreferrer' : undefined}
          className="relative block aspect-video bg-navy-900 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
          aria-label={t.youtubeUrl ? `Regarder « ${t.title} » sur YouTube` : undefined}
        >
          <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-navy-900 uppercase">
            {catLabel(t.category)}
          </span>
          {t.youtubeUrl && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-white/15 text-white backdrop-blur">
                <Play className="h-6 w-6" fill="currentColor" aria-hidden="true" />
              </span>
            </span>
          )}
          {t.duration && (
            <span className="absolute right-3 bottom-3 rounded-md bg-navy-950/85 px-2 py-0.5 text-xs font-bold text-white">{t.duration}</span>
          )}
        </a>
      ) : (
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950 px-8 text-center">
          <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-navy-900 uppercase">
            {catLabel(t.category)}
          </span>
          <Quote className="h-10 w-10 fill-gold-400 text-gold-400" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-navy-900">{t.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{t.text}</p>
        {t.text.length > 180 && (
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer font-semibold text-navy-900 hover:underline">Lire le témoignage</summary>
            <p className="mt-2 whitespace-pre-line text-muted">{t.text}</p>
          </details>
        )}
        <p className="mt-auto flex items-center gap-3 pt-4 text-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-bold text-gold-400" aria-hidden="true">
            {t.firstName.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <span className="block font-semibold text-navy-900">{t.firstName}</span>
            <span className="text-xs text-muted">{day(t.createdAt)}</span>
          </span>
        </p>
      </div>
    </li>
  )
}

export default async function TemoignagesPage({ searchParams }: Props) {
  const params = await searchParams
  const [page, all] = await Promise.all([getPage(P), getAllTestimonials()])
  const { hero, features, share, newsletter } = page
  const q = one(params.q)
  const cat = one(params.categorie)
  const sort = one(params.tri) === 'anciens' ? 'anciens' : 'recents'
  const current = Math.max(1, Number(one(params.p)) || 1)

  const filtered = all
    .filter((t) => (!cat || t.category === cat) && (!q || norm(`${t.title} ${t.text} ${t.firstName}`).includes(norm(q))))
    .sort((a, b) => (sort === 'anciens' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)))
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageNo = Math.min(current, pages)
  const rows = filtered.slice((pageNo - 1) * PER_PAGE, pageNo * PER_PAGE)
  const counts = testimonialCategories.map((c) => ({ ...c, n: all.filter((t) => t.category === c.value).length }))
  const href = (extra: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, categorie: cat, tri: sort === 'anciens' ? 'anciens' : undefined, ...extra }))
      if (v !== undefined && v !== '') sp.set(k, String(v))
    const s = sp.toString()
    return `/temoignages${s ? `?${s}` : ''}#liste`
  }

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Témoignages', path: '/temoignages' }])} />
      <EditZone page={P} section="Haut de page">
        <PageHero
          id="temoignages-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo de louange à venir"
          actions={
            <>
              <ButtonLink href="#partager">
                <PenLine className="h-4 w-4" aria-hidden="true" /> {hero?.primary}
              </ButtonLink>
              <ButtonLink href="#liste" variant="outline-light">
                {hero?.secondary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </>
          }
        />
      </EditZone>

      <EditZone page={P} section="Atouts">
        <div className="bg-navy-950 pb-10 text-white">
          <ul className="container-site grid gap-6 sm:grid-cols-3">
            {(features?.items ?? []).map((f, i) => {
              const Icon = f.icon ? iconFor(f.icon) : heroIcons[i % 3]
              return (
                <li key={f.id ?? f.title} className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400 text-gold-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm">
                    <span className="block font-bold">{f.title}</span>
                    <span className="text-white/70">{f.text}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </EditZone>

      <section id="liste" aria-labelledby="liste-title" className="scroll-mt-20 py-16 lg:py-20">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <form action="/temoignages#liste" className="flex flex-wrap gap-3">
              <label className="relative min-w-0 flex-1 basis-64">
                <span className="sr-only">Rechercher un témoignage</span>
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Rechercher un témoignage…"
                  className="w-full rounded-xl border border-navy-900/15 bg-white py-3 pr-4 pl-11 text-sm focus:border-gold-400 focus:outline-none"
                />
              </label>
              {cat && <input type="hidden" name="categorie" value={cat} />}
              <label>
                <span className="sr-only">Trier</span>
                <select
                  name="tri"
                  defaultValue={sort}
                  className="rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-sm focus:border-gold-400 focus:outline-none"
                >
                  <option value="recents">Trier par : plus récents</option>
                  <option value="anciens">Trier par : plus anciens</option>
                </select>
              </label>
              <button type="submit" className="rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white hover:bg-navy-800">
                Rechercher
              </button>
            </form>

            <nav aria-label="Catégories" className="mt-4 flex flex-wrap gap-2">
              <a
                href={href({ categorie: undefined, p: undefined })}
                aria-current={!cat ? 'true' : undefined}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold ${!cat ? 'bg-navy-900 text-white' : 'bg-white text-navy-900 ring-1 ring-navy-900/10 hover:ring-gold-400'}`}
              >
                Tous ({all.length})
              </a>
              {counts
                .filter((c) => c.n > 0)
                .map((c) => (
                  <a
                    key={c.value}
                    href={href({ categorie: c.value, p: undefined })}
                    aria-current={cat === c.value ? 'true' : undefined}
                    className={`rounded-lg px-3.5 py-2 text-sm font-semibold ${cat === c.value ? 'bg-navy-900 text-white' : 'bg-white text-navy-900 ring-1 ring-navy-900/10 hover:ring-gold-400'}`}
                  >
                    {c.label} ({c.n})
                  </a>
                ))}
            </nav>

            <h2 id="liste-title" className="mt-10 text-2xl font-extrabold text-navy-900">
              {q || cat ? `${filtered.length} témoignage(s) trouvé(s)` : 'Témoignages récents'}
            </h2>
            {rows.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-muted">
                {all.length === 0
                  ? 'Les premiers témoignages seront publiés ici, avec l’accord de leurs auteurs. Soyez le premier à partager le vôtre !'
                  : 'Aucun témoignage ne correspond à votre recherche.'}
              </p>
            ) : (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rows.map((t) => (
                  <Card key={t.id} t={t} />
                ))}
              </ul>
            )}
            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center gap-2">
                <a href={href({ p: Math.max(1, pageNo - 1) })} aria-label="Page précédente" className="rounded-lg p-2.5 ring-1 ring-navy-900/10">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </a>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a
                    key={n}
                    href={href({ p: n })}
                    aria-current={n === pageNo ? 'page' : undefined}
                    className={`min-w-10 rounded-lg px-3 py-2 text-center text-sm font-semibold ${n === pageNo ? 'bg-navy-900 text-white' : 'ring-1 ring-navy-900/10'}`}
                  >
                    {n}
                  </a>
                ))}
                <a href={href({ p: Math.min(pages, pageNo + 1) })} aria-label="Page suivante" className="rounded-lg p-2.5 ring-1 ring-navy-900/10">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="ml-auto text-sm text-muted">
                  Affichage de {(pageNo - 1) * PER_PAGE + 1} à {Math.min(pageNo * PER_PAGE, filtered.length)} sur {filtered.length} témoignages
                </span>
              </nav>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-gold-400/15 p-6">
              <p className="flex items-center gap-2 font-display text-lg font-extrabold text-navy-900">
                <PenLine className="h-5 w-5 text-gold-500" aria-hidden="true" /> Partagez votre témoignage
              </p>
              <p className="mt-2 text-sm text-muted">Dieu fait encore des merveilles aujourd’hui ! Votre témoignage peut encourager d’autres personnes.</p>
              <ButtonLink href="#partager" className="mt-4 w-full justify-center">
                Partager mon témoignage
              </ButtonLink>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-navy-900/5">
              <h2 className="font-display text-lg font-extrabold text-navy-900">Catégories</h2>
              <ul className="mt-4 space-y-1 text-sm">
                <li>
                  <a href={href({ categorie: undefined, p: undefined })} className="flex justify-between rounded-lg px-2 py-1.5 hover:bg-mist">
                    <span className={!cat ? 'font-bold text-navy-900' : ''}>Tous les témoignages</span>
                    <span className="text-muted">{all.length}</span>
                  </a>
                </li>
                {counts.map((c) => (
                  <li key={c.value}>
                    <a href={href({ categorie: c.value, p: undefined })} className="flex justify-between rounded-lg px-2 py-1.5 hover:bg-mist">
                      <span className={cat === c.value ? 'font-bold text-navy-900' : ''}>{c.label}</span>
                      <span className="text-muted">{c.n}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Formulaire de témoignage écrit */}
      <EditZone page={P} section="Partager un témoignage">
        <section id="partager" aria-labelledby="partager-title" className="scroll-mt-20 bg-mist py-20">
          <div className="container-site grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <SectionHead id="partager-title" className="self-start" eyebrow={share?.eyebrow} title={<Rich text={share?.title} />} text={share?.text} />
            <div className="rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
              <h2 className="mb-6 text-lg font-bold text-navy-900">{share?.formTitle}</h2>
              <TestimonyForm categories={testimonialCategories} />
            </div>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Infolettre">
        <section aria-labelledby="nouvelles-title" className="bg-navy-900 py-14 text-white">
          <div className="container-site grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Eyebrow light>{newsletter?.eyebrow}</Eyebrow>
              <h2 id="nouvelles-title" className="text-3xl font-extrabold">
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
