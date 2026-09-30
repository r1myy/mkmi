'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Clock, MapPin } from 'lucide-react'
import clsx from 'clsx'

import type { Media } from '@/payload-types'
import { Photo } from '../site/Photo'

export type EventCard = {
  id: number
  title: string
  slug?: string | null
  summary?: string | null
  location?: string | null
  day: string
  month: string
  year: string
  time: string
  image: Media | null
  registrationEnabled: boolean
}

export function EventCarousel({ events }: { events: EventCard[] }) {
  const [index, setIndex] = useState(0)
  const event = events[index]
  const go = (delta: number) => setIndex((i) => (i + delta + events.length) % events.length)

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-card)] border border-navy-900/5 bg-white shadow-[0_18px_40px_-24px_rgba(11,22,40,.45)]"
      aria-roledescription="carrousel"
      aria-label="Prochains événements"
    >
      <div className="relative" aria-live="polite">
        <Photo media={event.image} className="aspect-[16/7] w-full" sizes="(min-width:1024px) 540px, 100vw" />
        <div className="absolute top-4 left-4 flex flex-col items-center rounded-lg bg-white px-3 py-2 text-navy-900 shadow-lg">
          <span className="font-display text-3xl leading-none font-extrabold">{event.day}</span>
          <span className="text-sm font-bold uppercase">{event.month}</span>
          <span className="text-sm font-bold">{event.year}</span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-navy-900">
              {event.slug ? (
                <Link href={`/evenements/${event.slug}`} className="hover:underline">
                  {event.title}
                </Link>
              ) : (
                event.title
              )}
            </h3>
            {event.summary && <p className="mt-1 max-w-xs text-sm text-muted">{event.summary}</p>}
            <ul className="mt-3 space-y-1.5 text-xs text-muted">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-500" aria-hidden="true" /> {event.time}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-500" aria-hidden="true" /> {event.location}
              </li>
            </ul>
          </div>
          {event.registrationEnabled && (
            <Link
              href={event.slug ? `/evenements/${event.slug}#inscription` : '/evenements'}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-gold-400 px-4 py-2.5 text-xs font-bold uppercase text-navy-900 hover:bg-gold-300 sm:self-auto"
            >
              S’inscrire <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
        {events.length > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Événement précédent"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-navy-900 hover:bg-gold-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="flex gap-2">
              {events.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Afficher l’événement ${i + 1} sur ${events.length}`}
                  aria-current={i === index}
                  className={clsx('h-2 w-2 rounded-full', i === index ? 'bg-navy-900' : 'bg-navy-900/20')}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Événement suivant"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-mist text-navy-900 hover:bg-gold-300"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
