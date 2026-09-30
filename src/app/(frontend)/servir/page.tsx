import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, HandHeart } from 'lucide-react'

import { CtaBand, FeatureStrip, PageHero, SectionHead, toFeatures } from '@/components/pages/blocks'
import { VolunteerForm } from '@/components/pages/forms'
import { EditZone } from '@/components/site/EditZone'
import { ministryIcons } from '@/components/site/ministryIcons'
import { Photo } from '@/components/site/Photo'
import { Rich } from '@/components/site/Rich'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getAllMinistries, getPage } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Servir',
  description:
    'Accueil, louange, enfants, jeunesse, prière, entraide : découvrez comment servir à MKMI Québec et rejoignez une équipe de bénévoles.',
  path: '/servir',
  eyebrow: 'Servir',
  ogTitle: 'Vos dons peuvent faire la différence.',
  keywords: ['bénévolat église Québec', 'servir église', 'ministères MKMI'],
})

const P = 'page-servir'

export default async function ServirPage() {
  const [page, ministries] = await Promise.all([getPage(P), getAllMinistries()])
  const { hero, features, where, process, form, cta } = page
  const steps = process?.steps ?? []

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Servir', path: '/servir' }])} />
      <EditZone page={P} section="Haut de page">
        <PageHero
          id="servir-title"
          eyebrow={hero?.eyebrow}
          title={<Rich text={hero?.title} />}
          text={hero?.text}
          image={asMedia(hero?.image)}
          placeholder="Photo de bénévoles à venir"
          actions={
            <>
              <ButtonLink href="#m-impliquer">
                <HandHeart className="h-4 w-4" aria-hidden="true" /> {hero?.primary}
              </ButtonLink>
              <ButtonLink href="#ou-servir" variant="outline-light">
                {hero?.secondary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </>
          }
        />
      </EditZone>

      <EditZone page={P} section="Atouts">
        <FeatureStrip items={toFeatures(features?.items)} />
      </EditZone>

      <EditZone page={P} section="Où servir">
        <section id="ou-servir" aria-labelledby="ou-servir-title" className="scroll-mt-20 py-20">
          <div className="container-site">
            <SectionHead id="ou-servir-title" eyebrow={where?.eyebrow} title={<Rich text={where?.title} />} text={where?.text} />
            {ministries.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-navy-900/20 p-10 text-center text-muted">Les équipes seront présentées ici prochainement.</p>
            ) : (
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {ministries.map((m) => {
                  const Icon = ministryIcons[(m.icon ?? 'users') as keyof typeof ministryIcons] ?? ministryIcons.users
                  return (
                    <li key={m.id}>
                      <Link href={`/ministeres/${m.slug ?? m.id}`} className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy-900/5 hover:ring-gold-400">
                        <Photo media={asMedia(m.image)} alt="" placeholder="" className="aspect-[16/9] w-full" sizes="(min-width:1024px) 25vw, 50vw" />
                        <span className="block p-5">
                          <span className="flex items-center gap-2 font-bold text-navy-900">
                            <Icon className="h-5 w-5 text-gold-500" aria-hidden="true" /> {m.name}
                          </span>
                          {m.summary && <span className="mt-2 line-clamp-2 block text-sm text-muted">{m.summary}</span>}
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 group-hover:underline">
                            Découvrir <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Comment ça fonctionne">
        <section aria-labelledby="etapes-title" className="bg-mist py-20">
          <div className="container-site">
            <SectionHead id="etapes-title" eyebrow={process?.eyebrow} title={<Rich text={process?.title} />} />
            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <li key={step.id ?? i} className="rounded-2xl bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 font-display text-lg font-extrabold text-navy-900">{i + 1}</span>
                  <h3 className="mt-4 text-lg font-bold text-navy-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Formulaire">
        <section id="m-impliquer" aria-labelledby="impliquer-title" className="scroll-mt-20 py-20">
          <div className="container-site grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <SectionHead id="impliquer-title" className="self-start" eyebrow={form?.eyebrow} title={<Rich text={form?.title} />} text={form?.text} />
            <div className="rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
              <VolunteerForm teams={ministries.map((m) => m.name)} />
            </div>
          </div>
        </section>
      </EditZone>

      <EditZone page={P} section="Appel final">
        <CtaBand
          id="servir-cta-title"
          eyebrow={cta?.eyebrow}
          title={<Rich text={cta?.title} />}
          text={cta?.text}
          image={asMedia(cta?.image)}
          actions={
            <>
              <ButtonLink href="/contact#ecrire">
                {cta?.primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/ministeres" variant="outline-light">
                {cta?.secondary}
              </ButtonLink>
            </>
          }
        />
      </EditZone>
    </>
  )
}
