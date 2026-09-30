import type { Payload } from 'payload'
import React from 'react'

import { testimonialCategories } from '@/collections/Testimonials'
import { youtubeThumb } from '@/lib/sermons'
import type { Media, Testimonial } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }
type Status = 'pending' | 'published' | 'rejected'

const BASE = '/admin/collections/testimonials'
const PER_PAGE = 10
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const catLabel = (v?: string | null) => testimonialCategories.find((c) => c.value === v)?.label ?? 'Autre'
const statusOf = (t: Testimonial): Status => (t.status as Status) ?? (t.approved ? 'published' : 'pending')
const statusLabel: Record<Status, string> = { pending: 'En attente', published: 'Publié', rejected: 'Refusé' }
const statusClass: Record<Status, string> = { pending: 'live', published: 'upcoming', rejected: 'past' }
const catTone: Record<string, string> = {
  guerison: 'red',
  delivrance: 'green',
  restauration: 'blue',
  provision: 'gold',
  direction: 'violet',
  priere: 'violet',
  etude: 'blue',
  famille: 'gold',
  autre: '',
}
const day = (iso: string) =>
  new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
const thumbOf = (t: Testimonial) => {
  const m = t.photo && typeof t.photo === 'object' ? (t.photo as Media) : null
  return m ? (m.sizes?.card?.url ?? m.url) : youtubeThumb(t)
}

function Moderate({ id, action, label, back }: { id: number; action: string; label: string; back: string }) {
  return (
    <form action="/api/admin/temoignages" method="post" className="mk-inline-form">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="back" value={back} />
      <button type="submit" className="mk-btn mk-btn--outline mk-btn--sm">
        {label}
      </button>
    </form>
  )
}

