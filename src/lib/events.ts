import type { Event } from '@/payload-types'

export const TZ = 'America/Toronto'

export const categoryLabels: Record<NonNullable<Event['category']>, string> = {
  louange: 'Louange',
  enseignement: 'Enseignement',
  priere: 'Prière',
  conference: 'Conférence',
  atelier: 'Atelier',
  jeunesse: 'Jeunesse',
  famille: 'Famille',
  rencontre: 'Rencontre',
}

export const formatLabels: Record<NonNullable<Event['format']>, string> = {
  onsite: 'En présentiel',
  online: 'En ligne',
  hybrid: 'En présentiel et en ligne',
}

const fmt = (date: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('fr-CA', { timeZone: TZ, ...opts }).format(new Date(date))

/** Jour, mois abrégé, jour de la semaine, heure… dans le fuseau de Québec. */
export function eventDate(e: Pick<Event, 'startsAt' | 'endsAt' | 'timeToConfirm'>) {
  const time = (d: string) => fmt(d, { hour: '2-digit', minute: '2-digit' }).replace(' h ', 'h').replace(':', 'h')
  return {
    day: fmt(e.startsAt, { day: '2-digit' }),
    month: fmt(e.startsAt, { month: 'short' }).replace('.', ''),
    weekday: fmt(e.startsAt, { weekday: 'short' }).replace('.', ''),
    long: fmt(e.startsAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    /** Clé « AAAA-MM-JJ » du jour dans le fuseau de Québec. */
    key: new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(e.startsAt)),
    time: e.timeToConfirm ? 'Heure à confirmer' : e.endsAt ? `${time(e.startsAt)} – ${time(e.endsAt)}` : time(e.startsAt),
  }
}
