import type { Metadata } from 'next'
import { ArrowRight, BookOpen, Compass, Dna, Gem, Globe2, Heart, Megaphone, PlayCircle, Users } from 'lucide-react'

import { CtaBand, Glow, Gold, PageHero, QuoteCard, SectionHead } from '@/components/pages/blocks'
import { Photo } from '@/components/site/Photo'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getHomePage, getPagesContent } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Découvrir MKMI Québec',
  description: 'Qui sommes-nous ? Notre mission, notre vision, nos valeurs, notre histoire et notre équipe.',
}

const pillars = [
  { icon: Megaphone, title: 'Notre mission', text: 'Annoncer l’Évangile, faire des disciples et impacter notre génération.' },
  { icon: Compass, title: 'Notre vision', text: 'Voir des vies transformées, des familles restaurées et des communautés impactées.' },
  { icon: Gem, title: 'Nos valeurs', text: 'Amour, excellence, intégrité, service et unité.' },
  { icon: Dna, title: 'Notre ADN', text: 'Évangéliser, enseigner, vivre la communion et servir avec excellence.' },
]

export default async function DecouvrirPage() {
  const [pages, home] = await Promise.all([getPagesContent(), getHomePage()])
  const content = pages.decouvrir!
  const zones = home.missions?.zones ?? []

  return (
    <>
      <PageHero
        id="decouvrir-title"
        eyebrow="Découvrir MKMI Québec"
        title={
          <>
            Une histoire <br />
            <Gold>plus grande</Gold> <br />
            que nous.
          </>
        }
        text="Une communauté chrétienne passionnée par Jésus, engagée à voir des vies transformées, des familles restaurées et notre génération impactée."
        image={asMedia(content.heroImage)}
        placeholder="Photo ou vidéo à venir"
        actions={
          <>
            <ButtonLink href="#vision">
              Notre vision <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/eglise" variant="outline-light">
              <PlayCircle className="h-5 w-5" aria-hidden="true" /> Notre église
            </ButtonLink>
          </>
        }
      />

      {/* Qui sommes-nous */}
      <section aria-labelledby="qui-title" className="py-20 lg:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              id="qui-title"
              eyebrow="Qui sommes-nous ?"
              title="Une famille pour tous les peuples."
              text="MKMI Québec fait partie du réseau international Messianic Kingdom Miracles International. Nous sommes une église locale, multiculturelle et intergénérationnelle, unie par la foi en Jésus-Christ et animée par la mission d’annoncer l’Évangile, de former des disciples et de servir notre communauté."
            />
            <ul className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: 'Une communauté multiculturelle' },
                { icon: Heart, label: 'Centrée sur Christ' },
                { icon: Globe2, label: 'Engagée pour notre ville et au-delà' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="rounded-2xl bg-mist p-4">
                  <Icon className="h-7 w-7 text-navy-900" aria-hidden="true" />
                  <p className="mt-3 text-xs font-bold text-navy-900">{label}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <Photo
              media={asMedia(content.storyImage)}
              placeholder="Photo de la communauté à venir"
              className="aspect-[5/4] w-full rounded-3xl"
              sizes="(min-width:1024px) 50vw, 100vw"
            />
            <figure className="absolute right-4 -bottom-8 max-w-[260px] rounded-2xl bg-white p-5 shadow-2xl sm:right-8">
              <p className="font-display text-3xl leading-none text-gold-400" aria-hidden="true">
                “
              </p>
              <blockquote className="text-sm text-navy-900">
                « Ici, nous avons trouvé une famille, des amis et un lieu où notre foi grandit. »
              </blockquote>
              <figcaption className="mt-3 text-xs text-muted">— Membre de MKMI Québec</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Mission, vision, valeurs, ADN */}
      <section aria-label="Mission, vision, valeurs et ADN" className="pb-20">
        <ul className="container-site grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="group relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl bg-navy-900 p-6 text-white"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_80%_0%,rgba(245,191,79,.28),transparent_60%)] transition-opacity duration-500 group-hover:opacity-70"
              />
              <span aria-hidden="true" className="absolute top-4 right-5 font-display text-6xl font-extrabold text-white/5">
                0{i + 1}
              </span>
              <Icon className="h-9 w-9 text-gold-400" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-extrabold">{title}</h2>
              <p className="mt-2 text-sm text-white/75">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Notre histoire */}
      <section aria-labelledby="histoire-title" className="bg-mist py-20">
        <div className="container-site">
          <SectionHead
            id="histoire-title"
            eyebrow="Notre histoire"
            title="Un appel qui porte du fruit."
            text="Depuis ses débuts, MKMI est animé par une vision simple : voir le Royaume de Dieu se manifester par des vies transformées à travers le monde. Aujourd’hui, MKMI Québec poursuit cette vision dans notre ville, en lien avec la famille internationale."
          />
          <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <span aria-hidden="true" className="absolute top-3 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-gold-400 via-gold-400/60 to-gold-400/10 lg:block" />
            {(content.timeline ?? []).map((step, i) => (
              <li key={step.id ?? i} className="relative">
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 ring-4 ring-gold-400/25">
                  <span className="h-2 w-2 rounded-full bg-navy-900" />
                </span>
                <p className="mt-5 font-display text-lg font-extrabold text-navy-900">{step.label}</p>
                <p className="text-sm font-semibold text-navy-900">{step.title}</p>
                {step.text && <p className="mt-1 text-sm text-muted">{step.text}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" aria-labelledby="vision-title" className="relative isolate scroll-mt-20 overflow-hidden bg-navy-950 py-24 text-white">
        <Glow />
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <SectionHead
              light
              id="vision-title"
              eyebrow="Notre vision"
              title="Bâtir des vies qui font la différence."
              text="Nous croyons qu’une église est plus qu’un bâtiment. C’est une famille qui grandit ensemble, qui vit l’amour de Dieu et qui impacte son environnement."
            />
            <ButtonLink href="/eglise" className="mt-8">
              Découvrir notre église <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <QuoteCard text="Une génération transformée pour transformer son monde." source="Vision de MKMI" />
        </div>
      </section>

      {/* Leadership */}
      <section aria-labelledby="equipe-title" className="py-20 lg:py-24">
        <div className="container-site">
          <SectionHead
            id="equipe-title"
            eyebrow="Notre leadership"
            title="Une équipe au service de la vision."
            text="Nos pasteurs et leaders servent avec un cœur passionné pour Dieu et pour les personnes. Ils accompagnent notre communauté dans la croissance spirituelle et dans la réalisation de la mission de MKMI Québec."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(content.leaders ?? []).map((leader, i) => (
              <li key={leader.id ?? i} className="group overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)]">
                <Photo
                  media={asMedia(leader.photo)}
                  tone="light"
                  placeholder="Photo à venir"
                  className="aspect-[4/4.2] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width:1024px) 25vw, 50vw"
                />
                <div className="border-t-4 border-gold-400 p-5">
                  <h3 className="font-bold text-navy-900">{leader.name}</h3>
                  <p className="text-sm text-muted">{leader.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Notre foi */}
      <section aria-labelledby="foi-title" className="grid bg-navy-900 text-white lg:grid-cols-2">
        <Photo
          media={asMedia(content.faithImage)}
          placeholder="Photo de la Bible à venir"
          className="min-h-72 lg:min-h-[420px]"
          sizes="(min-width:1024px) 50vw, 100vw"
        />
        <div className="flex items-center px-4 py-16 sm:px-8 lg:px-14">
          <div className="max-w-lg">
            <SectionHead
              light
              id="foi-title"
              eyebrow="Notre foi"
              title="Une foi enracinée dans la Parole."
              text="Nous croyons en la Bible comme la Parole inspirée de Dieu, en Jésus-Christ comme Seigneur et Sauveur, en l’œuvre du Saint-Esprit et en la puissance de la prière. Notre foi se traduit par une vie transformée et un service actif."
            />
            <ButtonLink href="/decouvrir/foi" className="mt-8">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Découvrir la foi
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Réseau international */}
      <section aria-labelledby="reseau-title" className="py-20 lg:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              id="reseau-title"
              eyebrow="Notre famille internationale"
              title="Un réseau, une même mission."
              text="MKMI est présent dans plusieurs pays à travers le monde. Ensemble, nous partageons la même vision : voir le Royaume de Dieu se manifester et impacter les nations."
            />
            <ButtonLink href="/missions" className="mt-8">
              Découvrir nos missions <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="relative isolate overflow-hidden rounded-3xl bg-navy-950 p-8">
            <Glow />
            <Globe2 aria-hidden="true" className="absolute -right-16 -bottom-16 h-72 w-72 text-white/5" strokeWidth={0.75} />
            <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">Où nous sommes engagés</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {zones.map((z, i) => (
                <li
                  key={z.id ?? i}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                >
                  <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_12px_2px_rgba(245,191,79,.6)]" aria-hidden="true" />
                  {z.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        id="questions-title"
        eyebrow="Vous avez des questions ?"
        title="Nous sommes là pour vous."
        text="Contactez-nous ou venez nous rencontrer lors de notre prochain culte."
        actions={
          <>
            <ButtonLink href="/planifier-ma-visite">
              Planifier ma visite <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Nous contacter <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
