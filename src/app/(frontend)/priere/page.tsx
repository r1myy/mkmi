import type { Metadata } from 'next'
import { ArrowRight, CalendarClock, Phone, PlayCircle, Radio, Users } from 'lucide-react'
import { siWhatsapp } from 'simple-icons'

import {
  CtaBand,
  FeatureStrip,
  Glow,
  PageHero,
  QuoteCard,
  SectionHead,
  toFeatures,
} from '@/components/pages/blocks'
import { PrayerForm } from '@/components/pages/forms'
import { EditZone } from '@/components/site/EditZone'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getPage, getSettings, getTestimonials } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Demande de prière',
  description:
    'Vous n’êtes pas seul. Envoyez votre demande de prière à l’équipe de MKMI Québec : nous prions pour vous, en toute confidentialité.',
  path: '/priere',
  eyebrow: 'Prière',
  ogTitle: 'Vous n’êtes pas seul. Nous prions avec vous.',
  keywords: ['demande de prière', 'prière Québec', 'soutien spirituel'],
})

const P = 'page-priere'

export default async function PrierePage() {
  const [page, settings, testimonials] = await Promise.all([
    getPage(P),
    getSettings(),
    getTestimonials(3),
  ])
  const {
    hero,
    features,
    request,
    others: othersSection,
    process,
    testimonials: testimonialsSection,
    cta,
  } = page
  const steps = process?.steps ?? []
  const phoneDigits = (settings.phone ?? '').replace(/\D/g, '').slice(-10)
  const hasPhone = phoneDigits.length === 10

  const others = [
    settings.whatsapp && {
      key: 'whatsapp',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d={siWhatsapp.path} />
        </svg>
      ),
      tone: 'bg-[#25D366]/15 text-[#128C7E]',
      title: 'Nous écrire sur WhatsApp',
      text: 'Réponse de notre équipe',
      href: settings.whatsapp,
    },
    hasPhone && {
      key: 'phone',
      icon: <Phone className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-blue-50 text-blue-600',
      title: 'Nous appeler',
      text: settings.phone,
      href: `tel:+1${phoneDigits}`,
    },
    {
      key: 'person',
      icon: <Users className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-gold-400/15 text-navy-900',
      title: 'Demander une prière en personne',
      text: 'Rencontrez notre équipe à l’église',
      href: '/planifier-ma-visite',
    },
    {
      key: 'events',
      icon: <CalendarClock className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-rose-50 text-rose-500',
      title: 'Participer à nos soirées de prière',
      text: 'Voir le calendrier',
      href: '/evenements',
    },
  ].filter((o): o is Exclude<typeof o, false | '' | null | undefined> => Boolean(o))

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Prière', path: '/priere' }])} />
      <EditZone page="page-priere" section="Haut de page">
        <PageHero
          id="priere-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo de prière à venir"
          actions={
            <>
              <ButtonLink href="#demande">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#fonctionnement" variant="outline-light">
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

      <EditZone page="page-priere" section="Atouts">
        <FeatureStrip items={toFeatures(features?.items)} />
      </EditZone>

      {/* Formulaire */}
      <EditZone page="page-priere" section="Demande de prière">
        <section
          id="demande"
          aria-labelledby="demande-title"
          className="scroll-mt-20 py-20 lg:py-24"
        >
          <div className="container-site grid gap-8 lg:grid-cols-[1fr_1.1fr_.9fr]">
            <div>
              <SectionHead
                id="demande-title"
                eyebrow={request?.eyebrow}
                title={<Rich text={request?.title} />}
                text={request?.text}
              />
              <div className="relative mt-8 overflow-hidden rounded-3xl">
                <Photo
                  media={asMedia(request?.image)}
                  placeholder=""
                  className="aspect-[4/3.4] w-full"
                  sizes="(min-width:1024px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                {request?.quoteText && (
                  <figure className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <blockquote className="text-lg font-semibold">
                      « {request.quoteText} »
                    </blockquote>
                    {request.quoteSource && (
                      <figcaption className="mt-2 text-sm text-white/70">
                        — {request.quoteSource}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
              <h2 className="mb-6 text-lg font-bold text-navy-900">{request?.formTitle}</h2>
              <PrayerForm />
            </div>

            <EditZone page="page-priere" section="Autres façons de prier">
              <div className="space-y-6">
                <div className="rounded-3xl bg-mist p-6">
                  <h2 className="font-display text-xl font-extrabold text-navy-900">
                    <Rich text={othersSection?.title} />
                  </h2>
                  <ul className="mt-5 divide-y divide-navy-900/10">
                    {others.map((o) => (
                      <li key={o.key}>
                        <a
                          href={o.href!}
                          {...(o.href!.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="group flex items-center gap-4 py-4"
                        >
                          <span
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${o.tone}`}
                          >
                            {o.icon}
                          </span>
                          <span className="text-sm">
                            <span className="block font-semibold text-navy-900 group-hover:underline">
                              {o.title}
                            </span>
                            <span className="text-muted">{o.text}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {settings.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative isolate block overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-navy-900 p-6 text-white"
                  >
                    <Radio className="h-8 w-8 text-gold-400" aria-hidden="true" />
                    <p className="mt-3 font-display text-xl font-extrabold">
                      Rejoignez nos moments de prière en ligne
                    </p>
                    <p className="mt-1 text-sm text-white/75">Sur notre chaîne YouTube.</p>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy-900">
                      Voir la chaîne <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </a>
                )}
              </div>
            </EditZone>
          </div>
        </section>
      </EditZone>

      {/* Processus */}
      <EditZone page="page-priere" section="Comment ça fonctionne">
        <section
          id="fonctionnement"
          aria-labelledby="processus-title"
          className="scroll-mt-20 bg-mist py-20"
        >
          <div className="container-site">
            <SectionHead
              id="processus-title"
              eyebrow={process?.eyebrow}
              title={<Rich text={process?.title} />}
            />
            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <li key={step.id ?? i} className="relative rounded-2xl bg-white p-6 shadow-sm">
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-11 -right-8 hidden h-0.5 w-8 bg-gold-400/60 lg:block"
                    />
                  )}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 font-display text-lg font-extrabold text-navy-900">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </EditZone>

      {/* Témoignages */}
      <EditZone page="page-priere" section="Témoignages">
        <section
          aria-labelledby="temoignages-title"
          className="relative isolate overflow-hidden bg-navy-950 py-20 text-white"
        >
          <Glow />
          <div className="container-site grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionHead
                light
                id="temoignages-title"
                eyebrow={testimonialsSection?.eyebrow}
                title={<Rich text={testimonialsSection?.title} />}
                text={testimonialsSection?.text}
              />
              <ButtonLink href="/temoignages#partager" className="mt-8">
                {testimonialsSection?.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
            {testimonials.length > 0 ? (
              <ul className="grid gap-4 md:grid-cols-3">
                {testimonials.map((t) => (
                  <li key={t.id} className="rounded-2xl bg-white p-5 text-navy-900">
                    <p
                      className="font-display text-3xl leading-none text-gold-400"
                      aria-hidden="true"
                    >
                      “
                    </p>
                    <p className="text-sm leading-relaxed">« {t.text} »</p>
                    <p className="mt-4 text-xs font-semibold text-muted">— {t.firstName}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-white/60">
                Les premiers témoignages seront publiés ici, avec l’accord de leurs auteurs.
              </p>
            )}
          </div>
        </section>
      </EditZone>

      <EditZone page="page-priere" section="Appel final">
        <CtaBand
          id="ensemble-title"
          eyebrow={cta?.eyebrow}
          title={<Rich text={cta?.title} />}
          text={cta?.text}
          image={asMedia(cta?.image)}
          actions={
            <ButtonLink href="/evenements">
              {cta?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          }
        />
      </EditZone>
    </>
  )
}
