import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Clock, MapPin, Radio } from 'lucide-react'
import clsx from 'clsx'

import { asMedia } from '@/lib/content'
import { categoryLabels, eventDate, formatLabels } from '@/lib/events'
import type { Event } from '@/payload-types'
import { Photo } from '../site/Photo'

export const eventHref = (e: Event) => `/evenements/${e.slug ?? e.id}`

export function DateBadge({ event, className }: { event: Event; className?: string }) {
  const d = eventDate(event)
  return (
    <span
      className={clsx(
        'flex w-14 flex-col items-center rounded-xl bg-white py-1.5 leading-none text-navy-900 shadow-lg',
        className,
      )}
    >
      <span className="font-display text-2xl font-extrabold">{d.day}</span>
      <span className="mt-0.5 text-[11px] font-bold uppercase">{d.month}</span>
    </span>
  )
}

export function EventMeta({ event, light = false }: { event: Event; light?: boolean }) {
  const d = eventDate(event)
  const icon = clsx('h-4 w-4 shrink-0', light ? 'text-gold-400' : 'text-gold-500')
  return (
    <ul className={clsx('space-y-1.5 text-sm', light ? 'text-white/80' : 'text-muted')}>
      <li className="flex items-center gap-2">
        <Clock className={icon} aria-hidden="true" /> {d.time}
      </li>
      {event.format !== 'online' && event.location && (
        <li className="flex items-center gap-2">
          <MapPin className={icon} aria-hidden="true" /> {event.location}
        </li>
      )}
      {event.format && event.format !== 'onsite' && (
        <li className="flex items-center gap-2">
          <Radio className={icon} aria-hidden="true" /> {formatLabels[event.format]}
        </li>
      )}
    </ul>
  )
}

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={eventHref(event)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)] ring-1 ring-navy-900/5 transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(11,22,40,.5)]"
    >
      <div className="relative">
        <Photo media={asMedia(event.image)} placeholder="" className="aspect-[16/10] w-full" sizes="(min-width:1024px) 22vw, 50vw" />
        <DateBadge event={event} className="absolute top-3 left-3" />
        <span className="absolute bottom-3 left-3 rounded-md bg-navy-950/85 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur">
          {categoryLabels[event.category ?? 'rencontre']}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-navy-900">{event.title}</h3>
        <div className="mt-3 flex-1">
          <EventMeta event={event} />
        </div>
        <span className="mt-5 inline-flex items-center gap-2 self-start rounded-lg border border-navy-900/15 px-3 py-2 text-xs font-bold text-navy-900 transition-colors group-hover:border-gold-400 group-hover:bg-gold-400">
          En savoir plus <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

/** Calendrier mensuel : les jours avec un événement sont cliquables (filtre par jour). */
export function EventCalendar({
  events,
  month,
  selectedDay,
  params,
}: {
  events: Event[]
  /** « AAAA-MM » */
  month: string
  selectedDay?: string
  params: Record<string, string>
}) {
  const [y, m] = month.split('-').map(Number)
  const first = new Date(Date.UTC(y, m - 1, 1))
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const offset = first.getUTCDay()
  const byDay = new Map<string, Event[]>()
  for (const e of events) {
    const key = eventDate(e).key
    byDay.set(key, [...(byDay.get(key) ?? []), e])
  }
  const shift = (delta: number) => {
    const d = new Date(Date.UTC(y, m - 1 + delta, 1))
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  }
  const href = (extra: Record<string, string | undefined>) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries({ ...params, ...extra })) if (v) q.set(k, v)
    const s = q.toString()
    return `/evenements${s ? `?${s}` : ''}#tous`
  }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date())
  const label = new Intl.DateTimeFormat('fr-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_18px_50px_-30px_rgba(11,22,40,.45)] ring-1 ring-navy-900/5">
      <h2 className="font-display text-xl font-extrabold text-navy-900">Calendrier des événements</h2>
      <div className="mt-4 flex items-center justify-between">
        <Link href={href({ mois: shift(-1), jour: undefined })} aria-label="Mois précédent" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <p className="font-bold text-navy-900 capitalize" aria-live="polite">
          {label}
        </p>
        <Link href={href({ mois: shift(1), jour: undefined })} aria-label="Mois suivant" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist">
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 font-semibold text-muted">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const key = `${month}-${String(i + 1).padStart(2, '0')}`
          const dayEvents = byDay.get(key)
          const base = 'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm'
          if (!dayEvents) {
            return (
              <span key={key} className={clsx(base, key === today ? 'font-bold text-navy-900 ring-1 ring-navy-900/30' : 'text-navy-900/70')}>
                {i + 1}
              </span>
            )
          }
          const online = dayEvents.every((e) => e.format === 'online')
          return (
            <Link
              key={key}
              href={href({ jour: selectedDay === key ? undefined : key, mois: month })}
              title={dayEvents.map((e) => e.title).join(' · ')}
              aria-label={`${i + 1} : ${dayEvents.map((e) => e.title).join(', ')}`}
              aria-current={selectedDay === key ? 'date' : undefined}
              className={clsx(
                base,
                'font-bold transition-transform hover:scale-110',
                online ? 'bg-navy-900 text-white' : 'bg-gold-400 text-navy-900',
                selectedDay === key && 'ring-2 ring-navy-900 ring-offset-2',
              )}
            >
              {i + 1}
            </Link>
          )
        })}
      </div>
      <ul className="mt-5 space-y-2 border-t border-navy-900/10 pt-4 text-xs text-muted">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-gold-400" aria-hidden="true" /> Événement sur place
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-navy-900" aria-hidden="true" /> Événement en ligne
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full ring-1 ring-navy-900/30" aria-hidden="true" /> Aujourd’hui
        </li>
      </ul>
    </div>
  )
}
