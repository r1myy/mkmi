import type { Payload } from 'payload'
import React from 'react'

import { announcementCategories } from '@/collections/Announcements'
import type { Announcement, Media } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/announcements'
const PER_PAGE = 10
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const catLabel = (v?: string | null) => announcementCategories.find((c) => c.value === v)?.label ?? '—'
const when = (iso: string) => new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Toronto' }).format(new Date(iso))

type View = 'draft' | 'pending' | 'scheduled' | 'published' | 'archived'
const viewOf = (a: Announcement, now: number): View => {
  const s = a.status ?? 'draft'
  if (s === 'published' && new Date(a.publishAt).getTime() > now) return 'scheduled'
  return s as View
}
const viewLabel: Record<View, string> = { draft: 'Brouillon', pending: 'En attente', scheduled: 'Planifiée', published: 'Publiée', archived: 'Archivée' }
const viewClass: Record<View, string> = { draft: 'draft', pending: 'live', scheduled: 'scheduled', published: 'upcoming', archived: 'past' }
const cover = (a: Announcement) => (a.image && typeof a.image === 'object' ? (a.image as Media) : null)

/** Annonces de l’administration (maquette « Annonces »). */
export default async function AnnouncementsList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const tab = one(searchParams.statut) as '' | View
  const cat = one(searchParams.categorie)
  const page = Math.max(1, Number(one(searchParams.p)) || 1)
  const now = new Date().getTime()

  const all = await payload
    .find({ collection: 'announcements', sort: '-publishAt', limit: 2000, pagination: false, depth: 1, overrideAccess: true })
    .then((r) => r.docs)
    .catch(() => [] as Announcement[])

  const count = (v: View) => all.filter((a) => viewOf(a, now) === v).length
  const featured = all.find((a) => a.featured && viewOf(a, now) === 'published') ?? all.find((a) => viewOf(a, now) === 'published')
  const filtered = all.filter(
    (a) => (!tab || viewOf(a, now) === tab) && (!cat || a.category === cat) && (!q || norm(`${a.title} ${a.summary}`).includes(norm(q))),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, statut: tab, categorie: cat, ...extra })) if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }
  const tabs: { key: '' | View; label: string }[] = [
    { key: '', label: `Toutes (${all.length})` },
    { key: 'published', label: `Publiées (${count('published')})` },
    { key: 'pending', label: `En attente (${count('pending')})` },
    { key: 'scheduled', label: `Planifiées (${count('scheduled')})` },
    { key: 'draft', label: `Brouillons (${count('draft')})` },
    { key: 'archived', label: `Archivées (${count('archived')})` },
  ]
  const featuredImg = featured ? cover(featured) : null

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Annonces"
        title="Annonces"
        text="Créez et gérez les annonces importantes pour informer la communauté. L’annonce « À la une » s’affiche en bandeau sur la page d’accueil."
        actions={
          <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
            <Icon name="plus" size={18} /> Nouvelle annonce
          </a>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="megaphone" label="Total des annonces" value={all.length} />
        <Kpi icon="check" tone="green" label="Publiées" value={count('published')} extra={<span className="mk-kpi__sub">Visibles sur le site</span>} href={href({ statut: 'published', p: undefined })} />
        <Kpi icon="clock" tone="violet" label="En attente" value={count('pending')} extra={<span className="mk-kpi__sub">À valider</span>} href={href({ statut: 'pending', p: undefined })} />
        <Kpi icon="calendar" tone="gold" label="Planifiées" value={count('scheduled')} extra={<span className="mk-kpi__sub">Publication à venir</span>} href={href({ statut: 'scheduled', p: undefined })} />
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-card mk-table-card">
          <div className="mk-toolbar">
            <nav className="mk-tabs" aria-label="Statut">
              {tabs.map((t) => (
                <a key={t.key} href={href({ statut: t.key, p: undefined })} className={tab === t.key ? 'is-active' : undefined}>
                  {t.label}
                </a>
              ))}
            </nav>
            <form action={BASE} className="mk-filters">
              {tab && <input type="hidden" name="statut" value={tab} />}
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher une annonce</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher une annonce…" />
              </label>
              <select name="categorie" defaultValue={cat} aria-label="Catégorie">
                <option value="">Toutes les catégories</option>
                {announcementCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
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
                  <th>Titre</th>
                  <th>Catégorie</th>
                  <th>Statut</th>
                  <th>Date de publication</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="mk-empty">
                      {all.length === 0 ? 'Aucune annonce. Cliquez sur « Nouvelle annonce » pour informer la communauté.' : 'Aucune annonce dans cette vue.'}
                    </td>
                  </tr>
                )}
                {rows.map((a) => {
                  const v = viewOf(a, now)
                  const img = cover(a)
                  return (
                    <tr key={a.id}>
                      <td>
                        <a href={`${BASE}/${a.id}`} className="mk-event-cell">
                          <span className="mk-thumb" style={img ? { backgroundImage: `url(${img.sizes?.card?.url ?? img.url})` } : undefined} />
                          <span>
                            <strong>
                              {a.title} {a.featured && <em className="mk-tag mk-tag--gold">À la une</em>}
                            </strong>
                            <span className="mk-clamp">{a.summary}</span>
                          </span>
                        </a>
                      </td>
                      <td>
                        <span className="mk-tag mk-tag--violet">{catLabel(a.category)}</span>
                      </td>
                      <td>
                        <span className={`mk-status mk-status--${viewClass[v]}`}>{viewLabel[v]}</span>
                      </td>
                      <td className="mk-meta">
                        <span>{when(a.publishAt)}</span>
                      </td>
                      <td className="mk-row-actions">
                        <a href={`${BASE}/${a.id}`} className="mk-btn mk-btn--ghost">
                          Modifier
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <footer className="mk-pager">
            <span>{filtered.length ? `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} annonces` : 'Aucun résultat'}</span>
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
            <div className="mk-card__head">
              <h2>Annonce en vedette</h2>
              {featured && (
                <a href={`${BASE}/${featured.id}`} className="mk-link">
                  Modifier
                </a>
              )}
            </div>
            {featured ? (
              <div className="mk-feature" style={featuredImg ? { backgroundImage: `linear-gradient(90deg, rgba(7,15,29,.92), rgba(7,15,29,.45)), url(${featuredImg.sizes?.card?.url ?? featuredImg.url})` } : undefined}>
                <strong>{featured.title}</strong>
                <span>{featured.summary}</span>
                {!featured.featured && <em className="mk-kpi__sub">Cochez « À la une » pour l’afficher sur l’accueil.</em>}
              </div>
            ) : (
              <p className="mk-empty">Aucune annonce publiée.</p>
            )}
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href={`${BASE}/create`} className="mk-tone-blue">
                <Icon name="megaphone" size={20} /> Créer une annonce
              </a>
              <a href={href({ statut: 'pending', p: undefined })} className="mk-tone-violet">
                <Icon name="clock" size={20} /> Annonces à valider
              </a>
              <a href="/admin/collections/events/create" className="mk-tone-green">
                <Icon name="calendar" size={20} /> Créer un événement
              </a>
              <a href="/" target="_blank" rel="noopener noreferrer" className="mk-tone-gold">
                <Icon name="external" size={20} /> Voir l’accueil
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
