import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin, MessageCircle, PlayCircle } from 'lucide-react'

import { CtaBand, Faq, FeatureStrip, Glow, IconRing, PageHero, SectionHead, toFeatures } from '@/components/pages/blocks'
import { EditZone } from '@/components/site/EditZone'
import { iconFor } from '@/components/site/icons'
import { JsonLd } from '@/components/site/JsonLd'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { asMedia, getAllMinistries, getPage, getSettings } from '@/lib/content'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Notre église',
  description:
    'Une maison pour tous : découvrez nos cultes du dimanche, nos groupes pour chaque génération et tout ce qu’il faut savoir avant votre première visite à MKMI Québec.',
  path: '/eglise',
  eyebrow: 'Notre église',
  ogTitle: 'Une maison pour tous.',
  keywords: ['culte dimanche Québec', 'église Charlesbourg', 'première visite église'],
})

const P = 'page-eglise'

// Photo par défaut d’un groupe : celle du ministère correspondant.
const ministryFor: Record<string, string> = { Adultes: 'Hommes', Groupes: 'Prière' }

export default async function EglisePage() {
  const [page, settings, ministries] = await Promise.all([getPage(P), getSettings(), getAllMinistries()])
  const { hero, features, welcome, services, groups, membership, faq, cta } = page
  const ministryImage = (name: string) => asMedia(ministries.find((m) => m.name === (ministryFor[name] ?? name))?.image)
  const directions = settings.directionsUrl

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Notre église', path: '/eglise' }])} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (faq?.questions ?? []).map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        }}
      />

      <EditZone page={P} section="Haut de page">
        <PageHero
          id="eglise-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo du culte à venir"
          actions={
            <>
              <ButtonLink href="/planifier-ma-visite">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/decouvrir" variant="outline-light">
                <PlayCircle className="h-5 w-5" aria-hidden="true" /> {hero?.secondary}
              </ButtonLink>
            </>
          }
        />
      </EditZone>

      <EditZone page={P} section="Atouts">
        <FeatureStrip items={toFeatures(features?.items)} />
      </EditZone>

      <EditZone page={P} section="À quoi s’attendre">
        <section aria-labelledby="attendre-title" className="py-20 lg:py-24">
          <div className="container-site grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead id="attendre-title" eyebrow={welcome?.eyebrow} title={<Rich text={welcome?.title} />} text={welcome?.text} />
              <ButtonLink href="#faq" variant="outline-dark" className="mt-8">
                {welcome?.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 h-full w-full rounded-3xl border-2 border-gold-400/60" aria-hidden="true" />
              <Photo
                media={asMedia(welcome?.image)}
                placeholder="Photo d’accueil à venir"
                className="relative aspect-[4/3] w-full rounded-3xl"
                sizes="(min-width:1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Nos cultes">
        <section aria-labelledby="cultes-title" className="relative isolate overflow-hidden bg-navy-950 py-14 text-white">
          <Glow />
          <div className="container-site grid items-center gap-8 lg:grid-cols-[1fr_1.4fr_auto]">
            <div>
              <Eyebrow light>{services?.eyebrow}</Eyebrow>
              <h2 id="cultes-title" className="text-3xl font-extrabold">
                <Rich text={services?.title} />
              </h2>
              <p className="mt-3 text-white/75">{services?.text}</p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              <div className="flex gap-4 bg-navy-900/80 p-5">
                <CalendarDays className="h-8 w-8 shrink-0 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="font-bold">{settings.serviceDay}</p>
                  <p className="text-lg font-extrabold">{settings.serviceTime}</p>
                  <p className="text-sm text-white/60">{services?.serviceLabel}</p>
                </div>
              </div>
              <div className="flex gap-4 bg-navy-900/80 p-5">
                <MapPin className="h-8 w-8 shrink-0 text-gold-400" aria-hidden="true" />
                <div>
                  <p className="font-bold">{settings.city}</p>
                  <p className="text-sm text-white/70">
                    {settings.address}, {settings.postalCode}
                  </p>
                  {directions && (
                    <a
                      href={directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-gold-400 hover:underline"
                    >
                      Voir sur la carte <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonLink href="/planifier-ma-visite">
                {services?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline-light">
                {services?.secondary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Pour chaque génération">
        <section aria-labelledby="groupes-title" className="bg-mist py-20">
          <div className="container-site">
            <SectionHead id="groupes-title" eyebrow={groups?.eyebrow} title={<Rich text={groups?.title} />} />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(groups?.cards ?? []).map((card, i) => {
                const Icon = iconFor(card.icon)
                return (
                  <li key={card.id ?? i}>
                    <Link
                      href="/ministeres"
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)] transition-transform hover:-translate-y-1"
                    >
                      <Photo
                        media={asMedia(card.image) ?? ministryImage(card.title)}
                        className="aspect-[16/10] w-full"
                        tone="light"
                        placeholder=""
                        sizes="(min-width:1024px) 25vw, 50vw"
                      />
                      <div className="relative flex flex-1 flex-col p-6 pt-9">
                        <span className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-md ring-4 ring-gold-400/30">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="text-lg font-bold text-navy-900">{card.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-muted">{card.text}</p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                          En savoir plus
                          <ArrowRight className="h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Devenir membre">
        <section aria-labelledby="membre-title" className="relative isolate overflow-hidden bg-navy-900 py-20 text-white">
          <div className="absolute inset-0 -z-20">
            <Photo media={asMedia(membership?.image)} alt="" placeholder="" className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/60" />
          </div>
          <Glow />
          <div className="container-site grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead light id="membre-title" eyebrow={membership?.eyebrow} title={<Rich text={membership?.title} />} text={membership?.text} />
              <ButtonLink href="/contact" className="mt-8">
                {membership?.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
            <ul className="grid grid-cols-3 gap-6">
              {(membership?.steps ?? []).map((s, i) => (
                <IconRing key={s.id ?? i} icon={iconFor(s.icon)} label={s.title} />
              ))}
            </ul>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Questions fréquentes">
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 py-20 lg:py-24">
          <div className="container-site grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <SectionHead id="faq-title" eyebrow={faq?.eyebrow} title={<Rich text={faq?.title} />} text={faq?.text} />
              <ButtonLink href="/contact" variant="outline-dark" className="mt-8">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> {faq?.button}
              </ButtonLink>
            </div>
            <Faq items={faq?.questions ?? []} />
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Appel final">
        <CtaBand
          id="impact-title"
          eyebrow={cta?.eyebrow}
          title={<Rich text={cta?.title} />}
          text={cta?.text}
          image={asMedia(cta?.image)}
          actions={
            <ButtonLink href="/missions">
              {cta?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          }
        />
      </EditZone>
    </>
  )
}
