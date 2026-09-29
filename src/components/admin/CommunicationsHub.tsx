import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps, Payload } from 'payload'
import React from 'react'

import './dashboard.scss'
import { Icon, type IconName, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; user?: { role?: string } | null; searchParams?: Record<string, string | string[] | undefined> }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const ago = (iso: string, now: number) => {
  const s = (now - new Date(iso).getTime()) / 1000
  if (s < 3600) return `Il y a ${Math.max(1, Math.round(s / 60))} min`
  if (s < 86400) return `Il y a ${Math.round(s / 3600)} h`
  const d = Math.round(s / 86400)
  return `Il y a ${d} jour${d > 1 ? 's' : ''}`
}

type Item = { at: string; channel: string; name: string; title: string; text: string; href: string; todo: boolean; icon: IconName; tone: string }

const channels = [
  { key: '', label: 'Tous' },
  { key: 'contact', label: 'Formulaire de contact' },
  { key: 'priere', label: 'Demandes de prière' },
  { key: 'visite', label: 'Visites' },
  { key: 'inscription', label: 'Inscriptions' },
  { key: 'infolettre', label: 'Infolettre' },
]

/**
 * Communications : tous les échanges reçus par le site, réunis dans un seul fil
 * (maquette « Communications »). Chaque élément ouvre sa fiche.
 */
export default function CommunicationsView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props
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
      <CommunicationsHub payload={req.payload} user={req.user as Props['user']} searchParams={searchParams as Props['searchParams']} />
    </DefaultTemplate>
  )
}