/** Témoignages de l’administration (maquette « Témoignages »). */
export default async function TestimonialsList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const tab = one(searchParams.statut) as '' | Status
  const cat = one(searchParams.categorie)
  const year = one(searchParams.annee)
  const media = one(searchParams.media)
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const all = await payload
    .find({ collection: 'testimonials', sort: '-createdAt', limit: 5000, pagination: false, depth: 1, overrideAccess: true })
    .then((r) => r.docs)
    .catch(() => [] as Testimonial[])

  const count = (s: Status) => all.filter((t) => statusOf(t) === s).length
  const years = [...new Set(all.map((t) => t.createdAt.slice(0, 4)))].sort().reverse()
  const filtered = all.filter(
    (t) =>
      (!tab || statusOf(t) === tab) &&
      (!cat || t.category === cat) &&
      (!year || t.createdAt.startsWith(year)) &&
      (!media || (media === 'video' ? Boolean(t.youtubeUrl) : !t.youtubeUrl)) &&
      (!q || norm(`${t.title} ${t.firstName} ${t.text}`).includes(norm(q))),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, statut: tab, categorie: cat, annee: year, media, ...extra }))
      if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }
  const back = href({ p: current > 1 ? current : undefined })

  const thisYear = String(new Date().getFullYear())
  const perMonth = MONTHS.map((_, i) => all.filter((t) => t.createdAt.startsWith(`${thisYear}-${String(i + 1).padStart(2, '0')}`)).length)
  const maxMonth = Math.max(1, ...perMonth)
  const byCat = testimonialCategories
    .map((c) => ({ ...c, n: all.filter((t) => (t.category ?? 'autre') === c.value).length }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n)
  const tabs: { key: '' | Status; label: string; icon: 'message' | 'check' | 'clock' | 'x' }[] = [
    { key: '', label: `Tous (${all.length})`, icon: 'message' },
    { key: 'published', label: `Publiés (${count('published')})`, icon: 'check' },
    { key: 'pending', label: `En attente (${count('pending')})`, icon: 'clock' },
    { key: 'rejected', label: `Refusés (${count('rejected')})`, icon: 'x' },
  ]

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Témoignages"
        title="Témoignages"
        text="Gérez les témoignages partagés par les membres de votre communauté."
        actions={
          <>
            <a href="/temoignages" target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn--outline">
              <Icon name="external" size={18} /> Voir la page publique
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Ajouter un témoignage
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="message" label="Témoignages" value={all.length} />
        <Kpi icon="check" tone="green" label="Publiés" value={count('published')} href={href({ statut: 'published', p: undefined })} />
        <Kpi
          icon="clock"
          tone="gold"
          label="En attente"
          value={count('pending')}
          extra={<span className="mk-kpi__sub">À relire</span>}
          href={href({ statut: 'pending', p: undefined })}
        />
        <Kpi icon="x" tone="red" label="Refusés" value={count('rejected')} href={href({ statut: 'rejected', p: undefined })} />
      </section>

      <div className="mk-split mk-split--msg">
        <section className="mk-card mk-table-card">
          <div className="mk-toolbar">
            <nav className="mk-tabs" aria-label="Statut">
              {tabs.map((t) => (
                <a key={t.key} href={href({ statut: t.key || undefined, p: undefined })} className={tab === t.key ? 'is-active' : undefined}>
                  <Icon name={t.icon} size={15} /> {t.label}
                </a>
              ))}
            </nav>
            <form action={BASE} className="mk-filters">
              {tab && <input type="hidden" name="statut" value={tab} />}
              <select name="categorie" defaultValue={cat} aria-label="Catégorie">
                <option value="">Toutes les catégories</option>
                {testimonialCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select name="annee" defaultValue={year} aria-label="Année">
                <option value="">Toutes les années</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <select name="media" defaultValue={media} aria-label="Type de média">
                <option value="">Tous les types de média</option>
                <option value="video">Vidéo</option>
                <option value="ecrit">Écrit</option>
              </select>
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher un témoignage</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher un témoignage…" />
              </label>
              <button type="submit" className="mk-btn mk-btn--navy">
                Filtrer
              </button>
            </form>
          </div>

          {rows.length === 0 ? (
            <p className="mk-empty" style={{ padding: 24 }}>
              {all.length === 0
                ? 'Aucun témoignage pour l’instant. Ceux envoyés depuis la page Témoignages du site arriveront ici « En attente », pour relecture.'
                : 'Aucun témoignage ne correspond à ces filtres.'}
            </p>
          ) : (
            <div className="mk-table-wrap">
              <table className="mk-table">
                <thead>
                  <tr>
                    <th>Témoignage</th>
                    <th>Auteur</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => {
                    const s = statusOf(t)
                    const img = thumbOf(t)
                    return (
                      <tr key={t.id}>
                        <td>
                          <a href={`${BASE}/${t.id}`} className="mk-tmono">
                            <span className="mk-tmono__thumb" style={img ? { backgroundImage: `url(${img})` } : undefined}>
                              {t.youtubeUrl ? <Icon name="play" size={18} /> : !img && <Icon name="message" size={18} />}
                              {t.duration && <span className="mk-duration">{t.duration}</span>}
                            </span>
                            <span>
                              <strong>{t.title}</strong>
                              <span className="mk-kpi__sub mk-ellipsis">{t.text}</span>
                            </span>
                          </a>
                        </td>
                        <td>{t.firstName}</td>
                        <td>
                          <span className={`mk-tag${catTone[t.category ?? 'autre'] ? ` mk-tag--${catTone[t.category ?? 'autre']}` : ''}`}>
                            {catLabel(t.category)}
                          </span>
                        </td>
                        <td>{day(t.createdAt)}</td>
                        <td>
                          <span className={`mk-status mk-status--${statusClass[s]}`}>{statusLabel[s]}</span>
                          {!t.consent && <span className="mk-kpi__sub"> · sans consentement</span>}
                        </td>
                        <td>
                          <span className="mk-row-actions">
                            <a href={`${BASE}/${t.id}`} className="mk-icon-btn" aria-label={`Modifier « ${t.title} »`}>
                              <Icon name="pen" size={16} />
                            </a>
                            {s !== 'published' && t.consent && <Moderate id={t.id} action="publish" label="Publier" back={back} />}
                            {s === 'pending' && <Moderate id={t.id} action="reject" label="Refuser" back={back} />}
                            {s === 'published' && <Moderate id={t.id} action="pending" label="Retirer" back={back} />}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <footer className="mk-pager">
            <span>
              {filtered.length
                ? `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} témoignages`
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
            <h2 className="mk-side__title">Aperçu {thisYear}</h2>
            <div className="mk-vbars" role="img" aria-label={`Témoignages reçus par mois en ${thisYear}`}>
              {perMonth.map((n, i) => (
                <span key={MONTHS[i]} className="mk-vbars__col">
                  <span className="mk-vbars__bar" style={{ height: `${(n / maxMonth) * 100}%` }} title={`${MONTHS[i]} : ${n}`} />
                  <span className="mk-vbars__label">{MONTHS[i]}</span>
                </span>
              ))}
            </div>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Répartition par catégorie</h2>
            {byCat.length === 0 ? (
              <p className="mk-empty">Aucune donnée pour l’instant.</p>
            ) : (
              <ul className="mk-cats">
                {byCat.map((c) => (
                  <li key={c.value} className={cat === c.value ? 'is-active' : undefined}>
                    <a href={href({ categorie: c.value, p: undefined })}>
                      <Icon name="tag" size={16} /> {c.label}
                    </a>
                    <span>{c.n}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Derniers témoignages</h2>
            {all.length === 0 ? (
              <p className="mk-empty">Rien pour l’instant.</p>
            ) : (
              <ul className="mk-events">
                {all.slice(0, 4).map((t) => {
                  const img = thumbOf(t)
                  return (
                    <li key={t.id}>
                      <span className="mk-events__thumb mk-events__thumb--sm" style={img ? { backgroundImage: `url(${img})` } : undefined} />
                      <a href={`${BASE}/${t.id}`} className="mk-events__body">
                        <strong>{t.title}</strong>
                        <span>{day(t.createdAt)}</span>
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
