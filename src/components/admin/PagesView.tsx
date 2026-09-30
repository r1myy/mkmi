import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps, Payload } from 'payload'
import React from 'react'

import { pageGlobals, pagePaths } from '@/globals/pages'
import './dashboard.scss'
import { Icon, ScreenHeader } from './ui'

const fmt = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso)) : '—'

async function Pages({ payload }: { payload: Payload }) {
  const list = [{ slug: 'home-page', label: 'Accueil', path: '/' }].concat(
    pageGlobals.map((g) => ({ slug: g.slug, label: String(g.label ?? g.slug), path: pagePaths[g.slug] ?? '/' })),
  )
  const rows = await Promise.all(
    list.map(async (p) => {
      const doc = (await payload
        .findGlobal({ slug: p.slug as never, depth: 0, draft: true, overrideAccess: true })
        .catch(() => null)) as { updatedAt?: string; _status?: string } | null
      return { ...p, updatedAt: doc?.updatedAt, draft: doc?._status === 'draft' }
    }),
  )

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Pages du site"
        title="Pages du site"
        text="Modifiez les textes et les photos de chaque page, section par section. L’aperçu s’affiche à côté pendant que vous écrivez."
      />
      <ul className="mk-pages">
        {rows.map((p) => (
          <li key={p.slug} className="mk-card">
            <span className="mk-kpi__icon mk-bg-navy">
              <Icon name="file" size={22} />
            </span>
            <span className="mk-pages__body">
              <strong>{p.label}</strong>
              <span className="mk-kpi__sub">
                {p.path} · modifiée le {fmt(p.updatedAt)}
              </span>
              {p.draft && <span className="mk-status mk-status--draft">Brouillon non publié</span>}
            </span>
            <span className="mk-pages__actions">
              <a href={`/admin/globals/${p.slug}`} className="mk-btn mk-btn--gold">
                <Icon name="pen" size={16} /> Modifier
              </a>
              <a href={p.path} target="_blank" rel="noopener noreferrer" className="mk-btn mk-btn--outline" aria-label={`Voir la page ${p.label}`}>
                <Icon name="external" size={16} />
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Vue « Pages du site » : une entrée de menu unique pour toutes les pages modifiables. */
export default function PagesView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, locale, visibleEntities } = initPageResult
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
      <Pages payload={req.payload} />
    </DefaultTemplate>
  )
}