async function CommunicationsHub({ payload, user, searchParams = {} }: Props) {
  const pastoral = user?.role === 'admin' || user?.role === 'pastoral'
  const q = one(searchParams.q)
  const channel = one(searchParams.canal)
  const now = new Date().getTime()
  const get = <T,>(collection: Parameters<Payload['find']>[0]['collection']) =>
    payload
      .find({ collection, sort: '-createdAt', limit: 200, pagination: false, depth: 1, overrideAccess: true })
      .then((r) => r.docs as T[])
      .catch(() => [] as T[])

  type Doc = { id: number; createdAt: string; [k: string]: unknown }
  const [contacts, prayers, visits, regs, subs] = await Promise.all([
    pastoral ? get<Doc>('contact-messages') : Promise.resolve([] as Doc[]),
    pastoral ? get<Doc>('prayer-requests') : Promise.resolve([] as Doc[]),
    pastoral ? get<Doc>('visit-plans') : Promise.resolve([] as Doc[]),
    get<Doc>('event-registrations'),
    get<Doc>('newsletter-subscribers'),
  ])

  const items: Item[] = [
    ...contacts.map((m) => ({
      at: m.createdAt,
      channel: 'contact',
      name: String(m.name),
      title: String(m.subject),
      text: String(m.message),
      href: `/admin/collections/contact-messages?id=${m.id}`,
      todo: (m.status ?? 'new') === 'new',
      icon: 'mail' as const,
      tone: 'blue',
    })),
    ...prayers.map((p) => ({
      at: p.createdAt,
      channel: 'priere',
      name: p.confidential ? 'Demande confidentielle' : String(p.name),
      title: 'Demande de prière',
      text: p.confidential ? 'Contenu réservé à l’équipe pastorale.' : String(p.request),
      href: `/admin/collections/prayer-requests/${p.id}`,
      todo: (p.status ?? 'new') === 'new',
      icon: 'heart' as const,
      tone: 'gold',
    })),
    ...visits.map((v) => ({
      at: v.createdAt,
      channel: 'visite',
      name: String(v.name),
      title: 'Visite planifiée',
      text: `${v.people ?? 1} personne(s)${v.withChildren ? ', avec enfants' : ''}`,
      href: `/admin/collections/visit-plans/${v.id}`,
      todo: false,
      icon: 'users' as const,
      tone: 'green',
    })),
    ...regs.map((r) => ({
      at: r.createdAt,
      channel: 'inscription',
      name: String(r.name),
      title: 'Inscription à un événement',
      text: typeof r.event === 'object' && r.event ? String((r.event as { title: string }).title) : 'Événement',
      href: `/admin/collections/event-registrations/${r.id}`,
      todo: r.status === 'pending',
      icon: 'clipboard' as const,
      tone: 'violet',
    })),
    ...subs.map((s) => ({
      at: s.createdAt,
      channel: 'infolettre',
      name: String(s.email),
      title: 'Nouvel abonné à l’infolettre',
      text: 'Inscription depuis le site',
      href: `/admin/collections/newsletter-subscribers/${s.id}`,
      todo: false,
      icon: 'send' as const,
      tone: 'blue',
    })),
  ].sort((a, b) => b.at.localeCompare(a.at))

  const count = (k: string) => (k ? items.filter((i) => i.channel === k).length : items.length)
  const month = items.filter((i) => now - new Date(i.at).getTime() < 30 * 86400000).length
  const todo = items.filter((i) => i.todo).length
  const shown = items.filter((i) => (!channel || i.channel === channel) && (!q || norm(`${i.name} ${i.title} ${i.text}`).includes(norm(q)))).slice(0, 60)
  const href = (extra: Record<string, string>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, canal: channel, ...extra })) if (v) params.set(k, v)
    const s = params.toString()
    return `/admin/communications${s ? `?${s}` : ''}`
  }

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Communications"
        title="Communications"
        text="Tous les échanges reçus par le site, réunis au même endroit : messages, demandes de prière, visites, inscriptions et abonnements."
        actions={
          pastoral ? (
            <a href="/admin/collections/contact-messages" className="mk-btn mk-btn--navy">
              <Icon name="mail" size={18} /> Ouvrir la boîte de réception
            </a>
          ) : undefined
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="message" label="Tous les échanges" value={items.length} extra={<span className="mk-kpi__sub">{month} ces 30 jours</span>} />
        <Kpi icon="clock" tone="gold" label="À traiter" value={todo} extra={<span className="mk-kpi__sub">Nouveaux ou en attente</span>} />
        <Kpi icon="heart" tone="red" label="Demandes de prière" value={count('priere')} extra={<span className="mk-kpi__sub">{pastoral ? 'Équipe pastorale' : 'Accès pastoral requis'}</span>} />
        <Kpi icon="send" tone="green" label="Abonnés infolettre" value={count('infolettre')} href="/admin/collections/newsletter-subscribers" />
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-card mk-inbox__list">
          <nav className="mk-tabs mk-tabs--pills" aria-label="Canal">
            {channels.map((c) => (
              <a key={c.key} href={href({ canal: c.key })} className={channel === c.key ? 'is-active' : undefined}>
                {c.label} <small>({count(c.key)})</small>
              </a>
            ))}
          </nav>
          <form action="/admin/communications" className="mk-filters">
            {channel && <input type="hidden" name="canal" value={channel} />}
            <label className="mk-search">
              <Icon name="search" size={16} />
              <span className="sr-only">Rechercher</span>
              <input type="search" name="q" defaultValue={q} placeholder="Rechercher un nom, un sujet…" />
            </label>
          </form>
          <ul className="mk-mails">
            {shown.length === 0 && <li className="mk-empty">Aucun échange pour l’instant.</li>}
            {shown.map((i, n) => (
              <li key={n}>
                <a href={i.href} className={`mk-mail${i.todo ? ' is-unread' : ''}`}>
                  <span className={`mk-activity__icon mk-tone-${i.tone}`}>
                    <Icon name={i.icon} size={18} />
                  </span>
                  <span className="mk-mail__body">
                    <span className="mk-mail__top">
                      <strong>{i.name}</strong>
                      <em className="mk-tag">{channels.find((c) => c.key === i.channel)?.label}</em>
                      <time>{ago(i.at, now)}</time>
                    </span>
                    <span className="mk-mail__subject">{i.title}</span>
                    <span className="mk-mail__excerpt">{i.text}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Par canal</h2>
            <ul className="mk-cats">
              {channels.slice(1).map((c) => (
                <li key={c.key}>
                  <a href={href({ canal: c.key })}>
                    <Icon name="tag" size={16} /> {c.label}
                  </a>
                  <span>{count(c.key)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href="/admin/collections/announcements/create" className="mk-tone-blue">
                <Icon name="megaphone" size={20} /> Publier une annonce
              </a>
              <a href="/admin/collections/email-campaigns/create" className="mk-tone-violet">
                <Icon name="send" size={20} /> Préparer un courriel
              </a>
              <a href="/admin/collections/social-posts/create" className="mk-tone-green">
                <Icon name="calendar" size={20} /> Planifier un post
              </a>
              <a href="/admin/collections/newsletter-subscribers" className="mk-tone-gold">
                <Icon name="users" size={20} /> Abonnés infolettre
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
