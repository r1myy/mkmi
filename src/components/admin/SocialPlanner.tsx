import type { Payload } from 'payload'
import React from 'react'
import { siFacebook, siInstagram, siTiktok, siWhatsapp, siYoutube } from 'simple-icons'

import type { Media, SiteSetting, SocialPost } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/social-posts'
const TZ = 'America/Toronto'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const nets = {
  facebook: { label: 'Facebook', icon: siFacebook, color: '#1877f2' },
  instagram: { label: 'Instagram', icon: siInstagram, color: '#e1306c' },
  youtube: { label: 'YouTube', icon: siYoutube, color: '#ff0000' },
  tiktok: { label: 'TikTok', icon: siTiktok, color: '#111111' },
  whatsapp: { label: 'WhatsApp', icon: siWhatsapp, color: '#25d366' },
} as const
type Net = keyof typeof nets
const statusLabel: Record<string, string> = { draft: 'Brouillon', scheduled: 'Planifiée', published: 'Publiée' }
const statusClass: Record<string, string> = { draft: 'draft', scheduled: 'scheduled', published: 'upcoming' }
const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d)
const hour = (iso: string) => new Intl.DateTimeFormat('fr-CA', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(iso))
const num = new Intl.NumberFormat('fr-CA', { notation: 'compact' })

function Brand({ net, size = 16 }: { net: Net; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={nets[net].color} aria-label={nets[net].label} role="img">
      <path d={nets[net].icon.path} />
    </svg>
  )
}

