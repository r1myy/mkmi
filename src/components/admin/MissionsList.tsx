import type { Payload } from 'payload'
import React from 'react'

import type { Media, Ministry, Mission } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/missions'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const scopeLabel: Record<string, string> = { quebec: 'Au Québec', canada: 'Au Canada', international: 'Internationale' }
const statusLabel: Record<string, string> = { active: 'En cours', planned: 'En planification', done: 'Terminée' }
const statusClass: Record<string, string> = { active: 'upcoming', planned: 'live', done: 'past' }
const monthYear = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-CA', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso)).replace('.', '') : null
const period = (m: Mission) => {
  const a = monthYear(m.startDate),
    b = monthYear(m.endDate)
  return a && b ? `${a} – ${b}` : a ? `Depuis ${a}` : b ? `Jusqu’à ${b}` : 'Dates à préciser'
}
const cover = (m: Mission) => {
  const first = (m.images ?? [])[0]
  return first && typeof first === 'object' ? (first as Media) : null
}

const tabs = [
  { key: '', label: 'Toutes les missions' },
  { key: 'quebec', label: 'Au Québec' },
  { key: 'canada', label: 'Au Canada' },
  { key: 'international', label: 'Internationales' },
  { key: 'active', label: 'En cours' },
  { key: 'planned', label: 'En planification' },
  { key: 'done', label: 'Terminées' },
]

