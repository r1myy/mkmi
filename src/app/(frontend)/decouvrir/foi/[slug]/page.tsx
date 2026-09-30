import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, CalendarDays, Clock, Play, UserRound } from 'lucide-react'

import { faithLevels, faithThemes, faithTypes } from '@/collections/FaithResources'
import { Glow } from '@/components/pages/blocks'
import { Photo } from '@/components/site/Photo'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { JsonLd } from '@/components/site/JsonLd'
import { asMedia, getFaithResourceBySlug } from '@/lib/content'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'
import { youtubeId, youtubeThumb } from '@/lib/sermons'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

const label = (list: readonly { label: string; value: string }[], v?: string | null) => list.find((o) => o.value === v)?.label

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getFaithResourceBySlug((await params).slug)
  if (!r) return { title: 'Ressource introuvable', robots: { index: false } }
  return pageMetadata({
    title: r.title,
    description: r.summary || `${label(faithTypes, r.type) ?? 'Ressource'} pour découvrir la foi, proposée par MKMI Québec.`,
    path: `/decouvrir/foi/${r.slug ?? r.id}`,
    eyebrow: label(faithThemes, r.theme) ?? 'Découvrir la foi',
    image: asMedia(r.cover)?.url ?? youtubeThumb(r),
  })
}

export default async function FaithResourcePage({ params }: Props) {
  const r = await getFaithResourceBySlug((await params).slug)
  if (!r) notFound()
  const ytId = youtubeId(r.youtubeUrl)
  const cover = asMedia(r.cover)
  const path = `/decouvrir/foi/${r.slug ?? r.id}`

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Découvrir la foi', path: '/decouvrir/foi' },
          { name: r.title, path },
        ])}
      />
      <section aria-labelledby="ressource-title" className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-16 text-white">
        <Glow />
        <div className="container-site max-w-4xl">
          <Eyebrow light>
            {label(faithTypes, r.type)} · {label(faithThemes, r.theme)}
          </Eyebrow>
          <h1 id="ressource-title" className="text-4xl font-extrabold sm:text-5xl">
            {r.title}
          </h1>
          {r.summary && <p className="mt-4 max-w-2xl text-lg text-white/80">{r.summary}</p>}
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
            {r.author && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" aria-hidden="true" /> {r.author}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {new Intl.DateTimeFormat('fr-CA', { dateStyle: 'long' }).format(new Date(r.publishedAt))}
            </span>
            {r.duration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" /> {r.duration}
              </span>
            )}
            {r.level && <span>Niveau : {label(faithLevels, r.level)}</span>}
          </p>
          {(ytId || cover) && (
            <div className="mt-8 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              {ytId ? (
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                  title={r.title}
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <Photo media={cover} placeholder="" className="aspect-video w-full" />
              )}
            </div>
          )}
          {r.youtubeUrl && (
            <ButtonLink href={r.youtubeUrl} target="_blank" rel="noopener noreferrer" className="mt-6">
              <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Regarder sur YouTube
            </ButtonLink>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container-site max-w-3xl">
          {r.body && (
            <div className="rich-text leading-relaxed">
              <RichText data={r.body} />
            </div>
          )}
          <ButtonLink href="/decouvrir/foi" variant="outline-dark" className="mt-10">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Toutes les ressources
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
