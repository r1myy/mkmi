/* eslint-disable @next/next/no-html-link-for-pages -- liens de l’administration et export CSV : navigation classique voulue. */
import type { Payload } from 'payload'
import React from 'react'

import { eventDate, formatLabels } from '@/lib/events'
import type { Event, EventRegistration, Media } from '@/payload-types'
import './dashboard.scss'
import { Donut, Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const PER_PAGE = 12
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

type Status = NonNullable<EventRegistration['status']>
const statusLabel: Record<Status, string> = { confirmed: 'Confirmée', pending: 'En attente', cancelled: 'Annulée' }
const statusClass: Record<Status, string> = { confirmed: 'upcoming', pending: 'live', cancelled: 'cancelled' }

const tabs: { key: '' | Status; label: string }[] = [
  { key: '', label: 'Toutes les inscriptions' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'pending', label: 'En attente' },
  { key: 'cancelled', label: 'Annulées' },
]

const eventOf = (r: EventRegistration) => (typeof r.event === 'object' && r.event ? (r.event as Event) : null)

/** Liste des inscriptions de l’administration (maquette « Inscriptions »). */
export default async function RegistrationsList({ payload, searchParams = {} }: Props) {
  const now = new Date().getTime()
  const q = one(searchParams.q)
  const tab = one(searchParams.statut) as '' | Status
  const eventFilter = Number(one(searchParams.evenement)) || 0
  const period = one(searchParams.periode)
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const [regs, events] = await Promise.all([
    payload
      .find({ collection: 'event-registrations', sort: '-createdAt', limit: 10000, pagination: false, depth: 2, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as EventRegistration[]),
    payload
      .find({ collection: 'events', sort: 'startsAt', limit: 500, pagination: false, depth: 1, draft: true, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as Event[]),
  ])

  const count = (s: Status) => regs.filter((r) => (r.status ?? 'confirmed') === s).length
  const month = (r: EventRegistration) => now - new Date(r.createdAt).getTime() < 30 * 86400000
  const monthCount = (s?: Status) => regs.filter((r) => month(r) && (!s || (r.status ?? 'confirmed') === s)).length

  const periods: Record<string, number> = { '7': 7, '30': 30, '90': 90 }
  const filtered = regs.filter((r) => {
    const e = eventOf(r)
    return (
      (!tab || (r.status ?? 'confirmed') === tab) &&
      (!eventFilter || e?.id === eventFilter) &&
      (!periods[period] || now - new Date(r.createdAt).getTime() < periods[period] * 86400000) &&
      (!q || norm(`${r.name} ${r.email} ${e?.title ?? ''}`).includes(norm(q)))
    )
  })
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    const merged = { q, statut: tab, evenement: eventFilter || undefined, periode: period, ...extra }
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== '' && v !== 0) params.set(k, String(v))
    const s = params.toString()
    return `/admin/collections/event-registrations${s ? `?${s}` : ''}`
  }

  // Événement mis en avant : celui filtré, sinon le prochain
  const focus = events.find((e) => e.id === eventFilter) ?? events.find((e) => new Date(e.startsAt).getTime() >= now - 3 * 3600000) ?? events[events.length - 1]
  const focusSeats = focus
    ? regs.filter((r) => eventOf(r)?.id === focus.id && r.status !== 'cancelled').reduce((s, r) => s + (r.seats ?? 1), 0)
    : 0
  const focusImg = focus?.image && typeof focus.image === 'object' ? (focus.image as Media) : null

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Inscriptions"
        title="Inscriptions"
        text="Gérez toutes les inscriptions aux événements et suivez leur statut."
        actions={
          <>
            <a href={`/api/export/inscriptions${eventFilter ? `?evenement=${eventFilter}` : ''}`} className="mk-btn mk-btn--outline">
              <Icon name="down" size={18} /> Exporter (CSV)
            </a>
            <a href="/admin/collections/event-registrations/create" className="mk-btn mk-btn--navy">
              <Icon name="plus" size={18} /> Nouvelle inscription
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="users" label="Inscriptions totales" value={regs.length} extra={<span className="mk-kpi__sub">{monthCount()} ces 30 derniers jours</span>} />
        <Kpi icon="check" tone="green" label="Confirmées" value={count('confirmed')} extra={<span className="mk-kpi__sub">{monthCount('confirmed')} ces 30 jours</span>} href={href({ statut: 'confirmed', p: undefined })} />
        <Kpi icon="clock" tone="gold" label="En attente" value={count('pending')} extra={<span className="mk-kpi__sub">À confirmer</span>} href={href({ statut: 'pending', p: undefined })} />
        <Kpi icon="x" tone="violet" label="Annulées" value={count('cancelled')} extra={<span className="mk-kpi__sub">{monthCount('cancelled')} ces 30 jours</span>} href={href({ statut: 'cancelled', p: undefined })} />
      </section>

      <form action="/admin/collections/event-registrations" className="mk-card mk-filters mk-filters--bar">
        {tab && <input type="hidden" name="statut" value={tab} />}
        <label className="mk-search">
          <Icon name="search" size={16} />
          <span className="sr-only">Rechercher un participant</span>
          <input type="search" name="q" defaultValue={q} placeholder="Rechercher un participant…" />
        </label>
        <select name="evenement" defaultValue={eventFilter ? String(eventFilter) : ''} aria-label="Événement">
          <option value="">Tous les événements</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({eventDate(e).day} {eventDate(e).month})
            </option>
          ))}
        </select>
        <select name="periode" defaultValue={period} aria-label="Période d’inscription">
          <option value="">Toutes les dates</option>
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">90 derniers jours</option>
        </select>
        <button type="submit" className="mk-btn mk-btn--navy">
          Filtrer
        </button>
        <a href="/admin/collections/event-registrations" className="mk-btn mk-btn--outline">
          <Icon name="refresh" size={16} /> Réinitialiser
        </a>
      </form>

      <div className="mk-split mk-split--wide">
        <section>
          <nav className="mk-tabs mk-tabs--pills" aria-label="Filtrer par statut">
            {tabs.map((t) => (
              <a key={t.key} href={href({ statut: t.key, p: undefined })} className={tab === t.key ? 'is-active' : undefined} aria-current={tab === t.key ? 'page' : undefined}>
                {t.label} <small>({t.key ? count(t.key) : regs.length})</small>
              </a>
            ))}
          </nav>

          <div className="mk-card mk-table-card">
            <div className="mk-table-wrap">
              <table className="mk-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Événement</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Places</th>
                    <th>Statut</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="mk-empty">
                        {regs.length === 0 ? 'Aucune inscription pour l’instant. Elles arrivent ici depuis la page de chaque événement.' : 'Aucune inscription ne correspond à votre recherche.'}
                      </td>
                    </tr>
                  )}
                  {rows.map((r) => {
                    const e = eventOf(r)
                    const img = e?.image && typeof e.image === 'object' ? (e.image as Media) : null
                    const st = (r.status ?? 'confirmed') as Status
                    return (
                      <tr key={r.id}>
                        <td>
                          <a href={`/admin/collections/event-registrations/${r.id}`} className="mk-person">
                            <span className="mk-avatar">{r.name.slice(0, 1).toUpperCase()}</span>
                            <span>
                              <strong>{r.name}</strong>
                              <span>{r.email}</span>
                            </span>
                          </a>
                        </td>
                        <td>
                          {e ? (
                            <a href={href({ evenement: e.id, p: undefined })} className="mk-event-cell mk-event-cell--sm">
                              <span className="mk-thumb" style={img ? { backgroundImage: `url(${img.sizes?.card?.url ?? img.url})` } : undefined} />
                              <strong>{e.title}</strong>
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="mk-meta">
                          {e && (
                            <>
                              <span>
                                <Icon name="calendar" size={14} /> {eventDate(e).day} {eventDate(e).month} {new Date(e.startsAt).getFullYear()}
                              </span>
                              <span>
                                <Icon name="clock" size={14} /> {eventDate(e).time}
                              </span>
                            </>
                          )}
                        </td>
                        <td>
                          <span className="mk-tag">{formatLabels[e?.format ?? 'onsite']}</span>
                        </td>
                        <td>
                          <strong>{r.seats ?? 1}</strong>
                        </td>
                        <td>
                          <span className={`mk-status mk-status--${statusClass[st]}`}>{statusLabel[st]}</span>
                        </td>
                        <td className="mk-row-actions">
                          <a href={`/admin/collections/event-registrations/${r.id}`} className="mk-btn mk-btn--ghost">
                            Gérer
                          </a>
                          <a href={`mailto:${r.email}`} className="mk-icon-btn" aria-label={`Écrire à ${r.name}`}>
                            <Icon name="mail" size={16} />
                          </a>
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
                  : `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} inscription${filtered.length > 1 ? 's' : ''}`}
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
          </div>
        </section>

        <aside className="mk-side">
          {focus && (
            <section className="mk-card">
              <h2 className="mk-side__title">Détails de l’événement</h2>
              <div className="mk-focus">
                <span className="mk-focus__img" style={focusImg ? { backgroundImage: `url(${focusImg.sizes?.card?.url ?? focusImg.url})` } : undefined}>
                  <span className="mk-events__date">
                    <strong>{eventDate(focus).day}</strong>
                    {eventDate(focus).month}
                  </span>
                </span>
                <div className="mk-meta">
                  <strong className="mk-focus__title">{focus.title}</strong>
                  <span>
                    <Icon name="calendar" size={14} /> {eventDate(focus).long}
                  </span>
                  <span>
                    <Icon name="clock" size={14} /> {eventDate(focus).time}
                  </span>
                  <span>
                    <Icon name="pin" size={14} /> {focus.location || 'À préciser'}
                  </span>
                </div>
              </div>
              <div className="mk-progress mk-progress--wide">
                <span className="mk-progress__bar">
                  <span style={{ width: focus.capacity ? `${Math.min(100, Math.round((focusSeats / focus.capacity) * 100))}%` : '0%' }} />
                </span>
                <span className="mk-kpi__sub">
                  {focus.capacity ? `${focusSeats} / ${focus.capacity} places réservées (${Math.round((focusSeats / focus.capacity) * 100)} %)` : `${focusSeats} place(s) réservée(s), sans limite`}
                </span>
              </div>
              <a href={`/admin/collections/events/${focus.id}`} className="mk-btn mk-btn--outline mk-btn--block">
                Voir l’événement <Icon name="arrow" size={16} />
              </a>
            </section>
          )}

          <section className="mk-card">
            <h2 className="mk-side__title">Répartition des inscriptions</h2>
            {regs.length ? (
              <Donut
                total={regs.length}
                caption="inscriptions"
                colors={['#1f9d63', '#f5bf4f', '#e0473b']}
                parts={[
                  { label: 'Confirmées', value: count('confirmed') },
                  { label: 'En attente', value: count('pending') },
                  { label: 'Annulées', value: count('cancelled') },
                ]}
              />
            ) : (
              <p className="mk-empty">La répartition apparaîtra avec les premières inscriptions.</p>
            )}
          </section>

          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href={`/api/export/inscriptions${eventFilter ? `?evenement=${eventFilter}` : ''}`} className="mk-tone-violet">
                <Icon name="down" size={20} /> Exporter la liste des inscriptions
              </a>
              <a href="/admin/collections/event-registrations/create" className="mk-tone-gold">
                <Icon name="plus" size={20} /> Ajouter manuellement une inscription
              </a>
              <a href="/admin/collections/events/create" className="mk-tone-blue">
                <Icon name="calendar" size={20} /> Créer un événement
              </a>
              <a href="/evenements" target="_blank" rel="noopener noreferrer" className="mk-tone-green">
                <Icon name="external" size={20} /> Voir la page publique
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