/** Missions de l’administration (maquette « Missions »). */
export default async function MissionsList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const tab = one(searchParams.vue)

  const all = await payload
    .find({ collection: 'missions', limit: 500, pagination: false, depth: 1, draft: true, overrideAccess: true })
    .then((r) => r.docs)
    .catch(() => [] as Mission[])

  const count = (key: string) =>
    !key ? all.length : ['quebec', 'canada', 'international'].includes(key) ? all.filter((m) => (m.scope ?? 'international') === key).length : all.filter((m) => (m.status ?? 'active') === key).length
  const zones = new Set(all.map((m) => m.zone.split(',').pop()!.trim().toLowerCase())).size
  const avgProgress = all.filter((m) => m.status === 'active').reduce((s, m, _, arr) => s + (m.progress ?? 0) / arr.length, 0)

  const filtered = all.filter((m) => {
    const inTab = !tab || m.scope === tab || (m.status ?? 'active') === tab || (tab === 'international' && !m.scope)
    const ministry = m.ministry && typeof m.ministry === 'object' ? (m.ministry as Ministry).name : ''
    return inTab && (!q || norm(`${m.project} ${m.zone} ${m.leader ?? ''} ${ministry} ${m.description ?? ''}`).includes(norm(q)))
  })
  const upcoming = all
    .filter((m) => m.status === 'planned')
    .sort((a, b) => (a.startDate ?? '9999').localeCompare(b.startDate ?? '9999'))
    .slice(0, 3)
  const href = (extra: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, vue: tab, ...extra })) if (v) params.set(k, v)
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Missions"
        title="Missions"
        text="Suivez et développez les missions de MKMI Québec au Québec, au Canada et dans le monde."
        actions={
          <>
            <a href="/missions" target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn--outline">
              <Icon name="globe" size={18} /> Voir la page publique
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Nouvelle mission
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="globe" label="Total des missions" value={all.length} extra={<span className="mk-kpi__sub">{all.filter((m) => m._status === 'published').length} publiées</span>} />
        <Kpi icon="pin" tone="green" label="Pays et régions" value={zones} extra={<span className="mk-kpi__sub">Zones d’action</span>} />
        <Kpi icon="target" tone="violet" label="En cours" value={count('active')} extra={<span className="mk-kpi__sub">Avancement moyen {Math.round(avgProgress)} %</span>} href={href({ vue: 'active' })} />
        <Kpi icon="calendar" tone="gold" label="En planification" value={count('planned')} extra={<span className="mk-kpi__sub">À venir</span>} href={href({ vue: 'planned' })} />
      </section>

      <div className="mk-split mk-split--wide">
        <section>
          <nav className="mk-tabs mk-tabs--pills" aria-label="Filtrer les missions">
            {tabs.map((t) => (
              <a key={t.key} href={href({ vue: t.key })} className={tab === t.key ? 'is-active' : undefined} aria-current={tab === t.key ? 'page' : undefined}>
                {t.label} <small>({count(t.key)})</small>
              </a>
            ))}
          </nav>
          <form action={BASE} className="mk-card mk-filters mk-filters--bar" style={{ marginBottom: 12 }}>
            {tab && <input type="hidden" name="vue" value={tab} />}
            <label className="mk-search">
              <Icon name="search" size={16} />
              <span className="sr-only">Rechercher une mission</span>
              <input type="search" name="q" defaultValue={q} placeholder="Rechercher une mission, un pays, un responsable…" />
            </label>
            <button type="submit" className="mk-btn mk-btn--navy">
              Rechercher
            </button>
          </form>

          {filtered.length === 0 ? (
            <div className="mk-card">
              <p className="mk-empty">
                {all.length === 0
                  ? 'Aucune mission enregistrée. Cliquez sur « Nouvelle mission » pour ajouter le premier projet ; tant qu’aucune mission n’est publiée, le site affiche les zones de la page d’accueil.'
                  : 'Aucune mission ne correspond à votre recherche.'}
              </p>
            </div>
          ) : (
            <ul className="mk-tiles mk-tiles--wide">
              {filtered.map((m) => {
                const photo = cover(m)
                const st = m.status ?? 'active'
                return (
                  <li key={m.id}>
                    <a href={`${BASE}/${m.id}`} className="mk-tile">
                      <span className="mk-tile__img" style={photo ? { backgroundImage: `url(${photo.sizes?.card?.url ?? photo.url})` } : undefined}>
                        <span className={`mk-status mk-status--${statusClass[st]} mk-tile__badge`}>{statusLabel[st]}</span>
                      </span>
                      <span className="mk-tile__body">
                        <span className="mk-kpi__sub">
                          <Icon name="pin" size={13} /> {m.zone}
                        </span>
                        <strong>{m.project}</strong>
                        <span className="mk-kpi__sub">
                          <Icon name="calendar" size={13} /> {period(m)}
                        </span>
                        <span className="mk-tile__text">{m.description || 'Ajoutez une courte description.'}</span>
                        <span className="mk-progress">
                          <span className="mk-progress__bar">
                            <span style={{ width: `${m.progress ?? 0}%` }} />
                          </span>
                          <span className="mk-kpi__sub">{m.progress ?? 0} % · {m.leader || 'Responsable à désigner'}</span>
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
            <h2 className="mk-side__title">Répartition</h2>
            <div className="mk-mini-stats">
              {[
                { k: 'quebec', label: 'Québec', tone: 'blue' },
                { k: 'canada', label: 'Canada', tone: 'red' },
                { k: 'international', label: 'International', tone: 'green' },
                { k: 'planned', label: 'En planification', tone: 'gold' },
              ].map((s) => (
                <a key={s.k} href={href({ vue: s.k })} className={`mk-mini mk-mini--${s.tone}`}>
                  <strong>{count(s.k)}</strong>
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Prochaines missions</h2>
            {upcoming.length === 0 ? (
              <p className="mk-empty">Aucune mission en planification.</p>
            ) : (
              <ul className="mk-events">
                {upcoming.map((m) => {
                  const photo = cover(m)
                  return (
                    <li key={m.id}>
                      <span className="mk-events__thumb mk-events__thumb--sm" style={photo ? { backgroundImage: `url(${photo.sizes?.card?.url ?? photo.url})` } : undefined} />
                      <a href={`${BASE}/${m.id}`} className="mk-events__body">
                        <strong>{m.project}</strong>
                        <span>
                          <Icon name="calendar" size={14} /> {period(m)}
                        </span>
                        <span>
                          <Icon name="pin" size={14} /> {m.zone}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>

      {filtered.length > 0 && (
        <section className="mk-card mk-table-card">
          <div className="mk-toolbar">
            <h2 className="mk-side__title" style={{ margin: 0 }}>
              Liste des missions
            </h2>
          </div>
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Zone</th>
                  <th>Ministère</th>
                  <th>Responsable</th>
                  <th>Période</th>
                  <th>Statut</th>
                  <th>Avancement</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const st = m.status ?? 'active'
                  return (
                    <tr key={m.id}>
                      <td>
                        <a href={`${BASE}/${m.id}`}>
                          <strong>{m.project}</strong>
                        </a>
                        <div className="mk-kpi__sub">{scopeLabel[m.scope ?? 'international']}</div>
                      </td>
                      <td>{m.zone}</td>
                      <td>{m.ministry && typeof m.ministry === 'object' ? (m.ministry as Ministry).name : '—'}</td>
                      <td>{m.leader || <span className="mk-kpi__sub">À désigner</span>}</td>
                      <td className="mk-meta">
                        <span>{period(m)}</span>
                      </td>
                      <td>
                        <span className={`mk-status mk-status--${statusClass[st]}`}>{statusLabel[st]}</span>
                      </td>
                      <td>
                        <span className="mk-progress">
                          <strong>{m.progress ?? 0} %</strong>
                          <span className="mk-progress__bar">
                            <span style={{ width: `${m.progress ?? 0}%` }} />
                          </span>
                        </span>
                      </td>
                      <td className="mk-row-actions">
                        <a href={`${BASE}/${m.id}`} className="mk-btn mk-btn--ghost">
                          Modifier
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
