/* eslint-disable @next/next/no-html-link-for-pages -- liens de l’administration et route API du mode édition : navigation classique voulue. */
import type { Payload, PayloadRequest } from 'payload'
import React from 'react'

import { categoryLabels, eventDate } from '@/lib/events'
import type { Event, Media } from '@/payload-types'
import './dashboard.scss'
import { Icon, type IconName } from './ui'

type Props = {
  payload?: Payload
  user?: { name?: string | null; email?: string; role?: string } | null
  initPageResult?: { req?: PayloadRequest }
}

const TZ = 'America/Toronto'
const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d)
const fmt = new Intl.NumberFormat('fr-CA')

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

function Trend({ now, before, label }: { now: number; before: number; label: string }) {
  if (!before && !now) return <span className="mk-kpi__sub">{label}</span>
  const pct = before ? Math.round(((now - before) / before) * 100) : 100
  return (
    <span className="mk-kpi__trend">
      <span className={pct >= 0 ? 'mk-up' : 'mk-down'}>
        <Icon name={pct >= 0 ? 'up' : 'down'} size={14} /> {Math.abs(pct)} %
      </span>
      <span className="mk-kpi__sub">{label}</span>
    </span>
  )
}

/** Courbe des 30 derniers jours (SVG, à l’échelle). */
function LineChart({ data, labels }: { data: number[]; labels: string[] }) {
  const W = 560,
    H = 200,
    L = 34,
    B = 26,
    T = 10
  const max = Math.max(4, ...data)
  const step = Math.pow(10, Math.floor(Math.log10(max)))
  const top = Math.ceil(max / step) * step
  const x = (i: number) => L + (i * (W - L - 8)) / (data.length - 1)
  const y = (v: number) => T + (H - T - B) * (1 - v / top)
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const ticks = [0, top / 2, top]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mk-chart" role="img" aria-label="Visites par jour sur 30 jours">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - 8} y1={y(t)} y2={y(t)} className="mk-grid" />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" className="mk-axis">
            {fmt.format(t)}
          </text>
        </g>
      ))}
      <polygon points={`${x(0)},${y(0)} ${pts} ${x(data.length - 1)},${y(0)}`} className="mk-area" />
      <polyline points={pts} className="mk-line" />
      {data.map((v, i) => (i % 3 === 0 || i === data.length - 1 ? <circle key={i} cx={x(i)} cy={y(v)} r="3.5" className="mk-dot" /> : null))}
      {labels.map((l, i) =>
        (i % 7 === 0 && labels.length - 1 - i >= 4) || i === labels.length - 1 ? (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" className="mk-axis">
            {l}
          </text>
        ) : null,
      )}
    </svg>
  )
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const W = 360,
    H = 200,
    L = 30,
    B = 26,
    T = 10
  const max = Math.max(4, ...data.map((d) => d.value))
  const top = Math.ceil(max / 4) * 4
  const bw = (W - L - 10) / data.length
  const y = (v: number) => T + (H - T - B) * (1 - v / top)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mk-chart" role="img" aria-label="Inscriptions par mois">
      {[0, top / 2, top].map((t) => (
        <g key={t}>
          <line x1={L} x2={W - 6} y1={y(t)} y2={y(t)} className="mk-grid" />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" className="mk-axis">
            {t}
          </text>
        </g>
      ))}
      {data.map((d, i) => (
        <g key={d.label}>
          <rect x={L + i * bw + bw * 0.22} y={y(d.value)} width={bw * 0.56} height={Math.max(0, y(0) - y(d.value))} rx="4" className="mk-bar" />
          <text x={L + i * bw + bw / 2} y={H - 6} textAnchor="middle" className="mk-axis">
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Donut({ parts, total, caption }: { parts: { label: string; value: number }[]; total: number; caption: string }) {
  const colors = ['#1d4fa3', '#f5bf4f', '#2bb58a', '#7c8db0', '#c9d3e6']
  const r = 58,
    c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="mk-donut">
      <svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label={caption}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--mk-line)" strokeWidth="22" />
        {total > 0 &&
          parts.map((p, i) => {
            const len = (p.value / total) * c
            const el = (
              <circle
                key={p.label}
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth="22"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 80 80)"
              />
            )
            offset += len
            return el
          })}
        <text x="80" y="78" textAnchor="middle" className="mk-donut__value">
          {fmt.format(total)}
        </text>
        <text x="80" y="98" textAnchor="middle" className="mk-axis">
          {caption}
        </text>
      </svg>
      <ul>
        {parts.map((p, i) => (
          <li key={p.label}>
            <span className="mk-swatch" style={{ background: colors[i % colors.length] }} />
            <span className="mk-donut__label">{p.label}</span>
            <strong>{total ? Math.round((p.value / total) * 100) : 0} %</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

const timeAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 3600) return `Il y a ${Math.max(1, Math.round(s / 60))} min`
  if (s < 86400) return `Il y a ${Math.round(s / 3600)} h`
  const d = Math.round(s / 86400)
  return `Il y a ${d} jour${d > 1 ? 's' : ''}`
}

/**
 * Tableau de bord de l’administration (maquette « Tableau de bord ») avec les
 * données réelles du site. Aucun chiffre n’est inventé : un indicateur sans donnée affiche 0.
 */
export default async function Dashboard(props: Props) {
  const payload = props.initPageResult?.req?.payload ?? props.payload!
  const user = props.user ?? (props.initPageResult?.req?.user as Props['user'])
  const canSeePastoral = user?.role === 'admin' || user?.role === 'pastoral'
  const now = new Date()
  const days = Array.from({ length: 30 }, (_, i) => dayKey(new Date(now.getTime() - (29 - i) * 86400000)))
  const prev30 = dayKey(new Date(now.getTime() - 59 * 86400000))
  const ago30 = new Date(now.getTime() - 30 * 86400000).toISOString()
  const ago60 = new Date(now.getTime() - 60 * 86400000).toISOString()
  const count = (collection: Parameters<Payload['count']>[0]['collection'], where = {}) =>
    safe(async () => (await payload.count({ collection, where, overrideAccess: true })).totalDocs, 0)

  const [views, events, upcoming, regsRecent, regs30, regsPrev, subs, subsPrev, prayersNew, contactsNew, ministries, latestRegs, latestContacts, latestPrayers, latestSubs, regs6m] =
    await Promise.all([
      safe(
        async () =>
          (await payload.find({ collection: 'page-views', where: { day: { greater_than_equal: prev30 } }, limit: 10000, pagination: false, overrideAccess: true })).docs,
        [] as { day: string; path: string; count: number }[],
      ),
      safe(
        async () =>
          (
            await payload.find({
              collection: 'events',
              where: { startsAt: { greater_than_equal: new Date(now.getTime() - 12 * 3600000).toISOString() } },
              sort: 'startsAt',
              limit: 4,
              depth: 1,
              overrideAccess: true,
            })
          ).docs,
        [] as Event[],
      ),
      count('events', { startsAt: { greater_than_equal: now.toISOString() } }),
      count('event-registrations', { createdAt: { greater_than_equal: new Date(now.getTime() - 7 * 86400000).toISOString() } }),
      count('event-registrations', { createdAt: { greater_than_equal: ago30 } }),
      count('event-registrations', { and: [{ createdAt: { greater_than_equal: ago60 } }, { createdAt: { less_than: ago30 } }] }),
      count('newsletter-subscribers'),
      count('newsletter-subscribers', { createdAt: { less_than: ago30 } }),
      count('prayer-requests', { status: { equals: 'new' } }),
      count('contact-messages', { status: { equals: 'new' } }),
      count('ministries', { _status: { equals: 'published' } }),
      safe(async () => (await payload.find({ collection: 'event-registrations', sort: '-createdAt', limit: 5, depth: 1, overrideAccess: true })).docs, []),
      safe(async () => (await payload.find({ collection: 'contact-messages', sort: '-createdAt', limit: 4, depth: 0, overrideAccess: true })).docs, []),
      canSeePastoral
        ? safe(async () => (await payload.find({ collection: 'prayer-requests', sort: '-createdAt', limit: 3, depth: 0, overrideAccess: true })).docs, [])
        : Promise.resolve([]),
      safe(async () => (await payload.find({ collection: 'newsletter-subscribers', sort: '-createdAt', limit: 3, depth: 0, overrideAccess: true })).docs, []),
      safe(
        async () =>
          (
            await payload.find({
              collection: 'event-registrations',
              where: { createdAt: { greater_than_equal: new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString() } },
              limit: 5000,
              pagination: false,
              depth: 0,
              overrideAccess: true,
            })
          ).docs,
        [],
      ),
    ])

  // Visites : 30 derniers jours et période précédente
  const perDay = new Map(days.map((d) => [d, 0]))
  const perPath = new Map<string, number>()
  let v30 = 0,
    vPrev = 0
  for (const v of views) {
    if (perDay.has(v.day)) {
      perDay.set(v.day, (perDay.get(v.day) ?? 0) + v.count)
      perPath.set(v.path, (perPath.get(v.path) ?? 0) + v.count)
      v30 += v.count
    } else vPrev += v.count
  }
  const dayLabels = days.map((d) => new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${d}T12:00:00Z`)).replace('.', ''))
  const top = [...perPath.entries()].sort((a, b) => b[1] - a[1])
  const names: Record<string, string> = {
    eglise: 'Église',
    decouvrir: 'Découvrir',
    ministeres: 'Ministères',
    messages: 'Messages',
    evenements: 'Événements',
    missions: 'Missions',
    priere: 'Prière',
    donner: 'Donner',
    contact: 'Nous contacter',
  }
  const pageName = (p: string) => {
    if (p === '/') return 'Accueil'
    const seg = p.replace(/^\//, '').split('/')[0]
    return names[seg] ?? seg.replace(/^\w/, (c) => c.toUpperCase())
  }
  const parts = [...top.slice(0, 4).map(([p, v]) => ({ label: pageName(p), value: v }))]
  const rest = top.slice(4).reduce((s, [, v]) => s + v, 0)
  if (rest) parts.push({ label: 'Autres pages', value: rest })

  // Inscriptions par mois (6 mois)
  const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1))
  const perMonth = months.map((m) => ({
    label: new Intl.DateTimeFormat('fr-CA', { month: 'short' }).format(m).replace('.', ''),
    value: regs6m.filter((r) => {
      const d = new Date(r.createdAt)
      return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth()
    }).reduce((s, r) => s + (r.seats ?? 1), 0),
  }))

  // Activité récente
  type Item = { at: string; title: string; text: string; tone: string; icon: IconName; href: string }
  const activity: Item[] = [
    ...latestRegs.map((r) => ({
      at: r.createdAt,
      title: 'Nouvelle inscription à un événement',
      text: `${r.name} – ${typeof r.event === 'object' && r.event ? r.event.title : 'Événement'}`,
      tone: 'green',
      icon: 'clipboard' as const,
      href: `/admin/collections/event-registrations/${r.id}`,
    })),
    ...latestContacts.map((m) => ({ at: m.createdAt, title: 'Message du formulaire de contact', text: `${m.name} – ${m.subject}`, tone: 'blue', icon: 'mail' as const, href: `/admin/collections/contact-messages/${m.id}` })),
    ...latestPrayers.map((p) => ({ at: p.createdAt, title: 'Nouvelle demande de prière', text: p.confidential ? 'Demande confidentielle' : p.name, tone: 'gold', icon: 'heart' as const, href: `/admin/collections/prayer-requests/${p.id}` })),
    ...latestSubs.map((s) => ({ at: s.createdAt, title: 'Nouvel abonné à l’infolettre', text: s.email, tone: 'violet', icon: 'send' as const, href: `/admin/collections/newsletter-subscribers/${s.id}` })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)

  const first = (user?.name || '').split(' ')[0]
  const today = new Intl.DateTimeFormat('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ }).format(now)

  const kpis = [
    { icon: 'calendar' as const, label: 'Événements à venir', value: upcoming, extra: <span className="mk-kpi__sub">Au calendrier</span>, href: '/admin/collections/events' },
    { icon: 'clipboard' as const, label: 'Inscriptions (30 j)', value: regs30, extra: <Trend now={regs30} before={regsPrev} label={`${regsRecent} ces 7 derniers jours`} />, href: '/admin/collections/event-registrations' },
    { icon: 'eye' as const, label: 'Visites du site (30 j)', value: v30, extra: <Trend now={v30} before={vPrev} label="vs 30 jours précédents" />, href: '/admin/collections/page-views' },
    canSeePastoral
      ? { icon: 'heart' as const, label: 'Demandes de prière', value: prayersNew, extra: <span className="mk-kpi__sub">Nouvelles, à traiter</span>, href: '/admin/collections/prayer-requests' }
      : { icon: 'mail' as const, label: 'Messages reçus', value: contactsNew, extra: <span className="mk-kpi__sub">Nouveaux</span>, href: '/admin/collections/contact-messages' },
    { icon: 'users' as const, label: 'Abonnés infolettre', value: subs, extra: <Trend now={subs} before={subsPrev} label="vs il y a 30 jours" />, href: '/admin/collections/newsletter-subscribers' },
  ]

  return (
    <div className="mk-dash">
      <header className="mk-dash__head">
        <div>
          <h1>Bonjour{first ? `, ${first}` : ''} !</h1>
          <p>Voici un aperçu des activités de MKMI Québec aujourd’hui.</p>
        </div>
        <div className="mk-dash__today">
          <p className="mk-dash__date">
            <Icon name="calendar" size={18} /> <span>{today}</span>
          </p>
          <p className="mk-dash__verse">« Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux. » Matthieu 18:20</p>
        </div>
        <details className="mk-menu">
          <summary className="mk-btn mk-btn--gold">
            <Icon name="plus" size={18} /> Nouvelle action
          </summary>
          <div className="mk-menu__list">
            <a href="/admin/collections/events/create">Créer un événement</a>
            <a href="/admin/collections/sermons/create">Publier un message</a>
            <a href="/admin/collections/ministries/create">Ajouter un ministère</a>
            <a href="/admin/collections/media/create">Ajouter une photo</a>
            <a href="/api/preview?path=/">Modifier le site (mode édition)</a>
          </div>
        </details>
      </header>

      <section className="mk-kpis" aria-label="Indicateurs clés">
        {kpis.map((k) => (
          <a key={k.label} href={k.href} className="mk-card mk-kpi">
            <span className="mk-kpi__icon">
              <Icon name={k.icon} size={26} />
            </span>
            <span className="mk-kpi__body">
              <span className="mk-kpi__label">{k.label}</span>
              <span className="mk-kpi__row">
                <strong className="mk-kpi__value">{fmt.format(k.value)}</strong>
                {k.extra}
              </span>
            </span>
          </a>
        ))}
      </section>

      <section className="mk-grid3">
        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Visites du site</h2>
            <span className="mk-chip">30 derniers jours</span>
          </div>
          <LineChart data={days.map((d) => perDay.get(d) ?? 0)} labels={dayLabels} />
        </div>
        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Inscriptions aux événements</h2>
            <span className="mk-chip">6 derniers mois</span>
          </div>
          <BarChart data={perMonth} />
        </div>
        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Pages les plus vues</h2>
          </div>
          {v30 ? <Donut parts={parts} total={v30} caption="visites" /> : <p className="mk-empty">Les visites apparaîtront ici dès que le site sera consulté.</p>}
        </div>
      </section>

      <section className="mk-grid3">
        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Événements à venir</h2>
            <a href="/admin/collections/events" className="mk-link">
              Voir tous <Icon name="arrow" size={16} />
            </a>
          </div>
          {events.length === 0 ? (
            <p className="mk-empty">Aucun événement à venir.</p>
          ) : (
            <ul className="mk-events">
              {events.map((e) => {
                const d = eventDate(e)
                const img = e.image && typeof e.image === 'object' ? (e.image as Media) : null
                return (
                  <li key={e.id}>
                    <span className="mk-events__thumb" style={img?.sizes?.card?.url || img?.url ? { backgroundImage: `url(${img?.sizes?.card?.url ?? img?.url})` } : undefined}>
                      <span className="mk-events__date">
                        <strong>{d.day}</strong>
                        {d.month}
                      </span>
                    </span>
                    <span className="mk-events__body">
                      <strong>{e.title}</strong>
                      <span>
                        <Icon name="clock" size={14} /> {d.time}
                      </span>
                      <span>
                        <Icon name="pin" size={14} /> {e.location || 'À préciser'}
                        <em className="mk-tag">{categoryLabels[e.category ?? 'rencontre']}</em>
                      </span>
                    </span>
                    <a href={`/admin/collections/events/${e.id}`} className="mk-btn mk-btn--ghost">
                      Voir
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Dernières inscriptions</h2>
            <a href="/admin/collections/event-registrations" className="mk-link">
              Voir tous <Icon name="arrow" size={16} />
            </a>
          </div>
          {latestRegs.length === 0 ? (
            <p className="mk-empty">Les inscriptions aux événements apparaîtront ici.</p>
          ) : (
            <ul className="mk-people">
              {latestRegs.map((r) => (
                <li key={r.id}>
                  <span className="mk-avatar">{r.name.slice(0, 1).toUpperCase()}</span>
                  <span>
                    <strong>{r.name}</strong>
                    <span>{typeof r.event === 'object' && r.event ? r.event.title : 'Événement'} · {r.seats ?? 1} place(s)</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Activité récente</h2>
          </div>
          {activity.length === 0 ? (
            <p className="mk-empty">Les nouvelles inscriptions, messages et demandes apparaîtront ici.</p>
          ) : (
            <ul className="mk-activity">
              {activity.map((a, i) => (
                <li key={i}>
                  <a href={a.href}>
                    <span className={`mk-activity__icon mk-tone-${a.tone}`}>
                      <Icon name={a.icon} size={18} />
                    </span>
                    <span className="mk-activity__body">
                      <strong>{a.title}</strong>
                      <span>{a.text}</span>
                    </span>
                    <time>{timeAgo(a.at)}</time>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mk-actions" aria-label="Actions rapides">
        {[
          { href: '/admin/collections/events/create', icon: 'calendar' as const, title: 'Créer un événement', text: 'Planifier une nouvelle activité', tone: 'blue' },
          { href: '/admin/collections/sermons/create', icon: 'mic' as const, title: 'Publier un message', text: 'Ajouter une prédication', tone: 'gold' },
          { href: '/api/preview?path=/', icon: 'pen' as const, title: 'Modifier le site', text: 'Ouvrir le mode édition', tone: 'violet' },
          { href: '/admin/collections/ministries', icon: 'users' as const, title: `Ministères (${ministries})`, text: 'Mettre à jour les ministères', tone: 'green' },
        ].map((q) => (
          <a key={q.title} href={q.href} className={`mk-action mk-tone-${q.tone}`}>
            <span className="mk-action__icon">
              <Icon name={q.icon} size={26} />
            </span>
            <span>
              <strong>{q.title}</strong>
              <span>{q.text}</span>
            </span>
            <Icon name="arrow" size={18} />
          </a>
        ))}
      </section>
    </div>
  )
}
