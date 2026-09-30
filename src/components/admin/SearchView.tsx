import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps, CollectionSlug, PayloadRequest, Where } from 'payload'
import React from 'react'

import './dashboard.scss'
import { Icon, type IconName, ScreenHeader } from './ui'

type Source = { slug: CollectionSlug; label: string; icon: IconName; title: string; fields: string[]; sub?: string }

/** Contenus parcourus par la recherche de l’administration (les droits de chaque rôle s’appliquent). */
const sources: Source[] = [
  { slug: 'sermons', label: 'Messages', icon: 'mic', title: 'title', fields: ['title', 'preacher', 'series', 'category'], sub: 'preacher' },
  { slug: 'faith-resources', label: 'Découvrir la foi', icon: 'file', title: 'title', fields: ['title', 'summary', 'author'], sub: 'author' },
  { slug: 'testimonials', label: 'Témoignages', icon: 'message', title: 'title', fields: ['title', 'firstName', 'text'], sub: 'firstName' },
  { slug: 'events', label: 'Événements', icon: 'calendar', title: 'title', fields: ['title', 'summary', 'location'], sub: 'location' },
  { slug: 'ministries', label: 'Ministères', icon: 'users', title: 'name', fields: ['name', 'summary', 'leader'], sub: 'leader' },
  { slug: 'missions', label: 'Missions', icon: 'globe', title: 'title', fields: ['title'] },
  { slug: 'announcements', label: 'Annonces', icon: 'megaphone', title: 'title', fields: ['title', 'summary'] },
  { slug: 'members', label: 'Membres', icon: 'users', title: 'name', fields: ['name', 'email', 'phone'], sub: 'email' },
  { slug: 'contact-messages', label: 'Boîte de réception', icon: 'mail', title: 'name', fields: ['name', 'email', 'subject', 'message'], sub: 'subject' },
  { slug: 'prayer-requests', label: 'Demandes de prière', icon: 'heart', title: 'name', fields: ['name', 'email'], sub: 'email' },
  { slug: 'visit-plans', label: 'Visites', icon: 'pin', title: 'name', fields: ['name', 'email'], sub: 'email' },
  { slug: 'documents', label: 'Documents', icon: 'file', title: 'title', fields: ['title'] },
  { slug: 'media', label: 'Médias', icon: 'image', title: 'alt', fields: ['alt', 'filename'], sub: 'filename' },
  { slug: 'links', label: 'Liens utiles', icon: 'link', title: 'title', fields: ['title', 'url'], sub: 'url' },
]

type Hit = { id: number | string; title: string; sub?: string; updatedAt?: string }

async function Results({ req, q, only }: { req: PayloadRequest; q: string; only: string }) {
  const groups = await Promise.all(
    sources
      .filter((s) => !only || s.slug === only)
      .map(async (s) => {
        if (!q) return { s, hits: [] as Hit[], total: 0 }
        const where: Where = { or: s.fields.map((f) => ({ [f]: { like: q } })) }
        const res = await req.payload
          .find({ collection: s.slug, where, limit: only ? 50 : 6, depth: 0, user: req.user, overrideAccess: false, req })
          .catch(() => null)
        const hits = (res?.docs ?? []).map((d) => {
          const doc = d as unknown as Record<string, unknown>
          return {
            id: doc.id as number,
            title: String(doc[s.title] ?? doc.id),
            sub: s.sub ? (doc[s.sub] as string | undefined) : undefined,
            updatedAt: doc.updatedAt as string | undefined,
          }
        })
        return { s, hits, total: res?.totalDocs ?? 0 }
      }),
  )
  const found = groups.filter((g) => g.total > 0)
  const total = found.reduce((n, g) => n + g.total, 0)

  if (!q) return <p className="mk-empty">Tapez un mot pour chercher dans tous les contenus auxquels vous avez accès.</p>
  if (!found.length) return <p className="mk-empty">Aucun résultat pour « {q} ».</p>

  return (
    <>
      <p className="mk-kpi__sub">
        {total} résultat{total > 1 ? 's' : ''} pour « {q} »
      </p>
      <div className="mk-search-results">
        {found.map(({ s, hits, total: n }) => (
          <section key={s.slug} className="mk-card">
            <div className="mk-card__head">
              <h2>
                <Icon name={s.icon} size={18} /> {s.label} <span className="mk-kpi__sub">({n})</span>
              </h2>
              {n > hits.length && (
                <a href={`/admin/recherche?q=${encodeURIComponent(q)}&dans=${s.slug}`} className="mk-link">
                  Voir tout <Icon name="arrow" size={14} />
                </a>
              )}
            </div>
            <ul className="mk-hits">
              {hits.map((h) => (
                <li key={h.id}>
                  <a href={`/admin/collections/${s.slug}/${h.id}`}>
                    <strong>{h.title}</strong>
                    {h.sub && <span className="mk-kpi__sub">{h.sub}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}

/** Vue « Recherche » de l’administration : une seule boîte pour retrouver n’importe quel contenu. */
export default function SearchView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, locale, visibleEntities } = initPageResult
  const raw = (searchParams ?? {}) as Record<string, string | string[] | undefined>
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim().slice(0, 100) ?? ''
  const q = pick(raw.q)
  const only = sources.some((s) => s.slug === pick(raw.dans)) ? pick(raw.dans) : ''
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <div className="mk-dash mk-screen">
        <ScreenHeader crumb="Recherche" title="Recherche" text="Retrouvez un message, une ressource, un membre, un document ou une photo." />
        <form action="/admin/recherche" className="mk-card mk-filters mk-filters--bar" role="search">
          <label className="mk-search" style={{ flex: 1 }}>
            <Icon name="search" size={16} />
            <span className="sr-only">Rechercher</span>
            <input type="search" name="q" defaultValue={q} placeholder="Rechercher un contenu, un titre, un mot-clé…" autoFocus />
          </label>
          <select name="dans" defaultValue={only} aria-label="Chercher dans">
            <option value="">Partout</option>
            {sources.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
          <button type="submit" className="mk-btn mk-btn--navy">
            Rechercher
          </button>
        </form>
        <Results req={req} q={q} only={only} />
      </div>
    </DefaultTemplate>
  )
}
