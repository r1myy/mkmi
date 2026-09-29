/* eslint-disable @next/next/no-html-link-for-pages -- liens de l’administration : navigation classique voulue. */
import type { Payload } from 'payload'
import React from 'react'

import { eventDate } from '@/lib/events'
import type { Event, Media, Ministry } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/ministries'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const img = (m: unknown) => (m && typeof m === 'object' ? (m as Media) : null)

/** Ministères de l’administration (maquette « Ministères »). */
export default async function MinistriesList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const status = one(searchParams.statut)
  const now = new Date()

  const [all, events] = await Promise.all([
    payload
      .find({ collection: 'ministries', sort: 'order', limit: 200, pagination: false, depth: 1, draft: true, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as Ministry[]),
    payload
      .find({
        collection: 'events',
        where: { startsAt: { greater_than_equal: now.toISOString() } },
        sort: 'startsAt',
        limit: 4,
        depth: 1,
        overrideAccess: true,
      })
      .then((r) => r.docs)
      .catch(() => [] as Event[]),
  ])

  const published = all.filter((m) => m._status === 'published').length
  const withLeader = all.filter((m) => m.leader).length
  const withPhoto = all.filter((m) => m.image).length
  const filtered = all.filter(
    (m) =>
      (!status || (status === 'published' ? m._status === 'published' : m._status !== 'published')) &&
      (!q || norm(`${m.name} ${m.summary ?? ''} ${m.leader ?? ''}`).includes(norm(q))),
  )

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Ministères"
        title="Ministères"
        text="Gérez les ministères de MKMI Québec, leurs responsables et leurs activités."
        actions={
          <>
            <a href="/ministeres" target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn--outline">
              <Icon name="external" size={18} /> Voir la page publique
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Nouveau ministère
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="users" label="Total des ministères" value={all.length} extra={<span className="mk-kpi__sub">{published} publiés</span>} />
        <Kpi icon="check" tone="green" label="Avec responsable" value={withLeader} extra={<span className="mk-kpi__sub">sur {all.length}</span>} />
        <Kpi icon="calendar" tone="violet" label="Activités à venir" value={events.length} extra={<span className="mk-kpi__sub">Prochains événements</span>} href="/admin/collections/events" />
        <Kpi icon="eye" tone="gold" label="Avec photo" value={withPhoto} extra={<span className="mk-kpi__sub">{all.length - withPhoto} sans photo</span>} />
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-card">
          <div className="mk-card__head">
            <h2>Nos ministères</h2>
            <form action={BASE} className="mk-filters">
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher un ministère</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher un ministère…" />
              </label>
              <select name="statut" defaultValue={status} aria-label="Statut">
                <option value="">Tous les statuts</option>
                <option value="published">Publiés</option>
                <option value="draft">Brouillons</option>
              </select>
              <button type="submit" className="mk-btn mk-btn--navy">
                Filtrer
              </button>
            </form>
          </div>
          {filtered.length === 0 ? (
            <p className="mk-empty">Aucun ministère ne correspond à votre recherche.</p>
          ) : (
            <ul className="mk-tiles">
              {filtered.map((m) => {
                const photo = img(m.image)
                return (
                  <li key={m.id}>
                    <a href={`${BASE}/${m.id}`} className="mk-tile">
                      <span className="mk-tile__img" style={photo ? { backgroundImage: `url(${photo.sizes?.card?.url ?? photo.url})` } : undefined} />
                      <span className="mk-tile__body">
                        <strong>{m.name}</strong>
                        {m.leader && (
                          <span className="mk-kpi__sub">
                            <Icon name="users" size={13} /> {m.leader}
                          </span>
                        )}
                        <span className="mk-tile__text">{m.summary || 'Ajoutez une courte description.'}</span>
                        <span className="mk-tile__foot">
                          <span className={`mk-status mk-status--${m._status === 'published' ? 'upcoming' : 'draft'}`}>{m._status === 'published' ? 'Publié' : 'Brouillon'}</span>
                          <Icon name="arrow" size={16} />
                        </span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <div className="mk-card__head">
              <h2>Prochaines activités</h2>
              <a href="/admin/collections/events" className="mk-link">
                Voir tout <Icon name="arrow" size={16} />
              </a>
            </div>
            {events.length === 0 ? (
              <p className="mk-empty">Aucune activité à venir.</p>
            ) : (
              <ul className="mk-events">
                {events.map((e) => {
                  const d = eventDate(e)
                  const photo = img(e.image)
                  return (
                    <li key={e.id}>
                      <span className="mk-events__thumb mk-events__thumb--sm" style={photo ? { backgroundImage: `url(${photo.sizes?.card?.url ?? photo.url})` } : undefined} />
                      <a href={`/admin/collections/events/${e.id}`} className="mk-events__body">
                        <strong>{e.title}</strong>
                        <span>
                          <Icon name="calendar" size={14} /> {d.day} {d.month} · {d.time}
                        </span>
                        <span>
                          <Icon name="pin" size={14} /> {e.location || 'À préciser'}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href={`${BASE}/create`} className="mk-tone-gold">
                <Icon name="plus" size={20} /> Nouveau ministère
              </a>
              <a href="/admin/globals/page-ministeres" className="mk-tone-blue">
                <Icon name="pen" size={20} /> Modifier la page Ministères
              </a>
              <a href="/admin/collections/events/create" className="mk-tone-violet">
                <Icon name="calendar" size={20} /> Planifier une activité
              </a>
              <a href="/admin/collections/media" className="mk-tone-green">
                <Icon name="eye" size={20} /> Photos (médias)
              </a>
            </div>
          </section>
        </aside>
      </div>

      <section className="mk-card mk-table-card">
        <div className="mk-toolbar">
          <h2 className="mk-side__title" style={{ margin: 0 }}>
            Gestion des ministères
          </h2>
        </div>
        <div className="mk-table-wrap">
          <table className="mk-table">
            <thead>
              <tr>
                <th>Ministère</th>
                <th>Responsable</th>
                <th>Horaires</th>
                <th>Ordre</th>
                <th>Statut</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const photo = img(m.image)
                return (
                  <tr key={m.id}>
                    <td>
                      <a href={`${BASE}/${m.id}`} className="mk-event-cell mk-event-cell--sm">
                        <span className="mk-thumb" style={photo ? { backgroundImage: `url(${photo.sizes?.card?.url ?? photo.url})` } : undefined} />
                        <strong>{m.name}</strong>
                      </a>
                    </td>
                    <td>{m.leader || <span className="mk-kpi__sub">À désigner</span>}</td>
                    <td>{m.schedule || <span className="mk-kpi__sub">À préciser</span>}</td>
                    <td>{m.order ?? 0}</td>
                    <td>
                      <span className={`mk-status mk-status--${m._status === 'published' ? 'upcoming' : 'draft'}`}>{m._status === 'published' ? 'Publié' : 'Brouillon'}</span>
                    </td>
                    <td className="mk-row-actions">
                      <a href={`${BASE}/${m.id}`} className="mk-btn mk-btn--ghost">
                        Modifier
                      </a>
                      {m.slug && m._status === 'published' && (
                        <a href={`/ministeres/${m.slug}`} target="_blank" rel="noopener noreferrer" className="mk-icon-btn" aria-label={`Voir ${m.name} sur le site`}>
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
      </section>
    </div>
  )
}
