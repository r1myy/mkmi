import type { Metadata } from 'next'
import { ArrowRight, Globe2, MapPin, PlayCircle } from 'lucide-react'

import {
  CtaBand,
  FeatureStrip,
  Glow,
  PageHero,
  QuoteCard,
  SectionHead,
  toFeatures,
} from '@/components/pages/blocks'
import { iconFor } from '@/components/site/icons'
import { EditZone } from '@/components/site/EditZone'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getHomePage, getMissions, getPage, getTestimonials } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Missions',
  description:
    'L’Évangile sans frontières : les missions et initiatives soutenues par MKMI Québec, au Québec, au Canada et dans le monde.',
  path: '/missions',
  eyebrow: 'Missions',
  ogTitle: 'L’Évangile sans frontières.',
  keywords: ['missions chrétiennes', 'évangélisation', 'Haïti', 'Afrique'],
})

const status = { active: 'En cours', planned: 'À venir', done: 'Terminé' } as const

const tones = [
  'bg-rose-50 text-rose-500',
  'bg-amber-50 text-gold-500',
  'bg-emerald-50 text-emerald-600',
  'bg-blue-50 text-blue-600',
]

export default async function MissionsPage() {
  const [page, home, missions, testimonials] = await Promise.all([
    getPage('page-missions'),
    getHomePage(),
    getMissions(),
    getTestimonials(3),
  ])
  const {
    hero,
    features,
    vision,
    fields,
    presence,
    involve,
    testimonials: testimonialsSection,
    cta,
  } = page
  const zones = home.missions?.zones ?? []

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Missions', path: '/missions' }])} />
      <EditZone page="page-missions" section="Haut de page">
        <PageHero
          id="missions-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo de mission à venir"
          actions={
            <>
              <ButtonLink href="#champs">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#impliquer" variant="outline-light">
                <PlayCircle className="h-5 w-5" aria-hidden="true" /> {hero?.secondary}
              </ButtonLink>
            </>
          }
        />
      </EditZone>

      <EditZone page="page-missions" section="Atouts">
        <FeatureStrip items={toFeatures(features?.items)} />
      </EditZone>

      <EditZone page="page-missions" section="Notre vision">
        {/* Vision */}
        <section aria-labelledby="vision-title" className="py-20 lg:py-24">
          <div className="container-site grid items-center gap-12 lg:grid-cols-2">
            <SectionHead
              id="vision-title"
              eyebrow={vision?.eyebrow}
              title={<Rich text={vision?.title} />}
              text={vision?.text}
            />
            <div className="relative overflow-hidden rounded-3xl">
              <Photo
                media={asMedia(vision?.image)}
                placeholder="Photo à venir"
                className="aspect-[16/10] w-full"
                sizes="(min-width:1024px) 50vw, 100vw"
              />
              <QuoteCard
                className="absolute right-4 bottom-4 left-4 sm:left-auto sm:max-w-xs"
                text={vision?.quoteText}
                source={vision?.quoteSource}
              />
            </div>
          </div>
        </section>
      </EditZone>

      {/* Champs d’action */}
      <EditZone page="page-missions" section="Champs d’action">
        <section id="champs" aria-labelledby="champs-title" className="scroll-mt-20 bg-mist py-20">
          <div className="container-site">
            <SectionHead
              id="champs-title"
              eyebrow={fields?.eyebrow}
              title={<Rich text={fields?.title} />}
            />
            {missions.length > 0 ? (
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {missions.map((m) => {
                  const image = (m.images ?? []).map(asMedia).find(Boolean) ?? null
                  return (
                    <li
                      key={m.id}
                      className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)]"
                    >
                      <Photo
                        media={image}
                        tone="light"
                        placeholder=""
                        className="aspect-[16/9] w-full"
                        sizes="(min-width:1024px) 33vw, 50vw"
                      />
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-3">
                          <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-navy-900 uppercase">
                            <MapPin className="h-4 w-4 text-gold-500" aria-hidden="true" /> {m.zone}
                          </p>
                          {m.status && (
                            <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-muted">
                              {status[m.status]}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-lg font-bold text-navy-900">{m.project}</h3>
                        {m.description && (
                          <p className="mt-2 text-sm text-muted">{m.description}</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <ul className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {zones.map((z, i) => (
                  <li
                    key={z.id ?? i}
                    className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-navy-900 p-5 text-white"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_70%_10%,rgba(245,191,79,.35),transparent_65%)] transition-transform duration-500 group-hover:scale-110"
                    />
                    <Globe2
                      aria-hidden="true"
                      className="absolute -top-6 -right-6 h-28 w-28 text-white/5"
                    />
                    <MapPin className="h-5 w-5 text-gold-400" aria-hidden="true" />
                    <p className="mt-2 font-display text-lg font-extrabold">{z.name}</p>
                    <p className="text-xs text-white/60">Projets à venir</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </EditZone>

      {/* Présence : seulement quand des projets sont publiés, sinon les zones figurent déjà plus haut. */}
      {missions.length > 0 && (
        <EditZone page="page-missions" section="Notre empreinte">
          <section
            aria-labelledby="presence-title"
            className="relative isolate overflow-hidden bg-navy-950 py-20 text-white"
          >
            <Glow />
            <div className="container-site grid items-center gap-12 lg:grid-cols-2">
              <div>
                <SectionHead
                  light
                  id="presence-title"
                  eyebrow={presence?.eyebrow}
                  title={<Rich text={presence?.title} />}
                  text={presence?.text}
                />
              </div>
              <ul className="flex flex-wrap gap-3">
                {zones.map((z, i) => (
                  <li
                    key={z.id ?? i}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold"
                  >
                    <span
                      className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_12px_2px_rgba(245,191,79,.6)]"
                      aria-hidden="true"
                    />
                    {z.name}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </EditZone>
      )}

      {/* S’impliquer */}
      <EditZone page="page-missions" section="Comment s’impliquer">
        <section
          id="impliquer"
          aria-labelledby="impliquer-title"
          className="scroll-mt-20 py-20 lg:py-24"
        >
          <div className="container-site grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <SectionHead
              id="impliquer-title"
              eyebrow={involve?.eyebrow}
              title={<Rich text={involve?.title} />}
              text={involve?.text}
            />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(involve?.ways ?? []).map(({ icon, title, text, link, id }, i) => {
                const Icon = iconFor(icon)
                return (
                  <li key={id ?? i}>
                    <a
                      href={link || '/contact'}
                      className="group flex h-full flex-col items-center rounded-2xl border border-navy-900/5 bg-white p-5 text-center shadow-[0_14px_40px_-28px_rgba(11,22,40,.5)] transition-transform hover:-translate-y-1"
                    >
                      <span
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tones[i % tones.length]}`}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="mt-4 font-bold text-navy-900">{title}</span>
                      <span className="mt-1 text-xs text-muted">{text}</span>
                      <ArrowRight
                        className="mt-4 h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </EditZone>

      {/* Témoignages */}
      {testimonials.length > 0 && (
        <EditZone page="page-missions" section="Témoignages">
          <section aria-labelledby="temoignages-title" className="bg-mist py-20">
            <div className="container-site">
              <SectionHead
                id="temoignages-title"
                eyebrow={testimonialsSection?.eyebrow}
                title={<Rich text={testimonialsSection?.title} />}
              />
              <ul className="mt-10 grid gap-5 md:grid-cols-3">
                {testimonials.map((t) => (
                  <li key={t.id} className="rounded-2xl bg-white p-6 shadow-sm">
                    <p className="text-sm leading-relaxed text-ink">« {t.text} »</p>
                    <p className="mt-4 text-sm font-semibold text-navy-900">— {t.firstName}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </EditZone>
      )}

      <EditZone page="page-missions" section="Appel final">
        <CtaBand
          id="soutenir-title"
          eyebrow={cta?.eyebrow}
          title={<Rich text={cta?.title} />}
          text={cta?.text}
          image={asMedia(cta?.image)}
          actions={
            <>
              <ButtonLink href="/donner">
                {cta?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline-light">
                {cta?.secondary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </>
          }
        />
      </EditZone>
    </>
  )
}