/** Calendrier éditorial des réseaux sociaux (maquette « Réseaux sociaux »). */
export default async function SocialPlanner({ payload, searchParams = {} }: Props) {
  // Semaine affichée : lundi de la semaine demandée (?semaine=AAAA-MM-JJ) ou courante
  const base = /^\d{4}-\d{2}-\d{2}$/.test(one(searchParams.semaine)) ? new Date(`${one(searchParams.semaine)}T12:00:00`) : new Date()
  const monday = new Date(base)
  monday.setDate(base.getDate() - ((base.getDay() + 6) % 7))
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
  const shift = (n: number) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + n * 7)
    return dayKey(d)
  }

  const [all, settings] = await Promise.all([
    payload
      .find({ collection: 'social-posts', sort: 'scheduledAt', limit: 2000, pagination: false, depth: 1, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as SocialPost[]),
    payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null) as Promise<SiteSetting | null>,
  ])

  const byDay = new Map<string, SocialPost[]>()
  for (const p of all) if (p.scheduledAt) byDay.set(dayKey(new Date(p.scheduledAt)), [...(byDay.get(dayKey(new Date(p.scheduledAt))) ?? []), p])
  const count = (s: string) => all.filter((p) => (p.status ?? 'draft') === s).length
  const published = all.filter((p) => p.status === 'published')
  const reach = published.reduce((s, p) => s + (p.reach ?? 0), 0)
  const engagement = published.reduce((s, p) => s + (p.likes ?? 0) + (p.comments ?? 0), 0)
  const perNet = (Object.keys(nets) as Net[]).map((n) => ({ n, posts: all.filter((p) => p.platforms?.includes(n)).length, url: settings?.[n] as string | null | undefined }))
  const drafts = all.filter((p) => (p.status ?? 'draft') === 'draft').slice(0, 3)
  const recent = [...published].sort((a, b) => (b.scheduledAt ?? '').localeCompare(a.scheduledAt ?? '')).slice(0, 4)
  const today = dayKey(new Date())
  const range = `${new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'long' }).format(days[0])} – ${new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' }).format(days[6])}`

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Réseaux sociaux"
        title="Réseaux sociaux"
        text="Préparez, planifiez et suivez vos publications sur toutes vos plateformes."
        actions={
          <>
            <a href="/admin/globals/site-settings" className="mk-btn mk-btn--outline">
              <Icon name="link" size={18} /> Comptes et liens
            </a>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Nouvelle publication
            </a>
          </>
        }
      />

      <section className="mk-nets">
        {perNet.map(({ n, posts, url }) => (
          <a key={n} href={url || '/admin/globals/site-settings'} {...(url ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="mk-card mk-net">
            <span className="mk-net__icon" style={{ background: `${nets[n].color}14` }}>
              <Brand net={n} size={26} />
            </span>
            <span>
              <strong>{nets[n].label}</strong>
              <span className="mk-kpi__sub">
                {posts} publication{posts > 1 ? 's' : ''} · {url ? 'Compte relié' : 'Lien à ajouter'}
              </span>
            </span>
          </a>
        ))}
      </section>

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="calendar" tone="violet" label="Planifiées" value={count('scheduled')} />
        <Kpi icon="check" tone="green" label="Publiées" value={count('published')} />
        <Kpi icon="eye" label="Portée totale" value={num.format(reach)} extra={<span className="mk-kpi__sub">Saisie après publication</span>} />
        <Kpi icon="heart" tone="red" label="Réactions" value={num.format(engagement)} extra={<span className="mk-kpi__sub">J’aime et commentaires</span>} />
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-card">
          <div className="mk-card__head">
            <h2>Calendrier de publication</h2>
            <div className="mk-cal__nav" style={{ gap: 8 }}>
              <a href={`${BASE}?semaine=${shift(-1)}`} className="mk-icon-btn" aria-label="Semaine précédente">
                <Icon name="left" size={16} />
              </a>
              <a href={BASE} className="mk-btn mk-btn--outline" style={{ padding: '6px 12px' }}>
                Aujourd’hui
              </a>
              <a href={`${BASE}?semaine=${shift(1)}`} className="mk-icon-btn" aria-label="Semaine suivante">
                <Icon name="right" size={16} />
              </a>
              <strong style={{ marginLeft: 6 }}>{range}</strong>
            </div>
          </div>
          <div className="mk-week">
            {days.map((d) => {
              const k = dayKey(d)
              const posts = byDay.get(k) ?? []
              return (
                <div key={k} className={`mk-week__day${k === today ? ' is-today' : ''}`}>
                  <p className="mk-week__label">{new Intl.DateTimeFormat('fr-CA', { weekday: 'short', day: 'numeric' }).format(d)}</p>
                  {posts.map((p) => (
                    <a key={p.id} href={`${BASE}/${p.id}`} className={`mk-week__post mk-week__post--${p.status ?? 'draft'}`}>
                      <span className="mk-week__nets">
                        {(p.platforms ?? []).map((n) => (
                          <Brand key={n} net={n as Net} size={12} />
                        ))}
                      </span>
                      <strong>{p.title}</strong>
                      <span>{p.scheduledAt ? hour(p.scheduledAt) : ''}</span>
                    </a>
                  ))}
                  <a href={`${BASE}/create`} className="mk-week__add" aria-label={`Ajouter une publication le ${k}`}>
                    +
                  </a>
                </div>
              )
            })}
          </div>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Publications récentes</h2>
            {recent.length === 0 ? (
              <p className="mk-empty">Les publications marquées « Publiée » apparaîtront ici avec leurs résultats.</p>
            ) : (
              <ul className="mk-events">
                {recent.map((p) => {
                  const img = p.image && typeof p.image === 'object' ? (p.image as Media) : null
                  return (
                    <li key={p.id}>
                      <span className="mk-events__thumb mk-events__thumb--sm" style={img ? { backgroundImage: `url(${img.sizes?.card?.url ?? img.url})` } : undefined} />
                      <a href={`${BASE}/${p.id}`} className="mk-events__body">
                        <strong>{p.title}</strong>
                        <span>
                          <Icon name="eye" size={14} /> {num.format(p.reach ?? 0)} · <Icon name="heart" size={14} /> {num.format(p.likes ?? 0)}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Brouillons</h2>
            {drafts.length === 0 ? (
              <p className="mk-empty">Aucun brouillon.</p>
            ) : (
              <ul className="mk-contact">
                {drafts.map((p) => (
                  <li key={p.id}>
                    <Icon name="pen" size={16} /> <a href={`${BASE}/${p.id}`}>{p.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <section className="mk-card mk-table-card">
        <div className="mk-toolbar">
          <h2 className="mk-side__title" style={{ margin: 0 }}>
            Toutes les publications
          </h2>
        </div>
        <div className="mk-table-wrap">
          <table className="mk-table">
            <thead>
              <tr>
                <th>Publication</th>
                <th>Plateformes</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Portée</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {all.length === 0 && (
                <tr>
                  <td colSpan={6} className="mk-empty">
                    Aucune publication. Cliquez sur « Nouvelle publication » pour préparer votre premier post.
                  </td>
                </tr>
              )}
              {all.map((p) => (
                <tr key={p.id}>
                  <td>
                    <a href={`${BASE}/${p.id}`}>
                      <strong>{p.title}</strong>
                    </a>
                  </td>
                  <td>
                    <span className="mk-week__nets">
                      {(p.platforms ?? []).map((n) => (
                        <Brand key={n} net={n as Net} />
                      ))}
                    </span>
                  </td>
                  <td className="mk-meta">
                    <span>{p.scheduledAt ? new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: TZ }).format(new Date(p.scheduledAt)) : '—'}</span>
                  </td>
                  <td>
                    <span className={`mk-status mk-status--${statusClass[p.status ?? 'draft']}`}>{statusLabel[p.status ?? 'draft']}</span>
                  </td>
                  <td>{p.reach ? num.format(p.reach) : '—'}</td>
                  <td className="mk-row-actions">
                    <a href={`${BASE}/${p.id}`} className="mk-btn mk-btn--ghost">
                      Modifier
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
