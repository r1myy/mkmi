import type { Metadata } from 'next'
import { ArrowRight, Gift, Globe2, HandHeart, Heart, MapPin, Plane, PlayCircle, Sprout, Users } from 'lucide-react'

import { CtaBand, FeatureStrip, Glow, Gold, PageHero, QuoteCard, SectionHead } from '@/components/pages/blocks'
import { Photo } from '@/components/site/Photo'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getHomePage, getMissions, getPagesContent, getTestimonials } from '@/lib/content'
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

const ways = [
  { icon: HandHeart, title: 'Prier', text: 'Soutenez nos missions dans la prière.', href: '/priere', tone: 'bg-rose-50 text-rose-500' },
  { icon: Gift, title: 'Donner', text: 'Contribuez aux projets en cours.', href: '/donner', tone: 'bg-amber-50 text-gold-500' },
  { icon: Users, title: 'Servir', text: 'Impliquez-vous selon vos dons.', href: '/servir', tone: 'bg-emerald-50 text-emerald-600' },
  { icon: Plane, title: 'Aller', text: 'Participez à un voyage missionnaire.', href: '/contact', tone: 'bg-blue-50 text-blue-600' },
]

export default async function MissionsPage() {
  const [pages, home, missions, testimonials] = await Promise.all([
    getPagesContent(),
    getHomePage(),
    getMissions(),
    getTestimonials(3),
  ])
  const content = pages.missions!
  const zones = home.missions?.zones ?? []

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Missions', path: '/missions' }])} />
      <PageHero
        id="missions-title"
        eyebrow="Missions"
        title={
          <>
            L’Évangile <br />
            <Gold>sans frontières.</Gold>
          </>
        }
        text="Nous croyons qu’une église locale fait partie d’une vision plus grande. Ensemble, nous soutenons des initiatives qui transforment des vies au Québec, au Canada et dans le monde."
        image={asMedia(content.heroImage)}
        placeholder="Photo de mission à venir"
        actions={
          <>
            <ButtonLink href="#champs">
              Découvrir nos missions <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#impliquer" variant="outline-light">
              <PlayCircle className="h-5 w-5" aria-hidden="true" /> M’impliquer
            </ButtonLink>
          </>
        }
      />

      <FeatureStrip
        items={[
          { icon: Globe2, title: 'Partager l’Évangile', text: 'Annoncer la bonne nouvelle dans des contextes variés.' },
          { icon: Users, title: 'Former et équiper', text: 'Développer des leaders et des disciples.' },
          { icon: Heart, title: 'Soutenir les communautés', text: 'Apporter une aide concrète et durable.' },
          { icon: Sprout, title: 'Impacter notre génération', text: 'Bâtir un avenir d’espérance par des actions concrètes.' },
        ]}
      />

      {/* Vision */}
      <section aria-labelledby="vision-title" className="py-20 lg:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <SectionHead
            id="vision-title"
            eyebrow="Notre vision"
            title="Une Église en mouvement pour un monde transformé."
            text="MKMI Québec s’inscrit dans le réseau international MKMI et soutient des initiatives missionnaires locales et internationales. Nous croyons que l’Évangile transforme les individus, les familles, les communautés et les nations."
          />
          <div className="relative overflow-hidden rounded-3xl">
            <Photo media={asMedia(content.visionImage)} placeholder="Photo à venir" className="aspect-[16/10] w-full" sizes="(min-width:1024px) 50vw, 100vw" />
            <QuoteCard
              className="absolute right-4 bottom-4 left-4 sm:left-auto sm:max-w-xs"
              text="Allez par tout le monde et prêchez la bonne nouvelle à toute la création."
              source="Marc 16:15"
            />
          </div>
        </div>
      </section>

      {/* Champs d’action */}
      <section id="champs" aria-labelledby="champs-title" className="scroll-mt-20 bg-mist py-20">
        <div className="container-site">
          <SectionHead id="champs-title" eyebrow="Nos champs d’action" title="Des missions ici et ailleurs." />
          {missions.length > 0 ? (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {missions.map((m) => {
                const image = (m.images ?? []).map(asMedia).find(Boolean) ?? null
                return (
                  <li key={m.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)]">
                    <Photo media={image} tone="light" placeholder="" className="aspect-[16/9] w-full" sizes="(min-width:1024px) 33vw, 50vw" />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-navy-900 uppercase">
                          <MapPin className="h-4 w-4 text-gold-500" aria-hidden="true" /> {m.zone}
                        </p>
                        {m.status && (
                          <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-muted">{status[m.status]}</span>
                        )}
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-navy-900">{m.project}</h3>
                      {m.description && <p className="mt-2 text-sm text-muted">{m.description}</p>}
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
                  <Globe2 aria-hidden="true" className="absolute -top-6 -right-6 h-28 w-28 text-white/5" />
                  <MapPin className="h-5 w-5 text-gold-400" aria-hidden="true" />
                  <p className="mt-2 font-display text-lg font-extrabold">{z.name}</p>
                  <p className="text-xs text-white/60">Projets à venir</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Présence : seulement quand des projets sont publiés, sinon les zones figurent déjà plus haut. */}
      {missions.length > 0 && (
      <section aria-labelledby="presence-title" className="relative isolate overflow-hidden bg-navy-950 py-20 text-white">
        <Glow />
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              light
              id="presence-title"
              eyebrow="Notre empreinte"
              title="Une présence qui fait la différence."
              text="À travers nos partenaires et nos initiatives, nous contribuons à l’avancement de l’Évangile dans plusieurs régions du monde."
            />
          </div>
          <ul className="flex flex-wrap gap-3">
            {zones.map((z, i) => (
              <li key={z.id ?? i} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_12px_2px_rgba(245,191,79,.6)]" aria-hidden="true" />
                {z.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* S’impliquer */}
      <section id="impliquer" aria-labelledby="impliquer-title" className="scroll-mt-20 py-20 lg:py-24">
        <div className="container-site grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHead
            id="impliquer-title"
            eyebrow="Comment vous impliquer ?"
            title="Faites partie de la mission."
            text="Il existe plusieurs façons de contribuer et de faire une différence dans l’avancement de l’Évangile."
          />
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {ways.map(({ icon: Icon, title, text, href, tone }) => (
              <li key={title}>
                <a
                  href={href}
                  className="group flex h-full flex-col items-center rounded-2xl border border-navy-900/5 bg-white p-5 text-center shadow-[0_14px_40px_-28px_rgba(11,22,40,.5)] transition-transform hover:-translate-y-1"
                >
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-4 font-bold text-navy-900">{title}</span>
                  <span className="mt-1 text-xs text-muted">{text}</span>
                  <ArrowRight className="mt-4 h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Témoignages */}
      {testimonials.length > 0 && (
        <section aria-labelledby="temoignages-title" className="bg-mist py-20">
          <div className="container-site">
            <SectionHead id="temoignages-title" eyebrow="Témoignages" title="Des vies transformées." />
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
      )}

      <CtaBand
        id="soutenir-title"
        eyebrow="Ensemble pour plus d’impact"
        title="Soutenons la mission."
        text="Votre générosité et votre engagement permettent de transformer des vies et d’étendre l’Évangile plus loin."
        actions={
          <>
            <ButtonLink href="/donner">
              Faire un don <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              En savoir plus <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
