import Link from 'next/link'
import { ArrowRight, Megaphone } from 'lucide-react'

import type { Announcement } from '@/payload-types'

/** Bandeau de l’annonce « À la une » (modifiable dans Communication › Annonces). */
export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const link = announcement.link?.trim()
  const external = link?.startsWith('http')
  return (
    <section aria-label="Annonce" className="bg-gold-400 text-navy-900">
      <div className="container-site flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-3 text-sm">
          <Megaphone className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-display">{announcement.title}</strong> <span className="text-navy-900/80">{announcement.summary}</span>
          </span>
        </p>
        {link && (
          <Link
            href={link}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-navy-900 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase hover:bg-navy-800 sm:self-auto"
          >
            {announcement.linkLabel || 'En savoir plus'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  )
}
