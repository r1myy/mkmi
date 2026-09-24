import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { upcomingPages } from '@/components/site/nav'
import { ButtonLink } from '@/components/site/ui'

type Props = { params: Promise<{ slug: string[] }> }

const detailSections: Record<string, string> = {
  ministeres: 'Ministères',
  evenements: 'Événements',
  messages: 'Messages',
}

function titleFor(slug: string[]) {
  const path = slug.join('/')
  if (upcomingPages[path]) return upcomingPages[path]
  if (slug.length === 2 && detailSections[slug[0]]) return detailSections[slug[0]]
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = titleFor((await params).slug)
  return { title: title ?? 'Page introuvable', robots: { index: false } }
}

/** Pages du plan du site pas encore construites (phase 4 du cahier des charges). */
export default async function UpcomingPage({ params }: Props) {
  const title = titleFor((await params).slug)
  if (!title) notFound()
  return (
    <section className="bg-navy-950 pt-36 pb-24 text-white">
      <div className="container-site max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Bientôt disponible</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{title}</h1>
        <p className="mt-5 text-white/75">Cette page est en préparation. Revenez très bientôt !</p>
        <ButtonLink href="/" className="mt-8">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour à l’accueil
        </ButtonLink>
      </div>
    </section>
  )
}
