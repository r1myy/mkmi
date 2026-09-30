import type { Payload } from 'payload'
import React from 'react'

import type { ContactMessage } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = {
  payload: Payload
  user?: { role?: string } | null
  searchParams?: Record<string, string | string[] | undefined>
}

const PER_PAGE = 10
const TZ = 'America/Toronto'
const BASE = '/admin/collections/contact-messages'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const when = (iso: string) =>
  new Intl.DateTimeFormat('fr-CA', { dateStyle: 'long', timeStyle: 'short', timeZone: TZ }).format(new Date(iso))
const ago = (iso: string, now: number) => {
  const s = (now - new Date(iso).getTime()) / 1000
  if (s < 3600) return `Il y a ${Math.max(1, Math.round(s / 60))} min`
  if (s < 86400) return `Il y a ${Math.round(s / 3600)} h`
  const d = Math.round(s / 86400)
  return `Il y a ${d} jour${d > 1 ? 's' : ''}`
}

function Action({ id, back, action, children, className = 'mk-btn mk-btn--outline' }: { id: number; back: string; action: string; children: React.ReactNode; className?: string }) {
  return (
    <form action="/api/admin/messages" method="post" className="mk-inline-form">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="back" value={back} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  )
}

const tabs = [
  { key: '', label: 'Tous' },
  { key: 'unread', label: 'Non lus' },
  { key: 'open', label: 'Non répondus' },
  { key: 'important', label: 'Importants' },
  { key: 'archived', label: 'Archivés' },
] as const

