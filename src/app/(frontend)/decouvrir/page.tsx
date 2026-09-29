import type { Metadata } from 'next'
import { ArrowRight, BookOpen, Globe2, PlayCircle } from 'lucide-react'

import { CtaBand, Glow, PageHero, QuoteCard, SectionHead } from '@/components/pages/blocks'
import { EditZone } from '@/components/site/EditZone'
import { iconFor } from '@/components/site/icons'
import { JsonLd } from '@/components/site/JsonLd'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getHomePage, getPage } from '@/lib/content'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Découvrir MKMI Québec',
  description:
    'Qui sommes-nous ? La mission, la vision, les valeurs, l’histoire et l’équipe de MKMI Québec, membre du réseau international Messianic Kingdom Miracles International.',
  path: '/decouvrir',
  eyebrow: 'Qui sommes-nous',
  ogTitle: 'Une histoire plus grande que nous.',
  keywords: ['Messianic Kingdom Miracles International', 'église multiculturelle Québec'],
})

const P = 'page-decouvrir'

export default async function DecouvrirPage() {
  const [page, home] = await Promise.all([getPage(P), getHomePage()])
  const { hero, about, pillars, story, vision, team, faith, network, cta } = page
  const zones = home.missions?.zones ?? []

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Qui sommes-nous', path: '/decouvrir' }])} />

      <EditZone page={P} section="Haut de page">
        <PageHero
          id="decouvrir-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo ou vidéo à venir"
          actions={
            <>
              <ButtonLink href="#vision">
                {hero?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/eglise" variant="outline-light">
                <PlayCircle className="h-5 w-5" aria-hidden="true" /> {hero?.secondary}
              </ButtonLink>
            </>
          }
        />
      </EditZone>

      <EditZone page={P} section="Qui sommes-nous">
        <section aria-labelledby="qui-title" className="py-20 lg:py-24">
          <div className="container-site grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead id="qui-title" eyebrow={about?.eyebrow} title={<Rich text={about?.title} />} text={about?.text} />
              <ul className="mt-8 grid grid-cols-3 gap-4">
                {(about?.highlights ?? []).map((h, i) => {
                  const Icon = iconFor(h.icon)
                  return (
                    <li key={h.id ?? i} className="rounded-2xl bg-mist p-4">
                      <Icon className="h-7 w-7 text-navy-900" aria-hidden="true" />
                      <p className="mt-3 text-xs font-bold text-navy-900">{h.title}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="relative">
              <Photo
                media={asMedia(about?.image)}
                placeholder="Photo de la communauté à venir"
                className="aspect-[5/4] w-full rounded-3xl"
                sizes="(min-width:1024px) 50vw, 100vw"
              />
              {about?.quoteText && (
                <figure className="absolute right-4 -bottom-8 max-w-[260px] rounded-2xl bg-white p-5 shadow-2xl sm:right-8">
                  <p className="font-display text-3xl leading-none text-gold-400" aria-hidden="true">
                    “
                  </p>
                  <blockquote className="text-sm text-navy-900">« {about.quoteText} »</blockquote>
                  {about.quoteSource && <figcaption className="mt-3 text-xs text-muted">— {about.quoteSource}</figcaption>}
                </figure>
              )}
            </div>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Mission, vision, valeurs">
        <section aria-label="Mission, vision, valeurs et ADN" className="pb-20">
          <ul className="container-site grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(pillars?.items ?? []).map((item, i) => {
              const Icon = iconFor(item.icon)
              return (
                <li
                  key={item.id ?? i}
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
                  <h2 className="mt-4 text-xl font-extrabold">{item.title}</h2>
                  <p className="mt-2 text-sm text-white/75">{item.text}</p>
                </li>
              )
            })}
          </ul>
        </section>
      </EditZone>

      <EditZone page={P} section="Notre histoire">
        <section aria-labelledby="histoire-title" className="bg-mist py-20">
          <div className="container-site">
            <SectionHead id="histoire-title" eyebrow={story?.eyebrow} title={<Rich text={story?.title} />} text={story?.text} />
            <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <span aria-hidden="true" className="absolute top-3 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-gold-400 via-gold-400/60 to-gold-400/10 lg:block" />
              {(story?.timeline ?? []).map((step, i) => (
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
      </EditZone>

      <EditZone page={P} section="Notre vision">
        <section id="vision" aria-labelledby="vision-title" className="relative isolate scroll-mt-20 overflow-hidden bg-navy-950 py-24 text-white">
          <Glow />
          <div className="container-site grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <SectionHead light id="vision-title" eyebrow={vision?.eyebrow} title={<Rich text={vision?.title} />} text={vision?.text} />
              <ButtonLink href="/eglise" className="mt-8">
                {vision?.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
            <QuoteCard text={vision?.quoteText} source={vision?.quoteSource} />
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Notre équipe">
        <section aria-labelledby="equipe-title" className="py-20 lg:py-24">
          <div className="container-site">
            <SectionHead id="equipe-title" eyebrow={team?.eyebrow} title={<Rich text={team?.title} />} text={team?.text} />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(team?.leaders ?? []).map((leader, i) => (
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
      </EditZone>

      <EditZone page={P} section="Notre foi">
        <section aria-labelledby="foi-title" className="grid bg-navy-900 text-white lg:grid-cols-2">
          <Photo
            media={asMedia(faith?.image)}
            placeholder="Photo de la Bible à venir"
            className="min-h-72 lg:min-h-[420px]"
            sizes="(min-width:1024px) 50vw, 100vw"
          />
          <div className="flex items-center px-4 py-16 sm:px-8 lg:px-14">
            <div className="max-w-lg">
              <SectionHead light id="foi-title" eyebrow={faith?.eyebrow} title={<Rich text={faith?.title} />} text={faith?.text} />
              <ButtonLink href="/decouvrir/foi" className="mt-8">
                <BookOpen className="h-4 w-4" aria-hidden="true" /> {faith?.button}
              </ButtonLink>
            </div>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Réseau international">
        <section aria-labelledby="reseau-title" className="py-20 lg:py-24">
          <div className="container-site grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHead id="reseau-title" eyebrow={network?.eyebrow} title={<Rich text={network?.title} />} text={network?.text} />
              <ButtonLink href="/missions" className="mt-8">
                {network?.button} <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
      </EditZone>

      <EditZone page={P} section="Appel final">
        <CtaBand
          id="questions-title"
          eyebrow={cta?.eyebrow}
          title={<Rich text={cta?.title} />}
          text={cta?.text}
          image={asMedia(cta?.image)}
          actions={
            <>
              <ButtonLink href="/planifier-ma-visite">
                {cta?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              {cta?.secondary && (
                <ButtonLink href="/contact" variant="outline-light">
                  {cta.secondary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              )}
            </>
          }
        />
      </EditZone>
    </>
  )
}
