import type { Payload } from 'payload'
import React from 'react'

import { folderOptions } from '@/fields/folder'
import type { Media } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/media'
const PER_PAGE = 16
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
export const fileSize = (bytes?: number | null) => {
  if (!bytes) return '—'
  const units = ['o', 'Ko', 'Mo', 'Go']
  let v = bytes,
    i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0).replace('.', ',')} ${units[i]}`
}
const kind = (m: Media) =>
  m.mimeType?.startsWith('image/') ? 'photo' : m.mimeType?.startsWith('video/') ? 'video' : m.mimeType?.startsWith('audio/') ? 'audio' : 'document'
const kindLabel: Record<string, string> = { photo: 'Photo', video: 'Vidéo', audio: 'Audio', document: 'Document' }
const folderLabel = (v?: string | null) => folderOptions.find((f) => f.value === v)?.label ?? 'Site web'
const shortDate = (iso: string) => new Intl.DateTimeFormat('fr-CA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso)).replace('.', '')

/** Médiathèque de l’administration (maquette « Contenus »). */
export default async function MediaLibrary({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const tab = one(searchParams.type)
  const folder = one(searchParams.dossier)
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const all = await payload
    .find({ collection: 'media', sort: '-createdAt', limit: 5000, pagination: false, depth: 0, overrideAccess: true })
    .then((r) => r.docs)
    .catch(() => [] as Media[])

  const now = new Date().getTime()
  const counts = { photo: 0, video: 0, audio: 0, document: 0 } as Record<string, number>
  let bytes = 0
  const bytesBy = { photo: 0, video: 0, audio: 0, document: 0 } as Record<string, number>
  for (const m of all) {
    const k = kind(m)
    counts[k]++
    bytes += m.filesize ?? 0
    bytesBy[k] += m.filesize ?? 0
  }
  const recent = all.filter((m) => now - new Date(m.createdAt).getTime() < 30 * 86400000).length
  const byFolder = folderOptions.map((f) => ({ ...f, n: all.filter((m) => (m.folder ?? 'site') === f.value).length })).filter((f) => f.n)

  const filtered = all.filter(
    (m) => (!tab || kind(m) === tab) && (!folder || (m.folder ?? 'site') === folder) && (!q || norm(`${m.alt} ${m.filename ?? ''}`).includes(norm(q))),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, type: tab, dossier: folder, ...extra })) if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }
  const tabs = [
    { key: '', label: `Tous (${all.length})` },
    { key: 'photo', label: `Photos (${counts.photo})` },
    { key: 'video', label: `Vidéos (${counts.video})` },
    { key: 'document', label: `Documents (${counts.document})` },
    ...(counts.audio ? [{ key: 'audio', label: `Audio (${counts.audio})` }] : []),
  ]

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Médias"
        title="Médias"
        text="Photos, vidéos et fichiers publics utilisés sur le site."
        actions={
          <>
            <a href="/admin/collections/documents" className="mk-btn mk-btn--outline">
              <Icon name="folder" size={18} /> Documents internes
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="upload" size={18} /> Importer un fichier
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="image" label="Tous les médias" value={all.length} extra={<span className="mk-kpi__sub">{recent} ce mois-ci</span>} href={href({ type: '', p: undefined })} />
        <Kpi icon="play" tone="red" label="Vidéos" value={counts.video} href={href({ type: 'video', p: undefined })} />
        <Kpi icon="image" tone="green" label="Photos" value={counts.photo} href={href({ type: 'photo', p: undefined })} />
        <Kpi icon="file" tone="violet" label="Documents" value={counts.document} href={href({ type: 'document', p: undefined })} />
      </section>

      <div className="mk-split mk-split--wide">
        <section>
          <div className="mk-card mk-filters mk-filters--bar" style={{ marginBottom: 12 }}>
            <nav className="mk-tabs" aria-label="Type de média">
              {tabs.map((t) => (
                <a key={t.key} href={href({ type: t.key, p: undefined })} className={tab === t.key ? 'is-active' : undefined}>
                  {t.label}
                </a>
              ))}
            </nav>
            <form action={BASE} className="mk-filters" style={{ flex: 1 }}>
              {tab && <input type="hidden" name="type" value={tab} />}
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher un média</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher un média…" />
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
            </form>
          </div>

          {rows.length === 0 ? (
            <div className="mk-card">
              <p className="mk-empty">Aucun média ne correspond à votre recherche.</p>
            </div>
          ) : (
            <ul className="mk-tiles">
              {rows.map((m) => {
                const k = kind(m)
                const thumb = k === 'photo' ? (m.sizes?.card?.url ?? m.url) : null
                return (
                  <li key={m.id}>
                    <a href={`${BASE}/${m.id}`} className="mk-tile">
                      <span className="mk-tile__img" style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}>
                        <span className={`mk-tag mk-tag--${k === 'video' ? 'red' : k === 'document' ? 'violet' : 'blue'} mk-tile__badge`}>{kindLabel[k]}</span>
                        {!thumb && (
                          <span className="mk-tile__icon">
                            <Icon name={k === 'video' ? 'play' : 'file'} size={34} />
                          </span>
                        )}
                      </span>
                      <span className="mk-tile__body">
                        <strong className="mk-ellipsis">{m.alt || m.filename}</strong>
                        <span className="mk-kpi__sub">
                          <Icon name="calendar" size={13} /> {shortDate(m.createdAt)} · {fileSize(m.filesize)}
                        </span>
                        <span className="mk-tile__foot">
                          <span className="mk-tag">{folderLabel(m.folder)}</span>
                          <Icon name="arrow" size={16} />
                        </span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
          <footer className="mk-pager">
            <span>{filtered.length ? `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} médias` : 'Aucun résultat'}</span>
            {pages > 1 && (
              <nav aria-label="Pagination">
                <a href={href({ p: Math.max(1, current - 1) })} aria-label="Page précédente" className="mk-icon-btn">
                  <Icon name="left" size={16} />
                </a>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a key={n} href={href({ p: n })} className={n === current ? 'is-active' : undefined}>
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
            <h2 className="mk-side__title">Dossiers</h2>
            <ul className="mk-cats">
              {byFolder.map((f) => (
                <li key={f.value}>
                  <a href={href({ dossier: f.value, p: undefined })}>
                    <Icon name="folder" size={16} /> {f.label}
                  </a>
                  <span>{f.n}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Espace utilisé</h2>
            <p className="mk-kpi__sub" style={{ margin: '0 0 12px' }}>
              {fileSize(bytes)} au total
            </p>
            <ul className="mk-bars">
              {(['photo', 'video', 'document', 'audio'] as const)
                .filter((k) => bytesBy[k])
                .map((k) => (
                  <li key={k}>
                    <span>{kindLabel[k]}s</span>
                    <strong>{fileSize(bytesBy[k])}</strong>
                    <span className="mk-progress__bar">
                      <span style={{ width: `${Math.round((bytesBy[k] / Math.max(bytes, 1)) * 100)}%` }} />
                    </span>
                  </li>
                ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href={`${BASE}/create`} className="mk-tone-blue">
                <Icon name="upload" size={20} /> Importer des fichiers
              </a>
              <a href="/admin/collections/documents" className="mk-tone-violet">
                <Icon name="folder" size={20} /> Documents internes
              </a>
              <a href="/admin/collections/links" className="mk-tone-green">
                <Icon name="link" size={20} /> Liens utiles
              </a>
              <a href="/api/preview?path=/" className="mk-tone-gold">
                <Icon name="pen" size={20} /> Modifier le site
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
