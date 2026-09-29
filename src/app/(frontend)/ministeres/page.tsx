import type { Metadata } from 'next'
import { ArrowRight, PlayCircle } from 'lucide-react'

import {
  CtaBand,
  FeatureStrip,
  Glow,
  IconRing,
  PageHero,
  QuoteCard,
  SectionHead,
  TextLink,
  toFeatures,
} from '@/components/pages/blocks'
import { MinistryGrid } from '@/components/pages/MinistryGrid'
import { EditZone } from '@/components/site/EditZone'
import { iconFor } from '@/components/site/icons'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getAllMinistries, getPage, getUpcomingEvents } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Ministères',
  description:
    'Louange, jeunesse, enfants, familles, prière, évangélisation… Découvrez les ministères de MKMI Québec et trouvez votre place pour servir.',
  path: '/ministeres',
  eyebrow: 'Ministères',
  ogTitle: 'Des talents au service du Royaume.',
  keywords: ['ministères église', 'servir église Québec', 'jeunesse chrétienne Québec'],
})

const TZ = 'America/Toronto'
const P = 'page-ministeres'

export default async function MinisteresPage() {
  const [page, ministries, events] = await Promise.all([
    getPage(P),
    getAllMinistries(),
    getUpcomingEvents(3),
  ])
  const { hero, features, list, serve, spotlight: une, cta } = page
  const wanted = (une?.ministryName ?? '').trim().toLowerCase()
  const spotlight = ministries.find((m) => m.name.toLowerCase() === wanted) ?? ministries[0]

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Ministères', path: '/ministeres' }])} />
      <EditZone page={P} section="Haut de page">
        <PageHero
          id="ministeres-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo de la louange à venir"
          actions={
            <>
              <ButtonLink href="#liste">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#servir" variant="outline-light">
                <PlayCircle className="h-5 w-5" aria-hidden="true" /> {hero?.secondary}
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

      <EditZone page={P} section="Atouts">
        <FeatureStrip items={toFeatures(features?.items)} />
      </EditZone>

      <EditZone page={P} section="Liste des ministères">
        <section id="liste" aria-labelledby="liste-title" className="scroll-mt-24 py-20 lg:py-24">
          <div className="container-site">
            <SectionHead
              id="liste-title"
              eyebrow={list?.eyebrow}
              title={<Rich text={list?.title} />}
              text={list?.text}
            />
            <MinistryGrid
              ministries={ministries.map((m) => ({
                id: m.id,
                name: m.name,
                slug: m.slug ?? String(m.id),
                summary: m.summary || 'Découvrez ce ministère et comment vous y impliquer.',
                icon: m.icon ?? 'users',
                accent: m.accent ?? 'blue',
                image: asMedia(m.image),
              }))}
            />
          </div>
        </section>
      </EditZone>

      {/* S’impliquer */}
      <EditZone page={P} section="S’impliquer">
        <section
          id="servir"
          aria-labelledby="servir-title"
          className="relative isolate scroll-mt-20 overflow-hidden bg-navy-950 py-20 text-white"
        >
          <div className="absolute inset-0 -z-20">
            <Photo media={asMedia(serve?.image)} alt="" placeholder="" className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/60" />
          </div>
          <Glow />
          <div className="container-site grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead
                light
                id="servir-title"
                eyebrow={serve?.eyebrow}
                title={<Rich text={serve?.title} />}
                text={serve?.text}
              />
              <ButtonLink href="/contact" className="mt-8">
                {serve?.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
            <ul className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {(serve?.steps ?? []).map((s, i) => (
                <IconRing key={s.id ?? i} icon={iconFor(s.icon)} label={s.title} />
              ))}
            </ul>
          </div>
        </section>
      </EditZone>

      {/* À la une */}
      {spotlight && (
        <EditZone page={P} section="À la une">
          <section aria-labelledby="une-title" className="bg-mist py-20">
            <div className="container-site grid items-stretch gap-8 lg:grid-cols-[.8fr_1.2fr]">
              <div className="flex flex-col justify-center">
                <SectionHead
                  id="une-title"
                  eyebrow={une?.eyebrow}
                  title={`Ministère : ${spotlight.name}`}
                  text={
                    spotlight.summary ||
                    'Découvrez ce ministère, ses activités et comment vous y impliquer.'
                  }
                />
                <ButtonLink href={`/ministeres/${spotlight.slug}`} className="mt-8 self-start">
                  {une?.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
              <div className="grid overflow-hidden rounded-3xl bg-navy-950 text-white shadow-2xl sm:grid-cols-[1.3fr_1fr]">
                <Photo
                  media={asMedia(spotlight.image)}
                  placeholder="Photo à venir"
                  className="min-h-64"
                  sizes="(min-width:1024px) 35vw, 100vw"
                />
                <div className="p-6">
                  <p className="font-bold">{une?.activitiesTitle}</p>
                  {events.length === 0 ? (
                    <p className="mt-4 text-sm text-white/60">
                      Les prochaines activités seront annoncées bientôt.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-4">
                      {events.map((e) => {
                        const d = new Date(e.startsAt)
                        const fmt = (o: Intl.DateTimeFormatOptions) =>
                          new Intl.DateTimeFormat('fr-CA', { timeZone: TZ, ...o }).format(d)
                        return (
                          <li key={e.id} className="flex gap-3">
                            <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-white/20 leading-none">
                              <span className="text-lg font-extrabold">
                                {fmt({ day: '2-digit' })}
                              </span>
                              <span className="text-[10px] uppercase">
                                {fmt({ month: 'short' }).replace('.', '')}
                              </span>
                            </span>
                            <span className="text-sm">
                              <span className="block font-semibold">{e.title}</span>
                              <span className="text-white/60">
                                {e.timeToConfirm
                                  ? 'Heure à confirmer'
                                  : fmt({ hour: '2-digit', minute: '2-digit' })}
                                {e.location ? ` · ${e.location}` : ''}
                              </span>
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  <div className="mt-6">
                    <TextLink href="/evenements" light>
                      Voir tous les événements
                    </TextLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </EditZone>
      )}

      <EditZone page={P} section="Appel final">
        <CtaBand
          id="rejoindre-title"
          eyebrow={cta?.eyebrow}
          title={<Rich text={cta?.title} />}
          text={cta?.text}
          image={asMedia(cta?.image)}
          actions={
            <ButtonLink href="/contact">
              {cta?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          }
        />
      </EditZone>
    </>
  )
}
