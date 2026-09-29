import type { Metadata } from 'next'
import { ArrowRight, Heart, PlayCircle, Sprout, Target, Users, UsersRound, HeartHandshake } from 'lucide-react'

import { CtaBand, FeatureStrip, Glow, Gold, IconRing, PageHero, QuoteCard, SectionHead, TextLink } from '@/components/pages/blocks'
import { MinistryGrid } from '@/components/pages/MinistryGrid'
import { Photo } from '@/components/site/Photo'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getAllMinistries, getPagesContent, getUpcomingEvents } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ministères',
  description: 'Nos ministères : des espaces où chacun peut grandir, servir et faire une différence.',
}

const TZ = 'America/Toronto'

export default async function MinisteresPage() {
  const [pages, ministries, events] = await Promise.all([getPagesContent(), getAllMinistries(), getUpcomingEvents(3)])
  const content = pages.ministeres!
  const spotlight = ministries.find((m) => /jeun/i.test(m.name)) ?? ministries[0]

  return (
    <>
      <PageHero
        id="ministeres-title"
        eyebrow="Ministères"
        title={
          <>
            Des talents au service <br />
            <Gold>du Royaume.</Gold>
          </>
        }
        text="Nos ministères sont des espaces où chacun peut grandir, servir et faire une différence. Découvrez comment vous pouvez vous impliquer et utiliser vos dons pour l’édification de notre communauté et l’avancement de l’Évangile."
        image={asMedia(content.heroImage)}
        placeholder="Photo de la louange à venir"
        actions={
          <>
            <ButtonLink href="#liste">
              Découvrir nos ministères <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#servir" variant="outline-light">
              <PlayCircle className="h-5 w-5" aria-hidden="true" /> Commencer à servir
            </ButtonLink>
          </>
        }
        aside={
          <QuoteCard
            text="Chacun selon le don qu’il a reçu, mettez-le au service des autres, comme de bons gestionnaires de la grâce de Dieu."
            source="1 Pierre 4:10"
          />
        }
      />

      <FeatureStrip
        items={[
          { icon: Users, title: 'Une diversité de dons', text: 'Chaque personne a une place et un rôle à jouer.' },
          { icon: Heart, title: 'Un même objectif', text: 'Servir Dieu, servir les gens et impacter notre communauté.' },
          { icon: Sprout, title: 'Une formation continue', text: 'Nous accompagnons et formons les serviteurs.' },
          { icon: HeartHandshake, title: 'Une communauté engagée', text: 'Grandir ensemble pour un plus grand impact.' },
        ]}
      />

      <section id="liste" aria-labelledby="liste-title" className="scroll-mt-24 py-20 lg:py-24">
        <div className="container-site">
          <SectionHead
            id="liste-title"
            eyebrow="Nos ministères"
            title="Découvrez nos ministères."
            text="Cliquez sur un ministère pour en savoir plus et découvrir comment vous impliquer."
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

      {/* S’impliquer */}
      <section id="servir" aria-labelledby="servir-title" className="relative isolate scroll-mt-20 overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 -z-20">
          <Photo media={asMedia(content.serveImage)} alt="" placeholder="" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/60" />
        </div>
        <Glow />
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              light
              id="servir-title"
              eyebrow="S’impliquer"
              title="Vous avez un don. Il y a une place pour vous."
              text="Quel que soit votre âge, votre expérience ou vos talents, vous pouvez vous impliquer dans l’un de nos ministères et contribuer à l’œuvre de Dieu."
            />
            <ButtonLink href="/contact" className="mt-8">
              Commencer à servir <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ul className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <IconRing icon={Heart} label={'Découvrez\nvos dons'} />
            <IconRing icon={UsersRound} label={'Trouvez\nvotre place'} />
            <IconRing icon={Sprout} label={'Grandissez\ndans le service'} />
            <IconRing icon={Target} label={'Faites\nune différence'} />
          </ul>
        </div>
      </section>

      {/* À la une */}
      {spotlight && (
        <section aria-labelledby="une-title" className="bg-mist py-20">
          <div className="container-site grid items-stretch gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div className="flex flex-col justify-center">
              <SectionHead
                id="une-title"
                eyebrow="À la une"
                title={`Ministère : ${spotlight.name}`}
                text={spotlight.summary || 'Découvrez ce ministère, ses activités et comment vous y impliquer.'}
              />
              <ButtonLink href={`/ministeres/${spotlight.slug}`} className="mt-8 self-start">
                En savoir plus <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
            <div className="grid overflow-hidden rounded-3xl bg-navy-950 text-white shadow-2xl sm:grid-cols-[1.3fr_1fr]">
              <Photo media={asMedia(spotlight.image)} placeholder="Photo à venir" className="min-h-64" sizes="(min-width:1024px) 35vw, 100vw" />
              <div className="p-6">
                <p className="font-bold">Prochaines activités</p>
                {events.length === 0 ? (
                  <p className="mt-4 text-sm text-white/60">Les prochaines activités seront annoncées bientôt.</p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {events.map((e) => {
                      const d = new Date(e.startsAt)
                      const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-CA', { timeZone: TZ, ...o }).format(d)
                      return (
                        <li key={e.id} className="flex gap-3">
                          <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-white/20 leading-none">
                            <span className="text-lg font-extrabold">{fmt({ day: '2-digit' })}</span>
                            <span className="text-[10px] uppercase">{fmt({ month: 'short' }).replace('.', '')}</span>
                          </span>
                          <span className="text-sm">
                            <span className="block font-semibold">{e.title}</span>
                            <span className="text-white/60">
                              {e.timeToConfirm ? 'Heure à confirmer' : fmt({ hour: '2-digit', minute: '2-digit' })}
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
      )}

      <CtaBand
        id="rejoindre-title"
        eyebrow="Ensemble pour un plus grand impact"
        title="Rejoignez un ministère aujourd’hui."
        text="Servir, c’est faire partie de quelque chose de plus grand."
        actions={
          <ButtonLink href="/contact">
            M’impliquer maintenant <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        }
      />
    </>
  )
}
