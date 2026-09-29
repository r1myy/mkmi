/* eslint-disable @next/next/no-html-link-for-pages -- liens de l’administration : navigation classique voulue. */
import type { Payload } from 'payload'
import React from 'react'

import { categoryLabels, eventDate, formatLabels } from '@/lib/events'
import type { Event, Media } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const TZ = 'America/Toronto'
const PER_PAGE = 10
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d)

type Status = 'draft' | 'upcoming' | 'live' | 'past'
const statusLabel: Record<Status, string> = { draft: 'Brouillon', upcoming: 'À venir', live: 'En cours', past: 'Passé' }

function statusOf(e: Event, now: number): Status {
  if (e._status !== 'published') return 'draft'
  const start = new Date(e.startsAt).getTime()
  const end = e.endsAt ? new Date(e.endsAt).getTime() : start + 3 * 3600000
  if (now < start) return 'upcoming'
  if (now <= end) return 'live'
  return 'past'
}

const tabs: { key: string; label: string }[] = [
  { key: '', label: 'Tous' },
  { key: 'upcoming', label: 'À venir' },
  { key: 'live', label: 'En cours' },
  { key: 'past', label: 'Passés' },
  { key: 'draft', label: 'Brouillons' },
]

/** Liste des événements de l’administration (maquette « Événements »). */
export default async function EventsList({ payload, searchParams = {} }: Props) {
  const now = new Date().getTime()
  const q = one(searchParams.q)
  const tab = one(searchParams.statut)
  const cat = one(searchParams.categorie)
  const format = one(searchParams.format)
  const monthParam = /^\d{4}-\d{2}$/.test(one(searchParams.mois)) ? one(searchParams.mois) : ''
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const [all, regs] = await Promise.all([
    payload
      .find({ collection: 'events', limit: 1000, pagination: false, depth: 1, sort: '-startsAt', draft: true, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as Event[]),
    payload
      .find({ collection: 'event-registrations', limit: 10000, pagination: false, depth: 0, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => []),
  ])

  // Mois du calendrier : celui demandé, sinon le mois du prochain événement, sinon le mois courant.
  const nextEvent = [...all].filter((e) => new Date(e.startsAt).getTime() >= now).sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0]
  const month = monthParam || dayKey(nextEvent ? new Date(nextEvent.startsAt) : new Date()).slice(0, 7)

  const seats = new Map<number, number>()
  let regs30 = 0,
    regsPrev = 0
  for (const r of regs) {
    const id = typeof r.event === 'object' && r.event ? r.event.id : (r.event as number)
    seats.set(id, (seats.get(id) ?? 0) + (r.seats ?? 1))
    const age = now - new Date(r.createdAt).getTime()
    if (age < 30 * 86400000) regs30 += r.seats ?? 1
    else if (age < 60 * 86400000) regsPrev += r.seats ?? 1
  }
  const totalSeats = [...seats.values()].reduce((a, b) => a + b, 0)
  const withCap = all.filter((e) => e.capacity)
  const fill = withCap.length
    ? Math.round((withCap.reduce((s, e) => s + Math.min(seats.get(e.id) ?? 0, e.capacity!), 0) / withCap.reduce((s, e) => s + e.capacity!, 0)) * 100)
    : null
  const next30 = all.filter((e) => {
    const t = new Date(e.startsAt).getTime()
    return t >= now && t <= now + 30 * 86400000
  }).length

  const filtered = all.filter(
    (e) =>
      (!tab || statusOf(e, now) === tab) &&
      (!cat || (e.category ?? 'rencontre') === cat) &&
      (!format || e.format === format) &&
      (!q || norm(`${e.title} ${e.location ?? ''} ${e.summary ?? ''}`).includes(norm(q))),
  )
  // À venir d’abord (du plus proche au plus lointain), puis les passés (du plus récent au plus ancien)
  filtered.sort((a, b) => {
    const ta = new Date(a.startsAt).getTime(),
      tb = new Date(b.startsAt).getTime()
    const fa = ta >= now - 3 * 3600000,
      fb = tb >= now - 3 * 3600000
    if (fa !== fb) return fa ? -1 : 1
    return fa ? ta - tb : tb - ta
  })
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    const merged = { q, statut: tab, categorie: cat, format, mois: one(searchParams.mois), ...extra }
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `/admin/collections/events${s ? `?${s}` : ''}`
  }

  // Calendrier
  const [y, m] = month.split('-').map(Number)
  const first = new Date(Date.UTC(y, m - 1, 1))
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const byDay = new Map<string, Status>()
  for (const e of all) {
    const k = dayKey(new Date(e.startsAt))
    if (k.startsWith(month)) byDay.set(k, statusOf(e, now))
  }
  const shift = (d: number) => {
    const t = new Date(Date.UTC(y, m - 1 + d, 1))
    return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}`
  }
  const today = dayKey(new Date())

  // Catégories
  const cats = Object.entries(categoryLabels)
    .map(([k, label]) => ({ k, label, n: all.filter((e) => (e.category ?? 'rencontre') === k).length }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n)

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Événements"
        title="Événements"
        text="Créez, gérez et suivez tous les événements de MKMI Québec."
        actions={
          <>
            <a href="/evenements" target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn--outline">
              <Icon name="calendar" size={18} /> Voir le calendrier public
            </a>
            <a href="/admin/collections/events/create" className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Créer un événement
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="calendar" label="Total des événements" value={all.length} extra={<span className="mk-kpi__sub">Brouillons compris</span>} />
        <Kpi
          icon="users"
          tone="green"
          label="Inscriptions totales"
          value={totalSeats}
          extra={<span className="mk-kpi__sub">{regs30} ces 30 derniers jours{regsPrev ? ` (${regsPrev} avant)` : ''}</span>}
          href="/admin/collections/event-registrations"
        />
        <Kpi
          icon="chart"
          tone="violet"
          label="Taux de remplissage"
          value={fill === null ? '—' : `${fill} %`}
          extra={<span className="mk-kpi__sub">{fill === null ? 'Indiquez les places dans chaque événement' : 'Événements avec places limitées'}</span>}
        />
        <Kpi icon="clock" tone="gold" label="Événements à venir" value={next30} extra={<span className="mk-kpi__sub">Dans les 30 prochains jours</span>} />
      </section>

      <div className="mk-split">
        <section className="mk-card mk-table-card">
          <div className="mk-toolbar">
            <nav className="mk-tabs" aria-label="Filtrer par statut">
              {tabs.map((t) => (
                <a key={t.key} href={href({ statut: t.key, p: undefined })} className={tab === t.key ? 'is-active' : undefined} aria-current={tab === t.key ? 'page' : undefined}>
                  {t.label}
                </a>
              ))}
            </nav>
            <form action="/admin/collections/events" className="mk-filters">
              {tab && <input type="hidden" name="statut" value={tab} />}
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher un événement</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher un événement…" />
              </label>
              <select name="categorie" defaultValue={cat} aria-label="Catégorie">
                <option value="">Toutes les catégories</option>
                {Object.entries(categoryLabels).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
              <select name="format" defaultValue={format} aria-label="Format">
                <option value="">Tous les formats</option>
                {Object.entries(formatLabels).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
              <button type="submit" className="mk-btn mk-btn--navy">
                Filtrer
              </button>
              <a href="/admin/collections/events" className="mk-btn mk-btn--outline">
                <Icon name="refresh" size={16} /> Réinitialiser
              </a>
            </form>
          </div>

          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Événement</th>
                  <th>Date et heure</th>
                  <th>Lieu / Format</th>
                  <th>Inscriptions</th>
                  <th>Statut</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="mk-empty">
                      Aucun événement ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
                {rows.map((e) => {
                  const d = eventDate(e)
                  const st = statusOf(e, now)
                  const img = e.image && typeof e.image === 'object' ? (e.image as Media) : null
                  const taken = seats.get(e.id) ?? 0
                  return (
                    <tr key={e.id}>
                      <td>
                        <a href={`/admin/collections/events/${e.id}`} className="mk-event-cell">
                          <span className="mk-thumb" style={img ? { backgroundImage: `url(${img.sizes?.card?.url ?? img.url})` } : undefined} />
                          <span>
                            <strong>{e.title}</strong>
                            <span className="mk-tags">
                              <em className="mk-tag mk-tag--blue">{categoryLabels[e.category ?? 'rencontre']}</em>
                              {e.featured && <em className="mk-tag mk-tag--gold">À la une</em>}
                            </span>
                          </span>
                        </a>
                      </td>
                      <td className="mk-meta">
                        <span>
                          <Icon name="calendar" size={14} /> {d.day} {d.month} {new Date(e.startsAt).getFullYear()}
                        </span>
                        <span>
                          <Icon name="clock" size={14} /> {d.time}
                        </span>
                      </td>
                      <td className="mk-meta">
                        <span>
                          <Icon name="pin" size={14} /> {e.format === 'online' ? 'En ligne' : e.location || 'À préciser'}
                        </span>
                        <span>
                          <Icon name="radio" size={14} /> {formatLabels[e.format ?? 'onsite']}
                        </span>
                      </td>
                      <td>
                        {e.registrationEnabled ? (
                          <span className="mk-progress">
                            <strong>
                              {taken}
                              {e.capacity ? ` / ${e.capacity}` : ''}
                            </strong>
                            {e.capacity ? (
                              <span className="mk-progress__bar">
                                <span style={{ width: `${Math.min(100, Math.round((taken / e.capacity) * 100))}%` }} />
                              </span>
                            ) : (
                              <span className="mk-kpi__sub">Places illimitées</span>
                            )}
                          </span>
                        ) : (
                          <span className="mk-kpi__sub">Inscriptions fermées</span>
                        )}
                      </td>
                      <td>
                        <span className={`mk-status mk-status--${st}`}>{statusLabel[st]}</span>
                      </td>
                      <td className="mk-row-actions">
                        <a href={`/admin/collections/events/${e.id}`} className="mk-btn mk-btn--ghost">
                          Modifier
                        </a>
                        {e.slug && e._status === 'published' && (
                          <a href={`/evenements/${e.slug}`} target="_blank" rel="noopener noreferrer" className="mk-icon-btn" aria-label={`Voir « ${e.title} » sur le site`}>
                            <Icon name="external" size={16} />
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <footer className="mk-pager">
            <span>
              {filtered.length === 0
                ? 'Aucun résultat'
                : `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} événement${filtered.length > 1 ? 's' : ''}`}
            </span>
            {pages > 1 && (
              <nav aria-label="Pagination">
                <a href={href({ p: Math.max(1, current - 1) })} aria-label="Page précédente" className="mk-icon-btn">
                  <Icon name="left" size={16} />
                </a>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a key={n} href={href({ p: n })} className={n === current ? 'is-active' : undefined} aria-current={n === current ? 'page' : undefined}>
                    {n}
                  </a>
                ))}
                <a href={href({ p: Math.min(pages, current + 1) })} aria-label="Page suivante" className="mk-icon-btn">
                  <Icon name="right" size={16} />
                </a>
              </nav>
            )}
          </footer>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Calendrier des événements</h2>
            <div className="mk-cal__nav">
              <a href={href({ mois: shift(-1) })} aria-label="Mois précédent" className="mk-icon-btn">
                <Icon name="left" size={16} />
              </a>
              <strong>{new Intl.DateTimeFormat('fr-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first)}</strong>
              <a href={href({ mois: shift(1) })} aria-label="Mois suivant" className="mk-icon-btn">
                <Icon name="right" size={16} />
              </a>
            </div>
            <div className="mk-cal">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((d) => (
                <span key={d} className="mk-cal__wd">
                  {d}
                </span>
              ))}
              {Array.from({ length: first.getUTCDay() }, (_, i) => (
                <span key={`b${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const k = `${month}-${String(i + 1).padStart(2, '0')}`
                const st = byDay.get(k)
                return (
                  <span key={k} className={['mk-cal__day', st && `is-${st}`, k === today && 'is-today'].filter(Boolean).join(' ')}>
                    {i + 1}
                  </span>
                )
              })}
            </div>
            <ul className="mk-legend">
              <li>
                <span className="mk-dotc is-today" /> Aujourd’hui
              </li>
              <li>
                <span className="mk-dotc is-upcoming" /> Événement à venir
              </li>
              <li>
                <span className="mk-dotc is-live" /> Événement en cours
              </li>
              <li>
                <span className="mk-dotc is-past" /> Événement passé
              </li>
            </ul>
            <a href="/evenements" target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn--outline mk-btn--block">
              Voir le calendrier public <Icon name="arrow" size={16} />
            </a>
          </section>

          <section className="mk-card">
            <h2 className="mk-side__title">Catégories</h2>
            {cats.length === 0 ? (
              <p className="mk-empty">Aucune catégorie pour l’instant.</p>
            ) : (
              <ul className="mk-cats">
                {cats.map((c) => (
                  <li key={c.k}>
                    <a href={href({ categorie: c.k, p: undefined })}>
                      <Icon name="tag" size={16} /> {c.label}
                    </a>
                    <span>{c.n}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
