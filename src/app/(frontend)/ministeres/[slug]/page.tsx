import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, ArrowRight, CalendarClock, UserRound, Users } from 'lucide-react'

import { Glow } from '@/components/pages/blocks'
import { ministryIcons } from '@/components/site/ministryIcons'
import { Photo } from '@/components/site/Photo'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { JsonLd } from '@/components/site/JsonLd'
import { asMedia, getAllMinistries } from '@/lib/content'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

async function findMinistry(slug: string) {
  return (await getAllMinistries()).find((m) => m.slug === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ministry = await findMinistry((await params).slug)
  if (!ministry) return { title: 'Ministère introuvable', robots: { index: false } }
  return pageMetadata({
    title: `Ministère ${ministry.name}`,
    description:
      ministry.summary || `Découvrez le ministère ${ministry.name} de MKMI Québec, ses activités et comment vous y impliquer.`,
    path: `/ministeres/${ministry.slug}`,
    eyebrow: 'Ministère',
    image: asMedia(ministry.image)?.url,
  })
}

export default async function MinistryPage({ params }: Props) {
  const ministry = await findMinistry((await params).slug)
  if (!ministry) notFound()
  const Icon = ministryIcons[ministry.icon as keyof typeof ministryIcons] ?? Users

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Ministères', path: '/ministeres' },
          { name: ministry.name, path: `/ministeres/${ministry.slug}` },
        ])}
      />
      <section aria-labelledby="ministry-title" className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-16 text-white">
        <Glow />
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow light>Ministère</Eyebrow>
            <h1 id="ministry-title" className="flex items-center gap-4 text-4xl font-extrabold sm:text-5xl">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-400 text-navy-900">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              {ministry.name}
            </h1>
            {ministry.summary && <p className="mt-6 max-w-lg text-lg text-white/80">{ministry.summary}</p>}
            <ul className="mt-6 space-y-2 text-sm text-white/75">
              {ministry.leader && (
                <li className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-gold-400" aria-hidden="true" /> Responsable : {ministry.leader}
                </li>
              )}
              {ministry.schedule && (
                <li className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-gold-400" aria-hidden="true" /> {ministry.schedule}
                </li>
              )}
            </ul>
          </div>
          <Photo media={asMedia(ministry.image)} placeholder="Photo à venir" className="aspect-[4/3] rounded-3xl" sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
      </section>

      <section className="py-16">
        <div className="container-site max-w-3xl">
          {ministry.description ? (
            <div className="rich-text leading-relaxed">
              <RichText data={ministry.description} />
            </div>
          ) : (
            <p className="text-muted">Plus de détails sur ce ministère seront publiés prochainement.</p>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/contact">
              Je veux m’impliquer <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/ministeres" variant="outline-dark">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous les ministères
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
