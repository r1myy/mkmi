import type { Metadata } from 'next'
import { Accessibility, ArrowRight, Baby, CalendarClock, Car, MapPin, Navigation } from 'lucide-react'

import { CtaBand, Faq, FeatureStrip, PageHero, SectionHead, toFeatures } from '@/components/pages/blocks'
import { VisitForm } from '@/components/pages/forms'
import { EditZone } from '@/components/site/EditZone'
import { iconFor } from '@/components/site/icons'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getPage, getSettings } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Planifier ma visite',
  description:
    'Première visite à MKMI Québec ? Découvrez le déroulement d’un culte, l’adresse et les informations pratiques, et dites-nous quand vous venez : nous vous attendrons.',
  path: '/planifier-ma-visite',
  eyebrow: 'Planifier ma visite',
  ogTitle: 'Votre première visite, on vous attend.',
  keywords: ['église Québec', 'première visite église', 'culte dimanche Québec', 'église Charlesbourg'],
})

const P = 'page-visite'

export default async function VisitePage() {
  const [page, settings] = await Promise.all([getPage(P), getSettings()])
  const { hero, features, expect, plan, faq, cta } = page
  const steps = expect?.steps ?? []
  const practical = [
    { icon: Car, title: 'Stationnement', text: plan?.parking },
    { icon: Baby, title: 'Pour les enfants', text: plan?.kids },
    { icon: Accessibility, title: 'Accessibilité', text: plan?.access },
  ].filter((p) => p.text)

  const serviceCard = (
    <div className="rounded-3xl border border-white/10 bg-navy-900/70 p-6 backdrop-blur">
      <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Prochain culte</p>
      <ul className="mt-4 space-y-4 text-sm">
        <li className="flex gap-3">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
          <span>
            <span className="block font-bold text-white">{settings.serviceDay}</span>
            <span className="text-white/70">{settings.serviceTime}</span>
          </span>
        </li>
        <li className="flex gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
          <span className="text-white/80">
            {settings.address}
            <br />
            {settings.city} {settings.postalCode}
          </span>
        </li>
      </ul>
      {settings.directionsUrl && (
        <a
          href={settings.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-xs font-bold tracking-wide uppercase hover:bg-white/10"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" /> Voir l’itinéraire
        </a>
      )}
    </div>
  )

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Planifier ma visite', path: '/planifier-ma-visite' }])} />
      <EditZone page={P} section="Haut de page">
        <PageHero
          id="visite-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo d’accueil à venir"
          actions={
            <>
              <ButtonLink href="#planifier">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#deroulement" variant="outline-light">
                {hero?.secondary}
              </ButtonLink>
            </>
          }
          aside={serviceCard}
        />
      </EditZone>

      <EditZone page={P} section="Atouts">
        <FeatureStrip items={toFeatures(features?.items)} />
      </EditZone>

      {/* Déroulement d’un culte */}
      <EditZone page={P} section="À quoi s’attendre">
        <section id="deroulement" aria-labelledby="deroulement-title" className="scroll-mt-20 py-20 lg:py-24">
          <div className="container-site grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <SectionHead
                id="deroulement-title"
                eyebrow={expect?.eyebrow}
                title={<Rich text={expect?.title} />}
                text={expect?.text}
              />
              <ol className="relative mt-10 space-y-6 border-l-2 border-gold-400/40 pl-8">
                {steps.map((step, i) => {
                  const Icon = iconFor(step.icon)
                  return (
                    <li key={step.id ?? i} className="relative">
                      <span className="absolute top-0 -left-[3.1rem] flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-navy-900 ring-4 ring-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="text-xs font-semibold tracking-widest text-muted uppercase">Étape {i + 1}</p>
                      <h3 className="mt-1 text-lg font-bold text-navy-900">{step.title}</h3>
                      {step.text && <p className="mt-1 text-sm text-muted">{step.text}</p>}
                    </li>
                  )
                })}
              </ol>
            </div>
            <Photo
              media={asMedia(expect?.image)}
              placeholder="Photo d’un culte à venir"
              className="aspect-[4/5] w-full rounded-3xl"
              sizes="(min-width:1024px) 45vw, 100vw"
            />
          </div>
        </section>
      </EditZone>

      {/* Formulaire et informations pratiques */}
      <EditZone page={P} section="Formulaire de visite">
        <section id="planifier" aria-labelledby="planifier-title" className="scroll-mt-20 bg-mist py-20 lg:py-24">
          <div className="container-site grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div className="space-y-8">
              <SectionHead
                id="planifier-title"
                eyebrow={plan?.eyebrow}
                title={<Rich text={plan?.title} />}
                text={plan?.text}
              />
              <ul className="space-y-4">
                {practical.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm">
                      <span className="block font-bold text-navy-900">{title}</span>
                      <span className="text-muted">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
              <h2 className="mb-6 text-lg font-bold text-navy-900">{plan?.formTitle}</h2>
              <VisitForm serviceDay={settings.serviceDay} />
            </div>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Questions fréquentes">
        <section aria-labelledby="faq-title" className="py-20">
          <div className="container-site grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <SectionHead id="faq-title" eyebrow={faq?.eyebrow} title={<Rich text={faq?.title} />} text={faq?.text} />
            <Faq items={faq?.questions ?? []} />
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Appel final">
        <CtaBand
          id="visite-cta-title"
          eyebrow={cta?.eyebrow}
          title={<Rich text={cta?.title} />}
          text={cta?.text}
          image={asMedia(cta?.image)}
          actions={
            <>
              <ButtonLink href="/contact#ecrire">
                {cta?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/decouvrir" variant="outline-light">
                {cta?.secondary}
              </ButtonLink>
            </>
          }
        />
      </EditZone>
    </>
  )
}
