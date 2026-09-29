import type { Payload } from 'payload'
import React from 'react'

import { formatSermonDate, youtubeThumb } from '@/lib/sermons'
import { type SermonStats, sermonStats } from '@/lib/sermonStats'
import type { Media, Sermon } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/sermons'
const PER_PAGE = 9
const PER_PAGE_ALL = 60
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const uniq = (values: (string | null | undefined)[]) =>
  [...new Set(values.filter((v): v is string => Boolean(v)))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )
const media = (v: unknown) => (v && typeof v === 'object' ? (v as Media) : null)
const thumbOf = (s: Sermon) => {
  const t = media(s.thumbnail)
  return t ? (t.sizes?.card?.url ?? t.url) : youtubeThumb(s)
}
const cat = (s: Sermon) => s.category || 'Prédication'
const slugOf = (s: Sermon) => String(s.slug ?? s.id)
const fmt = (n: number) => new Intl.NumberFormat('fr-CA').format(n)
const initials = (name?: string | null) =>
  (name ?? '?')
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

const importMessages: Record<string, string> = {
  vide: 'Aucun fichier reçu. Choisissez un fichier CSV avant de cliquer sur « Importer ».',
  'trop-gros': 'Le fichier dépasse 1 Mo. Découpez-le en plusieurs fichiers.',
  colonnes: 'Le fichier doit contenir au moins les colonnes « titre » et « date ».',
}

