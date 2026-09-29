import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, Download, Headphones, Play } from 'lucide-react'

import { Glow } from '@/components/pages/blocks'
import { Photo } from '@/components/site/Photo'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { JsonLd } from '@/components/site/JsonLd'
import { asMedia, getSermons } from '@/lib/content'
import { breadcrumbJsonLd, pageMetadata, siteUrl } from '@/lib/seo'
import { formatSermonDate, youtubeId, youtubeThumb } from '@/lib/sermons'
import { TrackedDownload } from '@/components/site/TrackedDownload'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

async function findSermon(slug: string) {
  return (await getSermons()).find((s) => s.slug === slug || String(s.id) === slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sermon = await findSermon((await params).slug)
  if (!sermon) return { title: 'Message introuvable', robots: { index: false } }
  return pageMetadata({
    title: sermon.title,
    description: `${sermon.category || 'Prédication'} de ${sermon.preacher} du ${formatSermonDate(sermon.date)}${sermon.series ? `, série « ${sermon.series} »` : ''}. À regarder ou écouter sur le site de MKMI Québec.`,
    path: `/messages/${sermon.slug ?? sermon.id}`,
    eyebrow: sermon.category || 'Prédication',
    image: asMedia(sermon.thumbnail)?.url ?? youtubeThumb(sermon),
  })
}

export default async function SermonPage({ params }: Props) {
  const sermon = await findSermon((await params).slug)
  if (!sermon) notFound()
  const ytId = youtubeId(sermon.youtubeUrl)
  const thumb = asMedia(sermon.thumbnail)
  const audio = asMedia(sermon.audioFile)

  const path = `/messages/${sermon.slug ?? sermon.id}`
  const thumbUrl = thumb?.url ? `${siteUrl}${thumb.url}` : youtubeThumb(sermon)

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Messages', path: '/messages' }, { name: sermon.title, path }])} />
      {ytId && thumbUrl && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: sermon.title,
            description: `${sermon.category || 'Prédication'} de ${sermon.preacher}`,
            thumbnailUrl: thumbUrl,
            uploadDate: sermon.date,
            embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}`,
            url: `${siteUrl}${path}`,
          }}
        />
      )}
      <section aria-labelledby="sermon-title" className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-16 text-white">
        <Glow />
        <div className="container-site max-w-4xl">
          <Eyebrow light>{sermon.category || 'Prédication'}</Eyebrow>
          <h1 id="sermon-title" className="text-4xl font-extrabold sm:text-5xl">
            {sermon.title}
          </h1>
          <p className="mt-4 text-white/70">
            {sermon.preacher} · {formatSermonDate(sermon.date)}
            {sermon.series ? ` · Série : ${sermon.series}` : ''}
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            {ytId ? (
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                title={sermon.title}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <Photo media={thumb} src={thumb ? null : youtubeThumb(sermon)} placeholder="Vidéo à venir" className="aspect-video w-full" />
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {sermon.youtubeUrl && (
              <ButtonLink href={sermon.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Regarder sur YouTube
              </ButtonLink>
            )}
            {sermon.podcastUrl && (
              <ButtonLink href={sermon.podcastUrl} target="_blank" rel="noopener noreferrer" variant="outline-light">
                <Headphones className="h-4 w-4" aria-hidden="true" /> Écouter le balado
              </ButtonLink>
            )}
            {audio?.url && (
              <TrackedDownload
                slug={String(sermon.slug ?? sermon.id)}
                href={audio.url}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-xs font-bold tracking-wide uppercase hover:bg-white/10"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Télécharger l’audio
              </TrackedDownload>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-site max-w-3xl">
          {sermon.description && (
            <div className="rich-text leading-relaxed">
              <RichText data={sermon.description} />
            </div>
          )}
          <ButtonLink href="/messages" variant="outline-dark" className="mt-10">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous les messages
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
