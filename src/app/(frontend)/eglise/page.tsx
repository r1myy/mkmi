import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Baby,
  CalendarDays,
  Globe2,
  Heart,
  MapPin,
  MessageCircle,
  PlayCircle,
  Sprout,
  Users,
  UsersRound,
  Sparkles,
} from 'lucide-react'

import { CtaBand, Faq, FeatureStrip, Glow, Gold, IconRing, PageHero, SectionHead } from '@/components/pages/blocks'
import { Photo } from '@/components/site/Photo'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { asMedia, getPagesContent, getSettings } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
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

const groups = [
  { icon: UsersRound, title: 'Adultes', text: 'Un temps d’adoration, d’enseignement et de communion fraternelle.', href: '/ministeres' },
  { icon: Baby, title: 'Enfants', text: 'Un environnement sécuritaire et stimulant pour la prochaine génération.', href: '/ministeres' },
  { icon: Sparkles, title: 'Jeunesse', text: 'Une génération engagée pour impacter notre monde avec l’Évangile.', href: '/ministeres' },
  { icon: BookOpen, title: 'Groupes', text: 'Grandir ensemble à travers des groupes et des études bibliques.', href: '/ministeres' },
]

export default async function EglisePage() {
  const [pages, settings] = await Promise.all([getPagesContent(), getSettings()])
  const content = pages.eglise!
  const directions = settings.directionsUrl

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Notre église', path: '/eglise' }])} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (content.faq ?? []).map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        }}
      />
      <PageHero
        id="eglise-title"
        eyebrow="Notre église"
        title={
          <>
            Une maison <br />
            <Gold>pour tous.</Gold>
          </>
        }
        text="Une communauté vivante où nous adorons Dieu ensemble, grandissons dans sa Parole, vivons la communion fraternelle et servons notre génération."
        image={asMedia(content.heroImage)}
        placeholder="Photo du culte à venir"
        actions={
          <>
            <ButtonLink href="/planifier-ma-visite">
              Planifier ma visite <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/decouvrir" variant="outline-light">
              <PlayCircle className="h-5 w-5" aria-hidden="true" /> Découvrir MKMI
            </ButtonLink>
          </>
        }
      />

      <FeatureStrip
        items={[
          { icon: Users, title: 'Une communauté multiculturelle', text: 'Des personnes de tous horizons unies par une même foi.' },
          { icon: BookOpen, title: 'Centrée sur la Parole', text: 'Un enseignement biblique pertinent et pratique.' },
          { icon: Heart, title: 'Une église pour les familles', text: 'Un lieu où chaque génération a sa place.' },
          { icon: Globe2, title: 'Tournée vers notre génération', text: 'Vivre une foi qui impacte notre ville et au-delà.' },
        ]}
      />

      {/* À quoi s’attendre */}
      <section aria-labelledby="attendre-title" className="py-20 lg:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              id="attendre-title"
              eyebrow="À quoi s’attendre ?"
              title="Venez comme vous êtes, vous êtes les bienvenus."
              text="Que ce soit votre première visite ou que vous cherchiez une nouvelle église locale, nous vous accueillons avec joie. Découvrez à quoi vous attendre lors d’un de nos cultes et comment vous pouvez vous impliquer."
            />
            <ButtonLink href="#faq" variant="outline-dark" className="mt-8">
              Découvrir à quoi s’attendre <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 h-full w-full rounded-3xl border-2 border-gold-400/60" aria-hidden="true" />
            <Photo
              media={asMedia(content.welcomeImage)}
              placeholder="Photo d’accueil à venir"
              className="relative aspect-[4/3] w-full rounded-3xl"
              sizes="(min-width:1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Nos cultes */}
      <section aria-labelledby="cultes-title" className="relative isolate overflow-hidden bg-navy-950 py-14 text-white">
        <Glow />
        <div className="container-site grid items-center gap-8 lg:grid-cols-[1fr_1.4fr_auto]">
          <div>
            <Eyebrow light>Nos cultes</Eyebrow>
            <h2 id="cultes-title" className="text-3xl font-extrabold">
              Rejoignez-nous ce {settings.serviceDay?.toLowerCase()}
            </h2>
            <p className="mt-3 text-white/75">Un temps de louange, de prière et d’enseignement pour toute la famille.</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            <div className="flex gap-4 bg-navy-900/80 p-5">
              <CalendarDays className="h-8 w-8 shrink-0 text-gold-400" aria-hidden="true" />
              <div>
                <p className="font-bold">{settings.serviceDay}</p>
                <p className="text-lg font-extrabold">{settings.serviceTime}</p>
                <p className="text-sm text-white/60">Culte principal</p>
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
              Planifier ma visite <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Nous contacter <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Groupes */}
      <section aria-labelledby="groupes-title" className="bg-mist py-20">
        <div className="container-site">
          <SectionHead id="groupes-title" eyebrow="Pour chaque génération" title="Une place pour chacun." />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map(({ icon: Icon, title, text, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)] transition-transform hover:-translate-y-1"
                >
                  <Photo className="aspect-[16/10] w-full" tone="light" placeholder="" sizes="(min-width:1024px) 25vw, 50vw" />
                  <div className="relative flex flex-1 flex-col p-6 pt-9">
                    <span className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-md ring-4 ring-gold-400/30">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold text-navy-900">{title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{text}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                      En savoir plus
                      <ArrowRight className="h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Devenir membre */}
      <section aria-labelledby="membre-title" className="relative isolate overflow-hidden bg-navy-900 py-20 text-white">
        <div className="absolute inset-0 -z-20">
          <Photo media={asMedia(content.membershipImage)} alt="" placeholder="" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/60" />
        </div>
        <Glow />
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              light
              id="membre-title"
              eyebrow="Devenir membre"
              title="Une famille engagée pour aller plus loin."
              text="Explorez ce que signifie devenir membre, les engagements et les prochaines étapes."
            />
            <ButtonLink href="/contact" className="mt-8">
              En savoir plus sur la membership <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="grid grid-cols-3 gap-6">
            <IconRing icon={Users} label={'Grandir\ndans la foi'} />
            <IconRing icon={Sprout} label={'Servir\navec ses dons'} />
            <IconRing icon={Heart} label={'Faire partie\nde la famille'} />
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 py-20 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <SectionHead
              id="faq-title"
              eyebrow="Questions fréquentes"
              title="Tout ce que vous devez savoir avant votre première visite."
              text="Nous avons rassemblé les réponses aux questions les plus courantes pour vous aider à planifier votre visite en toute confiance."
            />
            <ButtonLink href="/contact" variant="outline-dark" className="mt-8">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Poser une autre question
            </ButtonLink>
          </div>
          <Faq items={content.faq ?? []} />
        </div>
      </section>

      <CtaBand
        id="impact-title"
        eyebrow="Une église dans sa ville"
        title="Ensemble pour un plus grand impact."
        text="Nous croyons qu’une église locale doit être une lumière dans sa ville, au service des gens et engagée dans sa communauté."
        actions={
          <ButtonLink href="/missions">
            Découvrir nos initiatives <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        }
      />
    </>
  )
}