function Select({
  name,
  label,
  value,
  options,
}: {
  name: string
  label: string
  value: string
  options: string[]
}) {
  return (
    <select name={name} defaultValue={value} aria-label={label}>
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

function Avatar({ s }: { s: Sermon }) {
  const photo = media(s.preacherPhoto)
  const url = photo ? (photo.sizes?.card?.url ?? photo.url) : null
  return (
    <span
      className="mk-avatar mk-avatar--xs"
      style={url ? { backgroundImage: `url(${url})` } : undefined}
      aria-hidden="true"
    >
      {!url && initials(s.preacher)}
    </span>
  )
}

function Stats({ s, st }: { s: Sermon; st?: SermonStats }) {
  return (
    <span className="mk-scard__stats">
      <span title="Vues sur le site">
        <Icon name="eye" size={14} /> {fmt(st?.views ?? 0)}
      </span>
      <span title="Téléchargements de l’audio">
        <Icon name="down" size={14} /> {fmt(st?.downloads ?? 0)}
      </span>
      <span title="J’aime (saisis depuis YouTube)">
        <Icon name="heart" size={14} /> {s.likes == null ? '–' : fmt(s.likes)}
      </span>
      <span title="Commentaires (saisis depuis YouTube)">
        <Icon name="message" size={14} /> {s.comments == null ? '–' : fmt(s.comments)}
      </span>
    </span>
  )
}

function CardMenu({ s }: { s: Sermon }) {
  return (
    <details className="mk-menu mk-scard__menu">
      <summary className="mk-icon-btn" aria-label={`Actions pour « ${s.title} »`}>
        <Icon name="more" size={18} />
      </summary>
      <div className="mk-menu__list">
        <a href={`${BASE}/${s.id}`}>Modifier</a>
        <a href={`/messages/${slugOf(s)}`} target="_blank" rel="noopener noreferrer">
          Voir sur le site
        </a>
        <a href="/admin/collections/social-posts/create">Partager sur les réseaux</a>
      </div>
    </details>
  )
}

/** Messages (prédications) de l’administration (maquette « Messages » du tableau de bord). */
export default async function SermonsList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const category = one(searchParams.categorie)
  const preacher = one(searchParams.predicateur)
  const year = one(searchParams.annee)
  const series = one(searchParams.serie)
  const view = one(searchParams.vue) === 'liste' ? 'liste' : 'grille'
  const showAll = one(searchParams.tout) === '1'
  const importStatus = one(searchParams.import)
  const importOpen = one(searchParams.importer) === '1' || (importStatus !== '' && importStatus !== 'ok')
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const [all, stats] = await Promise.all([
    payload
      .find({
        collection: 'sermons',
        sort: '-date',
        limit: 5000,
        pagination: false,
        depth: 1,
        draft: true,
        overrideAccess: true,
      })
      .then((r) => r.docs)
      .catch(() => [] as Sermon[]),
    sermonStats(payload),
  ])

  const published = all.filter((s) => s._status === 'published')
  const categories = uniq(all.map(cat))
  const seriesList = uniq(all.map((s) => s.series))
  const preachers = uniq(all.map((s) => s.preacher))
  const years = uniq(all.map((s) => s.date.slice(0, 4))).reverse()
  const totals = all.reduce(
    (t, s) => {
      const st = stats.get(slugOf(s))
      return {
        views: t.views + (st?.views ?? 0),
        downloads: t.downloads + (st?.downloads ?? 0),
        likes: t.likes + (s.likes ?? 0),
        comments: t.comments + (s.comments ?? 0),
      }
    },
    { views: 0, downloads: 0, likes: 0, comments: 0 },
  )

  const filtered = all.filter(
    (s) =>
      (!category || cat(s) === category) &&
      (!preacher || s.preacher === preacher) &&
      (!year || s.date.startsWith(year)) &&
      (!series || s.series === series) &&
      (!q || norm(`${s.title} ${s.preacher ?? ''} ${s.series ?? ''}`).includes(norm(q))),
  )
  const perPage = showAll || view === 'liste' ? PER_PAGE_ALL : PER_PAGE
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * perPage, current * perPage)
  const filtering = Boolean(q || category || preacher || year || series)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({
      q,
      categorie: category,
      predicateur: preacher,
      annee: year,
      serie: series,
      vue: view === 'liste' ? 'liste' : undefined,
      tout: showAll ? '1' : undefined,
      ...extra,
    }))
      if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Messages"
        title="Messages"
        text="Gérez vos prédications, études bibliques et enseignements."
        actions={
          <>
            <details className="mk-menu" open={importOpen}>
              <summary className="mk-btn mk-btn--outline">
                <Icon name="upload" size={18} /> Importer
              </summary>
              <form
                action="/api/admin/sermons/import"
                method="post"
                encType="multipart/form-data"
                className="mk-menu__list mk-import"
              >
                <strong>Importer des messages (CSV)</strong>
                <p className="mk-kpi__sub">
                  Une ligne par message. Colonnes : titre, date (AAAA-MM-JJ), et au choix
                  predicateur, serie, categorie, duree, youtube, balado. Chaque ligne devient un
                  brouillon à relire avant publication.
                </p>
                <input type="file" name="fichier" accept=".csv,text/csv" required />
                <button type="submit" className="mk-btn mk-btn--navy">
                  <Icon name="upload" size={16} /> Importer le fichier
                </button>
                <a href="/api/export/messages" className="mk-kpi__sub">
                  Astuce : exportez d’abord pour obtenir un modèle de fichier.
                </a>
              </form>
            </details>
            <a href="/api/export/messages" className="mk-btn mk-btn--outline">
              <Icon name="down" size={18} /> Exporter
            </a>
            <details className="mk-menu">
              <summary className="mk-btn mk-btn--gold">
                <Icon name="plus" size={18} /> Nouveau message <Icon name="down" size={14} />
              </summary>
              <div className="mk-menu__list">
                <a href={`${BASE}/create`}>Créer un message</a>
                <a href={href({ importer: '1' })}>Importer depuis un fichier CSV</a>
                <a href="/messages" target="_blank" rel="noopener noreferrer">
                  Voir la page publique
                </a>
              </div>
            </details>
          </>
        }
      />

      {importStatus === 'ok' && (
        <div className="mk-notice mk-notice--ok" role="status">
          <Icon name="check" size={18} />
          <p>
            Importation terminée : {one(searchParams.crees) || '0'} message(s) ajouté(s) en
            brouillon
            {Number(one(searchParams.ignores)) > 0
              ? `, ${one(searchParams.ignores)} ligne(s) ignorée(s) (titre ou date manquant, ou message déjà existant)`
              : ''}
            .
          </p>
        </div>
      )}
      {importMessages[importStatus] && (
        <div className="mk-notice" role="alert">
          <Icon name="x" size={18} />
          <p>{importMessages[importStatus]}</p>
        </div>
      )}

      <section className="mk-kpis mk-kpis--4">
        <Kpi
          icon="mic"
          label="Total des messages"
          value={fmt(all.length)}
          extra={
            <span className="mk-kpi__sub">
              {published.length} publié(s) · {all.length - published.length} brouillon(s)
            </span>
          }
        />
        <Kpi
          icon="eye"
          tone="green"
          label="Vues totales"
          value={fmt(totals.views)}
          extra={<span className="mk-kpi__sub">Pages des messages sur le site</span>}
        />
        <Kpi
          icon="down"
          tone="violet"
          label="Téléchargements"
          value={fmt(totals.downloads)}
          extra={<span className="mk-kpi__sub">Fichiers audio</span>}
        />
        <Kpi
          icon="heart"
          tone="gold"
          label="J’aime / Réactions"
          value={fmt(totals.likes)}
          extra={
            <span className="mk-kpi__sub">
              {fmt(totals.comments)} commentaire(s), YouTube
            </span>
          }
        />
      </section>

      <form action={BASE} className="mk-card mk-filters mk-filters--bar">
        <label className="mk-search">
          <Icon name="search" size={16} />
          <span className="sr-only">Rechercher un message</span>
          <input type="search" name="q" defaultValue={q} placeholder="Rechercher un message…" />
        </label>
        <Select
          name="categorie"
          label="Toutes les catégories"
          value={category}
          options={categories}
        />
        <Select
          name="predicateur"
          label="Tous les prédicateurs"
          value={preacher}
          options={preachers}
        />
        <Select name="annee" label="Toutes les années" value={year} options={years} />
        <Select name="serie" label="Toutes les séries" value={series} options={seriesList} />
        {view === 'liste' && <input type="hidden" name="vue" value="liste" />}
        <button type="submit" className="mk-btn mk-btn--navy">
          <Icon name="filter" size={16} /> Filtrer
        </button>
        {filtering && (
          <a href={view === 'liste' ? `${BASE}?vue=liste` : BASE} className="mk-btn mk-btn--outline">
            <Icon name="refresh" size={16} /> Réinitialiser
          </a>
        )}
        <span className="mk-view-toggle" role="group" aria-label="Affichage">
          <a
            href={href({ vue: undefined, p: undefined })}
            className={view === 'grille' ? 'is-active' : undefined}
            aria-label="Affichage en grille"
            aria-current={view === 'grille' ? 'true' : undefined}
          >
            <Icon name="grid" size={18} />
          </a>
          <a
            href={href({ vue: 'liste', p: undefined })}
            className={view === 'liste' ? 'is-active' : undefined}
            aria-label="Affichage en liste"
            aria-current={view === 'liste' ? 'true' : undefined}
          >
            <Icon name="list" size={18} />
          </a>
        </span>
      </form>

      <div className="mk-split mk-split--msg">
        <section className="mk-card">
          <div className="mk-card__head">
            <h2>
              {filtering ? `${filtered.length} message(s) trouvé(s)` : 'Messages récents'}
            </h2>
            {!showAll && view === 'grille' && filtered.length > PER_PAGE && (
              <a href={href({ tout: '1', p: undefined })} className="mk-link">
                Voir tout <Icon name="arrow" size={14} />
              </a>
            )}
          </div>

          {rows.length === 0 ? (
            <p className="mk-empty">
              {all.length === 0
                ? 'Aucun message. Cliquez sur « Nouveau message » pour publier une prédication.'
                : 'Aucun message ne correspond à votre recherche.'}
            </p>
          ) : view === 'liste' ? (
            <div className="mk-table-wrap">
              <table className="mk-table">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Prédicateur</th>
                    <th>Date</th>
                    <th>Catégorie</th>
                    <th>Vues</th>
                    <th>Téléch.</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => {
                    const st = stats.get(slugOf(s))
                    return (
                      <tr key={s.id}>
                        <td>
                          <a href={`${BASE}/${s.id}`}>
                            <strong>{s.title}</strong>
                          </a>
                          {s.series && <span className="mk-kpi__sub"> · {s.series}</span>}
                        </td>
                        <td>{s.preacher}</td>
                        <td>{formatSermonDate(s.date, 'medium')}</td>
                        <td>
                          <span className="mk-tag">{cat(s)}</span>
                        </td>
                        <td>{fmt(st?.views ?? 0)}</td>
                        <td>{fmt(st?.downloads ?? 0)}</td>
                        <td>
                          <span
                            className={`mk-status mk-status--${s._status === 'published' ? 'upcoming' : 'draft'}`}
                          >
                            {s._status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className="mk-scards">
              {rows.map((s) => {
                const t = thumbOf(s)
                return (
                  <li key={s.id} className="mk-scard">
                    <a
                      href={`${BASE}/${s.id}`}
                      className="mk-scard__img"
                      style={t ? { backgroundImage: `url(${t})` } : undefined}
                      aria-label={`Modifier « ${s.title} »`}
                    >
                      <span className="mk-tag mk-tile__badge">{cat(s)}</span>
                      {s.duration && <span className="mk-duration">{s.duration}</span>}
                      {s.featured && <span className="mk-star is-on mk-tile__star">★</span>}
                      {s._status !== 'published' && (
                        <span className="mk-status mk-status--draft mk-scard__draft">Brouillon</span>
                      )}
                    </a>
                    <div className="mk-scard__body">
                      <a href={`${BASE}/${s.id}`} className="mk-scard__title">
                        {s.title}
                      </a>
                      <span className="mk-scard__who">
                        <Avatar s={s} />
                        <span>
                          <strong>{s.preacher}</strong>
                          <span className="mk-kpi__sub">{formatSermonDate(s.date, 'medium')}</span>
                        </span>
                      </span>
                      <span className="mk-scard__foot">
                        <Stats s={s} st={stats.get(slugOf(s))} />
                        <CardMenu s={s} />
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
                ? `Affichage de ${(current - 1) * perPage + 1} à ${Math.min(current * perPage, filtered.length)} sur ${filtered.length} messages`
                : 'Aucun résultat'}
            </span>
            {pages > 1 && (
              <nav aria-label="Pagination">
                <a
                  href={href({ p: Math.max(1, current - 1) })}
                  aria-label="Page précédente"
                  className="mk-icon-btn"
                >
                  <Icon name="left" size={16} />
                </a>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a
                    key={n}
                    href={href({ p: n })}
                    className={n === current ? 'is-active' : undefined}
                  >
                    {n}
                  </a>
                ))}
                <a
                  href={href({ p: Math.min(pages, current + 1) })}
                  aria-label="Page suivante"
                  className="mk-icon-btn"
                >
                  <Icon name="right" size={16} />
                </a>
              </nav>
            )}
          </footer>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Catégories</h2>
            <ul className="mk-cats">
              <li className={!category ? 'is-active' : undefined}>
                <a href={href({ categorie: undefined, p: undefined })}>
                  <Icon name="folder" size={16} /> Tous les messages
                </a>
                <span>{all.length}</span>
              </li>
              {categories.map((c) => (
                <li key={c} className={category === c ? 'is-active' : undefined}>
                  <a href={href({ categorie: c, p: undefined })}>
                    <Icon name="folder" size={16} /> {c}
                  </a>
                  <span>{all.filter((s) => cat(s) === c).length}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Séries en cours</h2>
            {seriesList.length === 0 ? (
              <p className="mk-empty">
                Indiquez une série dans un message pour regrouper vos enseignements.
              </p>
            ) : (
              <ul className="mk-events">
                {seriesList.slice(0, 5).map((name) => {
                  const items = all.filter((s) => s.series === name)
                  const t = thumbOf(items[0])
                  return (
                    <li key={name}>
                      <span
                        className="mk-events__thumb mk-events__thumb--sm"
                        style={t ? { backgroundImage: `url(${t})` } : undefined}
                      />
                      <a href={href({ serie: name, p: undefined })} className="mk-events__body">
                        <strong>{name}</strong>
                        <span>{items.length} message(s)</span>
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
                <Icon name="plus" size={20} /> Créer un message
              </a>
              <a href={href({ importer: '1' })} className="mk-tone-blue">
                <Icon name="upload" size={20} /> Importer des messages
              </a>
              <a href="/admin/globals/page-messages?section=Balado" className="mk-tone-green">
                <Icon name="link" size={20} /> Liens du balado
              </a>
              <a href="/admin/collections/social-posts/create" className="mk-tone-violet">
                <Icon name="send" size={20} /> Partager sur les réseaux
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
