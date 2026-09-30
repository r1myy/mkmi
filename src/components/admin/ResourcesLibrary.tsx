import type { Payload } from 'payload'
import React from 'react'

import { folderOptions } from '@/fields/folder'
import type { Document, Link } from '@/payload-types'
import './dashboard.scss'
import { fileSize } from './MediaLibrary'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/documents'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const folderLabel = (v?: string | null) => folderOptions.find((f) => f.value === v)?.label ?? 'Autres'
const shortDate = (iso: string) => new Intl.DateTimeFormat('fr-CA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso)).replace('.', '')
const typeOf = (d: Document) => {
  const m = d.mimeType ?? ''
  if (m.includes('pdf')) return { label: 'PDF', tone: 'red' }
  if (m.includes('word')) return { label: 'Document', tone: 'blue' }
  if (m.includes('sheet') || m.includes('excel') || m.includes('csv')) return { label: 'Tableau', tone: 'green' }
  if (m.includes('presentation') || m.includes('powerpoint')) return { label: 'Présentation', tone: 'gold' }
  if (m.startsWith('image/')) return { label: 'Image', tone: 'violet' }
  return { label: 'Fichier', tone: 'blue' }
}
const folderColors = ['#1d4fa3', '#f5bf4f', '#e0477a', '#1f9d63', '#7b5cd6', '#f08a24', '#0b1628', '#2bb5c8', '#7c8db0']

/** Documents internes et liens utiles (maquette « Ressources »). */
export default async function ResourcesLibrary({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const folder = one(searchParams.dossier)

  const [docs, links, mediaCount] = await Promise.all([
    payload
      .find({ collection: 'documents', sort: '-updatedAt', limit: 5000, pagination: false, depth: 0, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as Document[]),
    payload
      .find({ collection: 'links', sort: '-updatedAt', limit: 500, pagination: false, depth: 0, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as Link[]),
    payload
      .count({ collection: 'media', overrideAccess: true })
      .then((r) => r.totalDocs)
      .catch(() => 0),
  ])

  const now = new Date().getTime()
  const bytes = docs.reduce((s, d) => s + (d.filesize ?? 0), 0)
  const recent = docs.filter((d) => now - new Date(d.createdAt).getTime() < 30 * 86400000).length
  const folders = folderOptions.map((f, i) => ({
    ...f,
    color: folderColors[i % folderColors.length],
    n: docs.filter((d) => (d.folder ?? 'site') === f.value).length + links.filter((l) => (l.folder ?? 'site') === f.value).length,
  }))
  const filtered = docs.filter((d) => (!folder || (d.folder ?? 'site') === folder) && (!q || norm(`${d.title} ${d.description ?? ''} ${d.filename ?? ''}`).includes(norm(q))))
  const filteredLinks = links.filter((l) => (!folder || (l.folder ?? 'site') === folder) && (!q || norm(`${l.title} ${l.description ?? ''} ${l.url}`).includes(norm(q))))

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Documents"
        title="Ressources"
        text="Centralisez les documents internes, modèles et liens utiles de l’équipe. Ces fichiers ne sont jamais publics."
        actions={
          <>
            <a href="/admin/collections/links/create" className="mk-btn mk-btn--outline">
              <Icon name="link" size={18} /> Ajouter un lien
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="upload" size={18} /> Importer un document
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="folder" tone="violet" label="Total des ressources" value={docs.length + links.length} extra={<span className="mk-kpi__sub">{recent} ajoutées ce mois-ci</span>} />
        <Kpi icon="file" tone="blue" label="Documents" value={docs.length} extra={<span className="mk-kpi__sub">{fileSize(bytes)}</span>} />
        <Kpi icon="link" tone="gold" label="Liens utiles" value={links.length} href="/admin/collections/links" />
        <Kpi icon="image" tone="green" label="Médias du site" value={mediaCount} extra={<span className="mk-kpi__sub">Photos et vidéos publiques</span>} href="/admin/collections/media" />
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-stack">
          <form action={BASE} className="mk-card mk-filters mk-filters--bar">
            <label className="mk-search">
              <Icon name="search" size={16} />
              <span className="sr-only">Rechercher une ressource</span>
              <input type="search" name="q" defaultValue={q} placeholder="Rechercher un document ou un lien…" />
            </label>
            <select name="dossier" defaultValue={folder} aria-label="Dossier">
              <option value="">Tous les dossiers</option>
              {folderOptions.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
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

          <div>
            <h2 className="mk-side__title">Dossiers</h2>
            <ul className="mk-folders">
              {folders.map((f) => (
                <li key={f.value}>
                  <a href={`${BASE}?dossier=${f.value}`} className={folder === f.value ? 'is-active' : undefined}>
                    <span className="mk-folder-icon" style={{ color: f.color }}>
                      <Icon name="folder" size={34} />
                    </span>
                    <strong>{f.label}</strong>
                    <span className="mk-kpi__sub">
                      {f.n} élément{f.n > 1 ? 's' : ''}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mk-card mk-table-card">
            <div className="mk-toolbar">
              <h2 className="mk-side__title" style={{ margin: 0 }}>
                {folder ? `Documents : ${folderLabel(folder)}` : 'Fichiers récents'}
              </h2>
            </div>
            <div className="mk-table-wrap">
              <table className="mk-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Dossier</th>
                    <th>Modifié le</th>
                    <th>Taille</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="mk-empty">
                        {docs.length === 0 ? 'Aucun document pour l’instant. Cliquez sur « Importer un document » (PDF, Word, Excel, PowerPoint…).' : 'Aucun document dans cette vue.'}
                      </td>
                    </tr>
                  )}
                  {filtered.map((d) => {
                    const t = typeOf(d)
                    return (
                      <tr key={d.id}>
                        <td>
                          <a href={`${BASE}/${d.id}`} className="mk-person">
                            <span className={`mk-file-icon mk-tag--${t.tone}`}>
                              <Icon name="file" size={18} />
                            </span>
                            <span>
                              <strong>{d.title}</strong>
                              <span>{d.filename}</span>
                            </span>
                          </a>
                        </td>
                        <td>
                          <span className={`mk-tag mk-tag--${t.tone}`}>{t.label}</span>
                        </td>
                        <td>
                          <span className="mk-tag">{folderLabel(d.folder)}</span>
                        </td>
                        <td className="mk-meta">
                          <span>{shortDate(d.updatedAt)}</span>
                        </td>
                        <td>{fileSize(d.filesize)}</td>
                        <td className="mk-row-actions">
                          {d.url && (
                            <a href={d.url} target="_blank" rel="noopener noreferrer" className="mk-icon-btn" aria-label={`Ouvrir ${d.title}`}>
                              <Icon name="eye" size={16} />
                            </a>
                          )}
                          <a href={`${BASE}/${d.id}`} className="mk-btn mk-btn--ghost">
                            Modifier
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <div className="mk-card__head">
              <h2>Liens utiles</h2>
              <a href="/admin/collections/links" className="mk-link">
                Gérer <Icon name="arrow" size={16} />
              </a>
            </div>
            {filteredLinks.length === 0 ? (
              <p className="mk-empty">Ajoutez les liens que l’équipe utilise souvent (formulaires, plateformes, outils).</p>
            ) : (
              <ul className="mk-contact">
                {filteredLinks.slice(0, 8).map((l) => (
                  <li key={l.id}>
                    <Icon name="link" size={16} />
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href={`${BASE}/create`} className="mk-tone-blue">
                <Icon name="upload" size={20} /> Importer des fichiers
              </a>
              <a href="/admin/collections/links/create" className="mk-tone-green">
                <Icon name="link" size={20} /> Partager un lien
              </a>
              <a href="/admin/collections/media" className="mk-tone-violet">
                <Icon name="image" size={20} /> Médias du site
              </a>
              <a href="/admin/collections/media/create" className="mk-tone-gold">
                <Icon name="plus" size={20} /> Ajouter une photo
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