/** Boîte de réception des messages du site (maquette « Messages »). */
export default async function MessagesInbox({ payload, user, searchParams = {} }: Props) {
  if (!user || !['admin', 'pastoral'].includes(user.role ?? '')) {
    return (
      <div className="mk-dash mk-screen">
        <p className="mk-empty">Les messages sont réservés aux administrateurs et à l’équipe pastorale.</p>
      </div>
    )
  }

  const now = new Date().getTime()
  const q = one(searchParams.q)
  const tab = one(searchParams.filtre)
  const page = Math.max(1, Number(one(searchParams.p)) || 1)
  const selectedId = Number(one(searchParams.id)) || 0

  let all = await payload
    .find({ collection: 'contact-messages', sort: '-createdAt', limit: 5000, pagination: false, depth: 0, overrideAccess: true })
    .then((r) => r.docs)
    .catch(() => [] as ContactMessage[])

  // Ouvrir un message le marque comme lu.
  const opened = all.find((m) => m.id === selectedId) ?? null
  if (opened && !opened.readAt) {
    const readAt = new Date().toISOString()
    await payload.update({ collection: 'contact-messages', id: opened.id, data: { readAt }, overrideAccess: true }).catch(() => null)
    all = all.map((m) => (m.id === opened.id ? { ...m, readAt } : m))
  }
  const selected = all.find((m) => m.id === selectedId) ?? null

  const isOpen = (m: ContactMessage) => (m.status ?? 'new') === 'new'
  const counts = {
    all: all.filter((m) => m.status !== 'archived').length,
    unread: all.filter((m) => !m.readAt && m.status !== 'archived').length,
    open: all.filter(isOpen).length,
    important: all.filter((m) => m.important).length,
    archived: all.filter((m) => m.status === 'archived').length,
    answered: all.filter((m) => m.status === 'answered').length,
  }
  const answered30 = all.filter((m) => m.answeredAt && now - new Date(m.answeredAt).getTime() < 30 * 86400000).length
  const received30 = all.filter((m) => now - new Date(m.createdAt).getTime() < 30 * 86400000).length

  const filtered = all.filter((m) => {
    const inTab =
      tab === 'unread'
        ? !m.readAt && m.status !== 'archived'
        : tab === 'open'
          ? isOpen(m)
          : tab === 'important'
            ? m.important
            : tab === 'archived'
              ? m.status === 'archived'
              : m.status !== 'archived'
    return inTab && (!q || norm(`${m.name} ${m.email} ${m.subject} ${m.message}`).includes(norm(q)))
  })
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    const merged = { filtre: tab, q, p: current > 1 ? current : undefined, id: selectedId || undefined, ...extra }
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== '' && v !== 0) params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }
  const back = href({})
  const sameSender = selected ? all.filter((m) => m.email === selected.email).length : 0

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader crumb="Messages" title="Messages" text="Consultez et gérez les messages reçus depuis le formulaire de contact du site." />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="mail" label="Messages reçus" value={counts.all} extra={<span className="mk-kpi__sub">{received30} ces 30 derniers jours</span>} href={href({ filtre: '', p: undefined, id: undefined })} />
        <Kpi icon="message" tone="green" label="Non lus" value={counts.unread} extra={<span className="mk-kpi__sub">À lire</span>} href={href({ filtre: 'unread', p: undefined, id: undefined })} />
        <Kpi icon="reply" tone="blue" label="Répondus" value={counts.answered} extra={<span className="mk-kpi__sub">{answered30} ces 30 jours</span>} />
        <Kpi icon="star" tone="gold" label="Importants" value={counts.important} extra={<span className="mk-kpi__sub">Marqués</span>} href={href({ filtre: 'important', p: undefined, id: undefined })} />
      </section>

      <div className="mk-inbox">
        <section className="mk-card mk-inbox__list">
          <nav className="mk-tabs mk-tabs--pills" aria-label="Filtrer les messages">
            {tabs.map((t) => (
              <a key={t.key} href={href({ filtre: t.key, p: undefined, id: undefined })} className={tab === t.key ? 'is-active' : undefined} aria-current={tab === t.key ? 'page' : undefined}>
                {t.label} <small>({t.key ? counts[t.key] : counts.all})</small>
              </a>
            ))}
          </nav>
          <form action={BASE} className="mk-filters">
            {tab && <input type="hidden" name="filtre" value={tab} />}
            <label className="mk-search">
              <Icon name="search" size={16} />
              <span className="sr-only">Rechercher un message</span>
              <input type="search" name="q" defaultValue={q} placeholder="Rechercher un message, un nom, un courriel…" />
            </label>
          </form>
          <ul className="mk-mails">
            {rows.length === 0 && <li className="mk-empty">{all.length === 0 ? 'Aucun message pour l’instant. Ils arriveront ici depuis la page « Nous contacter ».' : 'Aucun message dans cette vue.'}</li>}
            {rows.map((m) => (
              <li key={m.id}>
                <a href={href({ id: m.id })} className={['mk-mail', m.id === selectedId && 'is-selected', !m.readAt && 'is-unread'].filter(Boolean).join(' ')}>
                  <span className="mk-avatar">{m.name.slice(0, 1).toUpperCase()}</span>
                  <span className="mk-mail__body">
                    <span className="mk-mail__top">
                      <strong>{m.name}</strong>
                      <em className="mk-tag mk-tag--blue">Site web</em>
                      <time>{ago(m.createdAt, now)}</time>
                    </span>
                    <span className="mk-mail__subject">{m.subject}</span>
                    <span className="mk-mail__excerpt">{m.message}</span>
                  </span>
                  <span className="mk-mail__flags" aria-hidden="true">
                    {m.important && <span className="mk-star is-on">★</span>}
                    {m.status === 'answered' && <Icon name="reply" size={14} />}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <footer className="mk-pager">
            <span>{filtered.length ? `${(current - 1) * PER_PAGE + 1}–${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length}` : 'Aucun résultat'}</span>
            {pages > 1 && (
              <nav aria-label="Pagination">
                <a href={href({ p: Math.max(1, current - 1) })} aria-label="Page précédente" className="mk-icon-btn">
                  <Icon name="left" size={16} />
                </a>
                <a href={href({ p: Math.min(pages, current + 1) })} aria-label="Page suivante" className="mk-icon-btn">
                  <Icon name="right" size={16} />
                </a>
              </nav>
            )}
          </footer>
        </section>

        {selected ? (
          <>
            <section className="mk-card mk-inbox__read">
              <header className="mk-read__head">
                <div>
                  <h2>{selected.subject}</h2>
                  <p className="mk-kpi__sub">
                    Reçu via <em className="mk-tag mk-tag--blue">Site web</em> · {when(selected.createdAt)}
                  </p>
                </div>
                <Action id={selected.id} back={back} action="important" className={`mk-star-btn${selected.important ? ' is-on' : ''}`}>
                  <span aria-hidden="true">★</span>
                  <span className="sr-only">{selected.important ? 'Retirer des importants' : 'Marquer comme important'}</span>
                </Action>
              </header>
              <div className="mk-person mk-read__from">
                <span className="mk-avatar">{selected.name.slice(0, 1).toUpperCase()}</span>
                <span>
                  <strong>{selected.name}</strong>
                  <span>{selected.email}</span>
                </span>
              </div>
              <div className="mk-read__text">{selected.message}</div>
              <div className="mk-read__actions">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re : ${selected.subject}`)}&body=${encodeURIComponent(`Bonjour ${selected.name},\n\n\n\n— MKMI Québec`)}`}
                  className="mk-btn mk-btn--navy"
                >
                  <Icon name="reply" size={16} /> Répondre par courriel
                </a>
                {selected.status !== 'answered' && <Action id={selected.id} back={back} action="answered">Marquer comme répondu</Action>}
                <Action id={selected.id} back={back} action="unread">Marquer comme non lu</Action>
                {selected.status === 'archived' ? <Action id={selected.id} back={back} action="reopen">Désarchiver</Action> : <Action id={selected.id} back={back} action="archive">Archiver</Action>}
              </div>
              <p className="mk-kpi__sub">« Répondre » ouvre votre messagerie avec l’adresse et le sujet déjà remplis. Pensez ensuite à « Marquer comme répondu ».</p>
            </section>

            <aside className="mk-side mk-inbox__side">
              <section className="mk-card">
                <h2 className="mk-side__title">Informations du contact</h2>
                <ul className="mk-contact">
                  <li>
                    <Icon name="mail" size={16} /> <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </li>
                  {selected.phone && (
                    <li>
                      <Icon name="phone" size={16} /> <a href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}>{selected.phone}</a>
                    </li>
                  )}
                  <li>
                    <Icon name="message" size={16} /> {sameSender} message{sameSender > 1 ? 's' : ''} de cette personne
                  </li>
                  {selected.newsletter && (
                    <li>
                      <Icon name="send" size={16} /> Abonné(e) à l’infolettre
                    </li>
                  )}
                </ul>
              </section>

              <section className="mk-card">
                <h2 className="mk-side__title">Notes internes</h2>
                <form action="/api/admin/messages" method="post" className="mk-note-form">
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="action" value="note" />
                  <input type="hidden" name="back" value={back} />
                  <label className="sr-only" htmlFor="mk-notes">
                    Notes internes
                  </label>
                  <textarea id="mk-notes" name="notes" rows={4} defaultValue={selected.internalNotes ?? ''} placeholder="Visible seulement par l’équipe." />
                  <button type="submit" className="mk-btn mk-btn--outline">
                    Enregistrer la note
                  </button>
                </form>
              </section>

              <section className="mk-card">
                <h2 className="mk-side__title">Historique</h2>
                <ul className="mk-contact">
                  <li>
                    <Icon name="mail" size={16} /> Message reçu · {when(selected.createdAt)}
                  </li>
                  {selected.readAt && (
                    <li>
                      <Icon name="eye" size={16} /> Ouvert · {when(selected.readAt)}
                    </li>
                  )}
                  {selected.answeredAt && (
                    <li>
                      <Icon name="reply" size={16} /> Marqué répondu · {when(selected.answeredAt)}
                    </li>
                  )}
                </ul>
              </section>
            </aside>
          </>
        ) : (
          <section className="mk-card mk-inbox__read mk-inbox__placeholder">
            <Icon name="mail" size={40} />
            <p>Sélectionnez un message pour le lire.</p>
          </section>
        )}
      </div>
    </div>
  )
}
