import type { Metadata } from 'next'
import { Accessibility, ArrowRight, Baby, Bus, Car, Headset, Mail, MapPin, Navigation } from 'lucide-react'

import { CtaBand, Faq, SectionHead } from '@/components/pages/blocks'
import { VisitPlanner, type VisitService } from '@/components/pages/VisitPlanner'
import { EditZone } from '@/components/site/EditZone'
import { iconFor } from '@/components/site/icons'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { Glow } from '@/components/pages/blocks'
import { asMedia, getPage, getSettings } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Planifier ma visite',
  description:
    'Première visite à MKMI Québec ? Choisissez le jour de votre visite, découvrez les informations pratiques et le déroulement d’un culte : nous vous attendrons.',
  path: '/planifier-ma-visite',
  eyebrow: 'Planifier ma visite',
  ogTitle: 'Planifier ma visite à MKMI Québec',
  keywords: ['église Québec', 'première visite église', 'culte dimanche Québec', 'église Charlesbourg'],
})

const P = 'page-visite'

export default async function VisitePage() {
  const [page, settings] = await Promise.all([getPage(P), getSettings()])
  const { hero, features, services, expect, plan, faq, cta } = page
  const steps = expect?.steps ?? []
  const heroImage = asMedia(hero?.image)
  const list: VisitService[] = (services?.list ?? []).map((s) => {
    const m = asMedia(s.image)
    return { name: s.name, badge: s.badge, weekday: Number(s.weekday), time: s.time, text: s.text, image: m ? (m.sizes?.card?.url ?? m.url) : null }
  })
  const practical = [
    { icon: MapPin, title: 'Adresse', text: [settings.address, `${settings.city ?? ''} ${settings.postalCode ?? ''}`].filter(Boolean).join(', ') },
    { icon: Car, title: 'Stationnement', text: plan?.parking },
    { icon: Bus, title: 'Transport en commun', text: plan?.transit },
    { icon: Baby, title: 'Pour les enfants', text: plan?.kids },
    { icon: Accessibility, title: 'Accessibilité', text: plan?.access },
  ].filter((p) => p.text)

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Planifier ma visite', path: '/planifier-ma-visite' }])} />
      <EditZone page={P} section="Haut de page">
        <section aria-labelledby="visite-title" className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-12 text-white">
          <div className="absolute inset-0 -z-20">
            <Photo media={heroImage} alt="" placeholder="" className="h-full w-full" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/20" />
          </div>
          {!heroImage && <Glow />}
          <div className="container-site">
            <Eyebrow light>{hero?.eyebrow}</Eyebrow>
            <h1 id="visite-title" className="text-[2.6rem] leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
              <Rich text={hero?.title} />
            </h1>
            <p className="mt-5 max-w-xl text-white/85 sm:text-lg">{hero?.text}</p>
            <EditZone page={P} section="Atouts">
              <ul className="mt-10 grid gap-6 sm:grid-cols-3">
                {(features?.items ?? []).slice(0, 3).map((f) => {
                  const Icon = iconFor(f.icon)
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
            </EditZone>
          </div>
        </section>
      </EditZone>

      <section id="planifier" aria-label="Planifier ma visite" className="scroll-mt-20 py-14 lg:py-16">
        <div className="container-site">
          <EditZone page={P} section="Services proposés">
            <VisitPlanner
              services={list}
              formTitle={plan?.text}
              practical={
                <EditZone page={P} section="Formulaire de visite">
                  <div className="grid gap-6 rounded-3xl bg-mist p-6 md:grid-cols-[1.2fr_1fr]">
                    <div>
                      <h2 className="flex items-center gap-2 text-xl font-extrabold text-navy-900">
                        <MapPin className="h-5 w-5 text-gold-500" aria-hidden="true" /> Informations pratiques
                      </h2>
                      <ul className="mt-5 space-y-4 text-sm">
                        {practical.map(({ icon: Icon, title, text }) => (
                          <li key={title} className="flex gap-3">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-navy-900" aria-hidden="true" />
                            <span>
                              <strong className="block text-navy-900">{title}</strong>
                              <span className="text-muted">{text}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                          <MapPin className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="text-sm">
                          <span className="block font-bold text-navy-900">{settings.name}</span>
                          <span className="text-muted">
                            {settings.address}
                            <br />
                            {settings.city} {settings.postalCode}
                          </span>
                        </span>
                      </div>
                      {settings.directionsUrl && (
                        <a
                          href={settings.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-navy-900/15 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-gold-400"
                        >
                          <Navigation className="h-4 w-4" aria-hidden="true" /> Voir sur Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </EditZone>
              }
              faq={
                <EditZone page={P} section="Questions fréquentes">
                  <div className="rounded-3xl bg-gold-400/10 p-6">
                    <h2 className="text-xl font-extrabold text-navy-900">
                      <Rich text={faq?.title} />
                    </h2>
                    <div className="mt-4">
                      <Faq items={(faq?.questions ?? []).slice(0, 4)} />
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                      <span className="flex items-center gap-3 text-sm">
                        <Headset className="h-6 w-6 text-navy-900" aria-hidden="true" />
                        <span>
                          <span className="block font-bold text-navy-900">Une question ?</span>
                          <span className="text-muted">Notre équipe est là pour vous aider.</span>
                        </span>
                      </span>
                      <ButtonLink href="/contact#ecrire" variant="outline-dark">
                        <Mail className="h-4 w-4" aria-hidden="true" /> Nous contacter
                      </ButtonLink>
                    </div>
                  </div>
                </EditZone>
              }
            />
          </EditZone>
        </div>
      </section>

      {/* Déroulement d’un culte */}
      <EditZone page={P} section="À quoi s’attendre">
        <section id="deroulement" aria-labelledby="deroulement-title" className="scroll-mt-20 bg-mist py-20">
          <div className="container-site grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <SectionHead id="deroulement-title" eyebrow={expect?.eyebrow} title={<Rich text={expect?.title} />} text={expect?.text} />
              <ol className="relative mt-10 space-y-6 border-l-2 border-gold-400/40 pl-8">
                {steps.map((step, i) => {
                  const Icon = iconFor(step.icon)
                  return (
                    <li key={step.id ?? i} className="relative">
                      <span className="absolute top-0 -left-[3.1rem] flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-navy-900 ring-4 ring-mist">
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
            <Photo media={asMedia(expect?.image)} placeholder="Photo d’un culte à venir" className="aspect-[4/5] w-full rounded-3xl" sizes="(min-width:1024px) 45vw, 100vw" />
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
