import type { Payload } from 'payload'
import React from 'react'

import { formatSermonDate, youtubeThumb } from '@/lib/sermons'
import type { Media, Sermon } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/sermons'
const PER_PAGE = 12
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

/** Messages (prédications) de l’administration, sur le modèle de la page publique « Messages ». */
export default async function SermonsList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const category = one(searchParams.categorie)
  const preacher = one(searchParams.predicateur)
  const year = one(searchParams.annee)
  const series = one(searchParams.serie)
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const all = await payload
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
    .catch(() => [] as Sermon[])

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const published = all.filter((s) => s._status === 'published')
  const featured = published.find((s) => s.featured) ?? published[0]
  const categories = uniq(all.map(cat))
  const seriesList = uniq(all.map((s) => s.series))
  const preachers = uniq(all.map((s) => s.preacher))
  const years = uniq(all.map((s) => s.date.slice(0, 4))).reverse()

  const filtered = all.filter(
    (s) =>
      (!category || cat(s) === category) &&
      (!preacher || s.preacher === preacher) &&
      (!year || s.date.startsWith(year)) &&
      (!series || s.series === series) &&
      (!q || norm(`${s.title} ${s.preacher ?? ''} ${s.series ?? ''}`).includes(norm(q))),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const filtering = Boolean(q || category || preacher || year || series)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({
      q,
      categorie: category,
      predicateur: preacher,
      annee: year,
      serie: series,
      ...extra,
    }))
      if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }
  const featuredThumb = featured ? thumbOf(featured) : null

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Messages"
        title="Messages"
        text="Prédications, études bibliques et enseignements publiés sur la page Messages du site."
        actions={
          <>
            <a
              href="/messages"
              target="_blank"
              rel="noopener noreferrer"
              className="mk-btn mk-btn--outline"
            >
              <Icon name="external" size={18} /> Voir la page publique
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Nouveau message
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi
          icon="mic"
          label="Messages publiés"
          value={published.length}
          extra={<span className="mk-kpi__sub">{all.length - published.length} brouillon(s)</span>}
        />
        <Kpi
          icon="calendar"
          tone="green"
          label="Ce mois-ci"
          value={all.filter((s) => s.date.slice(0, 7) === thisMonth).length}
          extra={<span className="mk-kpi__sub">Messages datés du mois</span>}
        />
        <Kpi icon="folder" tone="violet" label="Séries" value={seriesList.length} />
        <Kpi icon="users" tone="gold" label="Prédicateurs" value={preachers.length} />
      </section>

      {featured && (
        <section className="mk-card mk-sermon-feature">
          <a
            href={`${BASE}/${featured.id}`}
            className="mk-sermon-feature__media"
            style={featuredThumb ? { backgroundImage: `url(${featuredThumb})` } : undefined}
          >
            <span className="mk-play">
              <Icon name="play" size={34} />
            </span>
            {featured.duration && <span className="mk-duration">{featured.duration}</span>}
          </a>
          <div className="mk-sermon-feature__body">
            <p className="mk-crumb">
              Message de la semaine{featured.featured ? '' : ' (le plus récent)'}
            </p>
            <h2>{featured.title}</h2>
            <p className="mk-kpi__sub">
              {featured.preacher} · {formatSermonDate(featured.date)}
              {featured.series ? ` · Série : ${featured.series}` : ''}
            </p>
            <div className="mk-read__actions">
              <a href={`${BASE}/${featured.id}`} className="mk-btn mk-btn--navy">
                <Icon name="pen" size={16} /> Modifier
              </a>
              <a
                href={`/messages/${featured.slug ?? featured.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mk-btn mk-btn--outline"
              >
                <Icon name="external" size={16} /> Voir sur le site
              </a>
            </div>
            {!featured.featured && (
              <p className="mk-kpi__sub">
                Cochez « Message de la semaine » dans un message pour choisir celui mis en avant sur
                le site.
              </p>
            )}
          </div>
        </section>
      )}

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
        <button type="submit" className="mk-btn mk-btn--navy">
          Filtrer
        </button>
        {filtering && (
          <a href={BASE} className="mk-btn mk-btn--outline">
            <Icon name="refresh" size={16} /> Réinitialiser
          </a>
        )}
      </form>

      <div className="mk-split mk-split--wide">
        <section>
          <h2 className="mk-side__title">
            {filtering ? `${filtered.length} message(s) trouvé(s)` : 'Tous les messages'}
          </h2>
          {rows.length === 0 ? (
            <div className="mk-card">
              <p className="mk-empty">
                {all.length === 0
                  ? 'Aucun message. Cliquez sur « Nouveau message » pour publier une prédication.'
                  : 'Aucun message ne correspond à votre recherche.'}
              </p>
            </div>
          ) : (
            <ul className="mk-tiles">
              {rows.map((s) => {
                const t = thumbOf(s)
                return (
                  <li key={s.id}>
                    <a href={`${BASE}/${s.id}`} className="mk-tile">
                      <span
                        className="mk-tile__img"
                        style={t ? { backgroundImage: `url(${t})` } : undefined}
                      >
                        <span className="mk-tag mk-tile__badge">{cat(s)}</span>
                        {s.duration && <span className="mk-duration">{s.duration}</span>}
                        {s.featured && <span className="mk-star is-on mk-tile__star">★</span>}
                      </span>
                      <span className="mk-tile__body">
                        <strong>{s.title}</strong>
                        <span className="mk-kpi__sub">
                          <Icon name="mic" size={13} /> {s.preacher}
                        </span>
                        <span className="mk-kpi__sub">
                          <Icon name="calendar" size={13} /> {formatSermonDate(s.date, 'medium')}
                        </span>
                        <span className="mk-tile__foot">
                          <span
                            className={`mk-status mk-status--${s._status === 'published' ? 'upcoming' : 'draft'}`}
                          >
                            {s._status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                          <span className="mk-kpi__sub">
                            {s.youtubeUrl && 'Vidéo'} {s.podcastUrl && '· Balado'}{' '}
                            {s.audioFile && '· Audio'}
                          </span>
                        </span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
          <footer className="mk-pager">
            <span>
              {filtered.length
                ? `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} messages`
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
              <li>
                <a href={BASE}>
                  <Icon name="folder" size={16} /> Tous les messages
                </a>
                <span>{all.length}</span>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <a href={href({ categorie: c, p: undefined })}>
                    <Icon name="folder" size={16} /> {c}
                  </a>
                  <span>{all.filter((s) => cat(s) === c).length}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Séries actuelles</h2>
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
                <Icon name="plus" size={20} /> Publier un message
              </a>
              <a href="/admin/globals/page-messages?section=Balado" className="mk-tone-green">
                <Icon name="link" size={20} /> Liens du balado
              </a>
              <a href="/admin/globals/page-messages" className="mk-tone-blue">
                <Icon name="pen" size={20} /> Modifier la page Messages
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
