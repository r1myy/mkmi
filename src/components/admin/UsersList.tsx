import type { Payload } from 'payload'
import React from 'react'

import type { User } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; user?: { id?: number; role?: string } | null; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/users'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const roleLabel: Record<string, string> = { admin: 'Administrateur', editor: 'Éditeur', pastoral: 'Équipe pastorale' }
const roleTone: Record<string, string> = { admin: 'blue', editor: 'red', pastoral: 'gold' }
const rights: Record<string, string[]> = {
  admin: ['Accès complet', 'Utilisateurs et paramètres', 'Dons et finances', 'Messages et demandes de prière', 'Tous les contenus du site'],
  editor: ['Pages, événements, messages et ministères', 'Annonces, courriels et réseaux sociaux', 'Médias et documents', 'Inscriptions aux événements'],
  pastoral: ['Demandes de prière (confidentielles)', 'Messages reçus', 'Visites planifiées'],
}
const when = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Toronto' }).format(new Date(iso)) : 'Jamais'

/** Utilisateurs de l’administration (maquette « Utilisateurs »). */
export default async function UsersList({ payload, user, searchParams = {} }: Props) {
  const isAdmin = user?.role === 'admin'
  const q = one(searchParams.q)
  const tab = one(searchParams.statut)
  const role = one(searchParams.role)
  const now = new Date().getTime()

  const all = await payload
    .find({ collection: 'users', sort: 'name', limit: 1000, pagination: false, depth: 0, overrideAccess: false, user: user as never })
    .then((r) => r.docs)
    .catch(() => [] as User[])
  const inactive = (u: User) => u.active === false || !u.lastLoginAt || now - new Date(u.lastLoginAt).getTime() > 30 * 86400000
  const counts = {
    all: all.length,
    active: all.filter((u) => u.active !== false).length,
    suspended: all.filter((u) => u.active === false).length,
    idle: all.filter((u) => u.active !== false && inactive(u)).length,
    fresh: all.filter((u) => now - new Date(u.createdAt).getTime() < 30 * 86400000).length,
  }
  const filtered = all.filter(
    (u) =>
      (!tab || (tab === 'actifs' ? u.active !== false : tab === 'suspendus' ? u.active === false : u.active !== false && inactive(u))) &&
      (!role || u.role === role) &&
      (!q || norm(`${u.name ?? ''} ${u.email} ${u.title ?? ''}`).includes(norm(q))),
  )
  const tabs = [
    { key: '', label: `Tous (${counts.all})` },
    { key: 'actifs', label: `Actifs (${counts.active})` },
    { key: 'inactifs', label: `Sans connexion depuis 30 j (${counts.idle})` },
    { key: 'suspendus', label: `Suspendus (${counts.suspended})` },
  ]

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Utilisateurs"
        title="Utilisateurs"
        text="Gérez les personnes qui ont accès à l’administration, leur rôle et leur accès."
        actions={
          isAdmin ? (
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Nouvel utilisateur
            </a>
          ) : undefined
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="users" label="Total des utilisateurs" value={counts.all} />
        <Kpi icon="check" tone="green" label="Comptes actifs" value={counts.active} />
        <Kpi icon="clock" tone="gold" label="Sans connexion (30 j)" value={counts.idle} />
        <Kpi icon="plus" tone="violet" label="Nouveaux (30 j)" value={counts.fresh} />
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-card mk-table-card">
          <div className="mk-toolbar">
            <nav className="mk-tabs" aria-label="Statut">
              {tabs.map((t) => (
                <a key={t.key} href={`${BASE}${t.key ? `?statut=${t.key}` : ''}`} className={tab === t.key ? 'is-active' : undefined}>
                  {t.label}
                </a>
              ))}
            </nav>
            <form action={BASE} className="mk-filters">
              {tab && <input type="hidden" name="statut" value={tab} />}
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher un utilisateur</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher un utilisateur…" />
              </label>
              <select name="role" defaultValue={role} aria-label="Rôle">
                <option value="">Tous les rôles</option>
                {Object.entries(roleLabel).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
              <button type="submit" className="mk-btn mk-btn--navy">
                Filtrer
              </button>
            </form>
          </div>
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Courriel</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Dernière connexion</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="mk-empty">
                      Aucun utilisateur ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => {
                  const suspended = u.active === false
                  return (
                    <tr key={u.id}>
                      <td>
                        <a href={`${BASE}/${u.id}`} className="mk-person">
                          <span className="mk-avatar">{(u.name || u.email).slice(0, 1).toUpperCase()}</span>
                          <span>
                            <strong>{u.name || 'Sans nom'}</strong>
                            <span>{u.title || '—'}</span>
                          </span>
                        </a>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`mk-tag mk-tag--${roleTone[u.role]}`}>{roleLabel[u.role]}</span>
                      </td>
                      <td>
                        <span className={`mk-status mk-status--${suspended ? 'cancelled' : 'upcoming'}`}>{suspended ? 'Suspendu' : 'Actif'}</span>
                      </td>
                      <td className="mk-meta">
                        <span>{when(u.lastLoginAt)}</span>
                      </td>
                      <td className="mk-row-actions">
                        <a href={`${BASE}/${u.id}`} className="mk-btn mk-btn--ghost">
                          {isAdmin || u.id === user?.id ? 'Modifier' : 'Voir'}
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Rôles et permissions</h2>
            <div className="mk-roles">
              {Object.entries(rights).map(([r, list]) => (
                <div key={r}>
                  <span className={`mk-tag mk-tag--${roleTone[r]}`}>
                    {roleLabel[r]} ({all.filter((u) => u.role === r).length})
                  </span>
                  <ul>
                    {list.map((x) => (
                      <li key={x}>
                        <Icon name="check" size={14} /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Bon à savoir</h2>
            <ul className="mk-contact">
              <li>
                <Icon name="lock" size={16} /> Compte bloqué 15 minutes après 5 mots de passe erronés.
              </li>
              <li>
                <Icon name="x" size={16} /> Décochez « Compte actif » pour suspendre un accès sans supprimer le compte.
              </li>
              <li>
                <Icon name="mail" size={16} /> « Mot de passe oublié » sur la page de connexion, une fois l’envoi de courriels branché.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
