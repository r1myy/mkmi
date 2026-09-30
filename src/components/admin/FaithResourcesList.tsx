import type { Payload } from 'payload'
import React from 'react'

import { faithLevels, faithThemes, faithTypes } from '@/collections/FaithResources'
import { youtubeThumb } from '@/lib/sermons'
import type { FaithResource, Media } from '@/payload-types'
import './dashboard.scss'
import { Icon, type IconName, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/faith-resources'
const PER_PAGE = 9
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const label = (list: readonly { label: string; value: string }[], v?: string | null) => list.find((o) => o.value === v)?.label ?? '—'
const day = (iso: string) => new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
const fmt = (n: number) => new Intl.NumberFormat('fr-CA').format(n)
const thumbOf = (r: FaithResource) => {
  const m = r.cover && typeof r.cover === 'object' ? (r.cover as Media) : null
  return m ? (m.sizes?.card?.url ?? m.url) : youtubeThumb(r)
}
const typeIcon: Record<string, IconName> = { article: 'file', video: 'play', guide: 'target', serie: 'folder', parcours: 'globe' }
const plural: Record<string, string> = { article: 'Articles', video: 'Vidéos', guide: 'Guides', serie: 'Séries', parcours: 'Parcours' }
const typeTone: Record<string, string> = { article: 'green', video: 'red', guide: 'violet', serie: 'gold', parcours: 'blue' }

/** « Découvrir la foi » dans l’administration (maquette « Découvrir la foi »). */
export default async function FaithResourcesList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const type = one(searchParams.type)
  const theme = one(searchParams.theme)
  const level = one(searchParams.niveau)
  const year = one(searchParams.annee)
  const sort = one(searchParams.tri) === 'anciens' ? 'anciens' : 'recents'
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const [all, views] = await Promise.all([
    payload
      .find({ collection: 'faith-resources', sort: '-publishedAt', limit: 5000, pagination: false, depth: 1, draft: true, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as FaithResource[]),
    payload
      .find({ collection: 'page-views', where: { path: { like: '/decouvrir/foi/' } }, limit: 50000, pagination: false, depth: 0, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as { path: string; count: number }[]),
  ])
  const viewsBySlug = new Map<string, number>()
  for (const v of views) {
    const m = /^\/decouvrir\/foi\/([^/]+)$/.exec(v.path)
    if (m) viewsBySlug.set(m[1], (viewsBySlug.get(m[1]) ?? 0) + v.count)
  }

  const years = [...new Set(all.map((r) => r.publishedAt.slice(0, 4)))].sort().reverse()
  const filtered = all
    .filter(
      (r) =>
        (!type || r.type === type) &&
        (!theme || r.theme === theme) &&
        (!level || r.level === level) &&
        (!year || r.publishedAt.startsWith(year)) &&
        (!q || norm(`${r.title} ${r.summary ?? ''} ${r.author ?? ''}`).includes(norm(q))),
    )
    .sort((a, b) => (sort === 'anciens' ? a.publishedAt.localeCompare(b.publishedAt) : b.publishedAt.localeCompare(a.publishedAt)))
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, type, theme, niveau: level, annee: year, tri: sort === 'anciens' ? 'anciens' : undefined, ...extra }))
      if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }
  const recent = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4)

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Découvrir la foi"
        title="Découvrir la foi"
        text="Gérez les ressources, articles et contenus qui aident à connaître Dieu, comprendre la Bible et grandir dans la foi."
        actions={
          <>
            <a href="/decouvrir/foi" target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn--outline">
              <Icon name="external" size={18} /> Voir la page publique
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Ajouter une ressource
            </a>
          </>
        }
      />

      <section className="mk-minikpis">
        <a href={href({ type: undefined, p: undefined })} className="mk-card">
          <span className="mk-minikpis__icon mk-tone-blue">
            <Icon name="clipboard" size={22} />
          </span>
          <span>
            <strong>{all.length}</strong>
            <span className="mk-kpi__sub">Ressources totales</span>
          </span>
        </a>
        {faithTypes.map((t) => (
          <a key={t.value} href={href({ type: t.value, p: undefined })} className="mk-card">
            <span className={`mk-minikpis__icon mk-tone-${typeTone[t.value]}`}>
              <Icon name={typeIcon[t.value]} size={22} />
            </span>
            <span>
              <strong>{all.filter((r) => r.type === t.value).length}</strong>
              <span className="mk-kpi__sub">{plural[t.value]}</span>
            </span>
          </a>
        ))}
      </section>

      <nav className="mk-tabs mk-tabs--pills" aria-label="Type de ressource">
        <a href={href({ type: undefined, p: undefined })} className={!type ? 'is-active' : undefined}>
          Tous ({all.length})
        </a>
        {faithTypes.map((t) => (
          <a key={t.value} href={href({ type: t.value, p: undefined })} className={type === t.value ? 'is-active' : undefined}>
            <Icon name={typeIcon[t.value]} size={15} /> {plural[t.value]} ({all.filter((r) => r.type === t.value).length})
          </a>
        ))}
      </nav>

      <div className="mk-split mk-split--msg">
        <section className="mk-card">
          <form action={BASE} className="mk-filters" style={{ marginBottom: 16 }}>
            {type && <input type="hidden" name="type" value={type} />}
            <select name="theme" defaultValue={theme} aria-label="Catégorie">
              <option value="">Toutes les catégories</option>
              {faithThemes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select name="annee" defaultValue={year} aria-label="Année">
              <option value="">Toutes les années</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
            <select name="niveau" defaultValue={level} aria-label="Niveau">
              <option value="">Tous les niveaux</option>
              {faithLevels.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <select name="tri" defaultValue={sort} aria-label="Trier">
              <option value="recents">Trier par : plus récents</option>
              <option value="anciens">Trier par : plus anciens</option>
            </select>
            <button type="submit" className="mk-btn mk-btn--navy">
              <Icon name="filter" size={16} /> Filtrer
            </button>
          </form>

          {rows.length === 0 ? (
            <p className="mk-empty">
              {all.length === 0
                ? 'Aucune ressource pour l’instant. Cliquez sur « Ajouter une ressource » pour publier un premier article, une vidéo ou un guide.'
                : 'Aucune ressource ne correspond à ces filtres.'}
            </p>
          ) : (
            <ul className="mk-scards">
              {rows.map((r) => {
                const t = thumbOf(r)
                return (
                  <li key={r.id} className="mk-scard">
                    <a href={`${BASE}/${r.id}`} className="mk-scard__img" style={t ? { backgroundImage: `url(${t})` } : undefined} aria-label={`Modifier « ${r.title} »`}>
                      <span className="mk-tag mk-tile__badge">{label(faithTypes, r.type)}</span>
                      {r.duration && <span className="mk-duration">{r.duration}</span>}
                      {r.featured && <span className="mk-star is-on mk-tile__star">★</span>}
                      {r._status !== 'published' && <span className="mk-status mk-status--draft mk-scard__draft">Brouillon</span>}
                    </a>
                    <div className="mk-scard__body">
                      <a href={`${BASE}/${r.id}`} className="mk-scard__title">
                        {r.title}
                      </a>
                      {r.summary && <span className="mk-kpi__sub mk-ellipsis">{r.summary}</span>}
                      <span className="mk-kpi__sub">
                        {r.author ? `${r.author} · ` : ''}
                        {day(r.publishedAt)}
                      </span>
                      <span className="mk-scard__foot">
                        <span className="mk-scard__stats">
                          <span title="Vues sur le site">
                            <Icon name="eye" size={14} /> {fmt(viewsBySlug.get(String(r.slug ?? r.id)) ?? 0)}
                          </span>
                          <span>
                            <Icon name="tag" size={14} /> {label(faithThemes, r.theme)}
                          </span>
                        </span>
                        <details className="mk-menu mk-scard__menu">
                          <summary className="mk-icon-btn" aria-label={`Actions pour « ${r.title} »`}>
                            <Icon name="more" size={18} />
                          </summary>
                          <div className="mk-menu__list">
                            <a href={`${BASE}/${r.id}`}>Modifier</a>
                            <a href={`/decouvrir/foi/${r.slug ?? r.id}`} target="_blank" rel="noopener noreferrer">
                              Voir sur le site
                            </a>
                          </div>
                        </details>
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <footer className="mk-pager">
            <span>
              {filtered.length
                ? `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} ressources`
                : 'Aucun résultat'}
            </span>
            {pages > 1 && (
              <nav aria-label="Pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a key={n} href={href({ p: n })} className={n === current ? 'is-active' : undefined}>
                    {n}
                  </a>
                ))}
              </nav>
            )}
          </footer>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Recherche rapide</h2>
            <form action={BASE} className="mk-filters">
              <label className="mk-search" style={{ flex: 1 }}>
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher une ressource</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher une ressource…" />
              </label>
            </form>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Catégories</h2>
            <ul className="mk-cats">
              <li className={!theme ? 'is-active' : undefined}>
                <a href={href({ theme: undefined, p: undefined })}>
                  <Icon name="folder" size={16} /> Toutes les catégories
                </a>
                <span>{all.length}</span>
              </li>
              {faithThemes.map((t) => (
                <li key={t.value} className={theme === t.value ? 'is-active' : undefined}>
                  <a href={href({ theme: t.value, p: undefined })}>
                    <Icon name="folder" size={16} /> {t.label}
                  </a>
                  <span>{all.filter((r) => r.theme === t.value).length}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Niveaux</h2>
            <ul className="mk-cats">
              {faithLevels.map((l) => (
                <li key={l.value} className={level === l.value ? 'is-active' : undefined}>
                  <a href={href({ niveau: l.value, p: undefined })}>
                    <Icon name="target" size={16} /> {l.label}
                  </a>
                  <span>{all.filter((r) => r.level === l.value).length}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Activité récente</h2>
            {recent.length === 0 ? (
              <p className="mk-empty">Rien pour l’instant.</p>
            ) : (
              <ul className="mk-events">
                {recent.map((r) => {
                  const t = thumbOf(r)
                  return (
                    <li key={r.id}>
                      <span className="mk-events__thumb mk-events__thumb--sm" style={t ? { backgroundImage: `url(${t})` } : undefined} />
                      <a href={`${BASE}/${r.id}`} className="mk-events__body">
                        <strong>{r.title}</strong>
                        <span>
                          {r._status === 'published' ? 'Publiée' : 'Modifiée'} le {day(r.updatedAt)}
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
    </div>
  )
}
