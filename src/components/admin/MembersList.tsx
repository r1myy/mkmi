import type { Payload } from 'payload'
import React from 'react'

import { memberCategories } from '@/collections/Members'
import type { Member, Ministry } from '@/payload-types'
import './dashboard.scss'
import { Donut, Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; user?: { role?: string } | null; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/members'
const PER_PAGE = 12
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const catLabel = (v?: string | null) => memberCategories.find((c) => c.value === v)?.label ?? '—'
const catTone: Record<string, string> = { jeunesse: 'blue', adulte: 'green', famille: 'gold', aine: 'violet' }
const statusLabel: Record<string, string> = { active: 'Actif', pending: 'En attente', inactive: 'Inactif' }
const statusClass: Record<string, string> = { active: 'upcoming', pending: 'live', inactive: 'past' }
const shortDate = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso)).replace('.', '') : '—'

/** Registre des membres (maquette « Membres »). Réservé aux administrateurs et à l’équipe pastorale. */
export default async function MembersList({ payload, user, searchParams = {} }: Props) {
  if (!user || !['admin', 'pastoral'].includes(user.role ?? '')) {
    return (
      <div className="mk-dash mk-screen">
        <p className="mk-empty">Le registre des membres est réservé aux administrateurs et à l’équipe pastorale.</p>
      </div>
    )
  }
  const q = one(searchParams.q)
  const status = one(searchParams.statut)
  const cat = one(searchParams.categorie)
  const ministry = Number(one(searchParams.ministere)) || 0
  const page = Math.max(1, Number(one(searchParams.p)) || 1)
  const now = new Date().getTime()

  const [all, ministries] = await Promise.all([
    payload
      .find({ collection: 'members', sort: 'name', limit: 10000, pagination: false, depth: 1, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as Member[]),
    payload
      .find({ collection: 'ministries', sort: 'order', limit: 200, pagination: false, depth: 0, draft: true, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as Ministry[]),
  ])
  const mins = (m: Member) => (m.ministries ?? []).filter((x): x is Ministry => typeof x === 'object' && x !== null)
  const count = (s: string) => all.filter((m) => (m.status ?? 'active') === s).length
  const fresh = all.filter((m) => m.joinedAt && now - new Date(m.joinedAt).getTime() < 30 * 86400000).length
  const involved = all.filter((m) => mins(m).length > 0).length

  const filtered = all.filter(
    (m) =>
      (!status || (m.status ?? 'active') === status) &&
      (!cat || m.category === cat) &&
      (!ministry || mins(m).some((x) => x.id === ministry)) &&
      (!q || norm(`${m.name} ${m.email ?? ''} ${m.phone ?? ''}`).includes(norm(q))),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, statut: status, categorie: cat, ministere: ministry || undefined, ...extra })) if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Membres"
        title="Membres"
        text="Gérez les membres de MKMI Québec, leurs coordonnées et leur implication dans la communauté."
        actions={
          <a href={`${BASE}/create`} className="mk-btn mk-btn--navy">
            <Icon name="plus" size={18} /> Ajouter un membre
          </a>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="users" label="Total des membres" value={all.length} />
        <Kpi icon="plus" tone="green" label="Nouveaux membres" value={fresh} extra={<span className="mk-kpi__sub">Ces 30 derniers jours</span>} />
        <Kpi icon="heart" tone="gold" label="Impliqués dans un ministère" value={involved} extra={<span className="mk-kpi__sub">{all.length ? Math.round((involved / all.length) * 100) : 0} % des membres</span>} />
        <Kpi icon="clock" tone="violet" label="En attente" value={count('pending')} extra={<span className="mk-kpi__sub">À accueillir</span>} href={href({ statut: 'pending', p: undefined })} />
      </section>

      <form action={BASE} className="mk-card mk-filters mk-filters--bar">
        <label className="mk-search">
          <Icon name="search" size={16} />
          <span className="sr-only">Rechercher un membre</span>
          <input type="search" name="q" defaultValue={q} placeholder="Rechercher un membre par nom, courriel ou téléphone…" />
        </label>
        <select name="statut" defaultValue={status} aria-label="Statut">
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabel).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
        <select name="categorie" defaultValue={cat} aria-label="Groupe d’âge">
          <option value="">Tous les groupes d’âge</option>
          {memberCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select name="ministere" defaultValue={ministry ? String(ministry) : ''} aria-label="Ministère">
          <option value="">Tous les ministères</option>
          {ministries.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <button type="submit" className="mk-btn mk-btn--navy">
          Filtrer
        </button>
        <a href={BASE} className="mk-btn mk-btn--outline">
          <Icon name="refresh" size={16} /> Réinitialiser
        </a>
      </form>

      <div className="mk-split mk-split--wide">
        <section className="mk-card mk-table-card">
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Contact</th>
                  <th>Catégorie</th>
                  <th>Ministères</th>
                  <th>Statut</th>
                  <th>Membre depuis</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="mk-empty">
                      {all.length === 0
                        ? 'Aucun membre inscrit. Cliquez sur « Ajouter un membre » (avec l’accord de la personne).'
                        : 'Aucun membre ne correspond à votre recherche.'}
                    </td>
                  </tr>
                )}
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <a href={`${BASE}/${m.id}`} className="mk-person">
                        <span className="mk-avatar">{m.name.slice(0, 1).toUpperCase()}</span>
                        <span>
                          <strong>{m.name}</strong>
                          <span>{m.email || '—'}</span>
                        </span>
                      </a>
                    </td>
                    <td className="mk-meta">
                      <span>{m.phone ? <><Icon name="phone" size={14} /> {m.phone}</> : '—'}</span>
                    </td>
                    <td>
                      <span className={`mk-tag mk-tag--${catTone[m.category ?? 'adulte']}`}>{catLabel(m.category)}</span>
                    </td>
                    <td>
                      <span className="mk-tags">
                        {mins(m).slice(0, 2).map((x) => (
                          <em key={x.id} className="mk-tag">
                            {x.name}
                          </em>
                        ))}
                        {mins(m).length > 2 && <em className="mk-tag">+{mins(m).length - 2}</em>}
                      </span>
                    </td>
                    <td>
                      <span className={`mk-status mk-status--${statusClass[m.status ?? 'active']}`}>{statusLabel[m.status ?? 'active']}</span>
                    </td>
                    <td className="mk-meta">
                      <span>{shortDate(m.joinedAt)}</span>
                    </td>
                    <td className="mk-row-actions">
                      <a href={`${BASE}/${m.id}`} className="mk-btn mk-btn--ghost">
                        Modifier
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="mk-pager">
            <span>{filtered.length ? `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} membres` : 'Aucun résultat'}</span>
            {pages > 1 && (
              <nav aria-label="Pagination">
                <a href={href({ p: Math.max(1, current - 1) })} aria-label="Page précédente" className="mk-icon-btn">
                  <Icon name="left" size={16} />
                </a>
                <a href={href({ p: Math.min(pages, current + 1) })} aria-label="Page suivante" className="mk-icon-btn">
                  <Icon name="right" size={16} />
                </a>
              </nav>
            )}
          </footer>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Répartition des membres</h2>
            {all.length ? (
              <Donut
                total={all.length}
                caption="membres"
                colors={['#1d4fa3', '#1f9d63', '#f5bf4f', '#7b5cd6']}
                parts={memberCategories.map((c) => ({ label: c.label, value: all.filter((m) => m.category === c.value).length }))}
              />
            ) : (
              <p className="mk-empty">La répartition apparaîtra avec les premiers membres.</p>
            )}
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Confidentialité</h2>
            <ul className="mk-contact">
              <li>
                <Icon name="lock" size={16} /> Visible seulement par les administrateurs et l’équipe pastorale.
              </li>
              <li>
                <Icon name="check" size={16} /> Accord de la personne obligatoire pour l’inscrire (Loi 25).
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
