import type { Payload } from 'payload'
import React from 'react'

import { audienceOptions } from '@/collections/EmailCampaigns'
import type { EmailCampaign } from '@/payload-types'
import './dashboard.scss'
import { Icon, Kpi, ScreenHeader } from './ui'

type Props = { payload: Payload; searchParams?: Record<string, string | string[] | undefined> }

const BASE = '/admin/collections/email-campaigns'
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const when = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Toronto' }).format(new Date(iso)) : '—'
const statusLabel: Record<string, string> = { draft: 'Brouillon', scheduled: 'Planifié', sent: 'Envoyé' }
const statusClass: Record<string, string> = { draft: 'draft', scheduled: 'scheduled', sent: 'upcoming' }

/** Courriels et infolettres (maquette « Courriels »). */
export default async function EmailsList({ payload, searchParams = {} }: Props) {
  const q = one(searchParams.q)
  const tab = one(searchParams.statut)

  const [all, subscribers, regs, contacts] = await Promise.all([
    payload
      .find({ collection: 'email-campaigns', sort: '-updatedAt', limit: 1000, pagination: false, depth: 1, overrideAccess: true })
      .then((r) => r.docs)
      .catch(() => [] as EmailCampaign[]),
    payload.count({ collection: 'newsletter-subscribers', overrideAccess: true }).then((r) => r.totalDocs).catch(() => 0),
    payload
      .find({ collection: 'event-registrations', limit: 10000, pagination: false, depth: 0, overrideAccess: true })
      .then((r) => new Set(r.docs.map((d) => d.email.toLowerCase())).size)
      .catch(() => 0),
    payload
      .find({ collection: 'contact-messages', limit: 10000, pagination: false, depth: 0, overrideAccess: true })
      .then((r) => new Set(r.docs.map((d) => d.email.toLowerCase())).size)
      .catch(() => 0),
  ])

  const count = (s: string) => (s ? all.filter((c) => (c.status ?? 'draft') === s).length : all.length)
  const filtered = all.filter((c) => (!tab || (c.status ?? 'draft') === tab) && (!q || norm(`${c.subject} ${c.preheader ?? ''}`).includes(norm(q))))
  const audiences = [
    { label: 'Abonnés à l’infolettre', n: subscribers, href: '/admin/collections/newsletter-subscribers' },
    { label: 'Personnes inscrites à un événement', n: regs, href: '/admin/collections/event-registrations' },
    { label: 'Personnes ayant écrit via le site', n: contacts, href: '/admin/collections/contact-messages' },
  ]
  const tabs = [
    { key: '', label: `Tous (${all.length})` },
    { key: 'draft', label: `Brouillons (${count('draft')})` },
    { key: 'scheduled', label: `Planifiés (${count('scheduled')})` },
    { key: 'sent', label: `Envoyés (${count('sent')})` },
  ]

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Courriels"
        title="Courriels"
        text="Préparez vos infolettres et courriels à la communauté : rédaction, destinataires et date d’envoi."
        actions={
          <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
            <Icon name="plus" size={18} /> Nouveau courriel
          </a>
        }
      />

      <div className="mk-notice">
        <Icon name="send" size={20} />
        <p>
          <strong>L’envoi automatique n’est pas encore branché.</strong> Les courriels se rédigent et se planifient ici ; il faudra choisir un service
          d’envoi (Brevo est recommandé, gratuit jusqu’à 300 courriels par jour) pour qu’ils partent vraiment.
        </p>
      </div>

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="mail" label="Courriels préparés" value={all.length} />
        <Kpi icon="clock" tone="violet" label="Planifiés" value={count('scheduled')} extra={<span className="mk-kpi__sub">En attente d’envoi</span>} />
        <Kpi icon="check" tone="green" label="Envoyés" value={count('sent')} />
        <Kpi icon="users" tone="gold" label="Abonnés infolettre" value={subscribers} extra={<span className="mk-kpi__sub">Destinataires possibles</span>} href="/admin/collections/newsletter-subscribers" />
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-card mk-table-card">
          <div className="mk-toolbar">
            <nav className="mk-tabs" aria-label="Statut">
              {tabs.map((t) => (
                <a key={t.key} href={`${BASE}${t.key ? `?statut=${t.key}` : ''}`} className={tab === t.key ? 'is-active' : undefined}>
                  {t.label}
                </a>
              ))}
            </nav>
            <form action={BASE} className="mk-filters">
              {tab && <input type="hidden" name="statut" value={tab} />}
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher un courriel</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher un courriel…" />
              </label>
            </form>
          </div>
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Objet</th>
                  <th>Destinataires</th>
                  <th>Statut</th>
                  <th>Envoi</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="mk-empty">
                      {all.length === 0 ? 'Aucun courriel préparé. Cliquez sur « Nouveau courriel » pour rédiger votre première infolettre.' : 'Aucun courriel dans cette vue.'}
                    </td>
                  </tr>
                )}
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <a href={`${BASE}/${c.id}`} className="mk-person">
                        <span className="mk-file-icon mk-tag--blue">
                          <Icon name="mail" size={18} />
                        </span>
                        <span>
                          <strong>{c.subject}</strong>
                          <span>{c.preheader || 'Sans texte d’aperçu'}</span>
                        </span>
                      </a>
                    </td>
                    <td>
                      <span className="mk-tag">{audienceOptions.find((a) => a.value === c.audience)?.label}</span>
                    </td>
                    <td>
                      <span className={`mk-status mk-status--${statusClass[c.status ?? 'draft']}`}>{statusLabel[c.status ?? 'draft']}</span>
                    </td>
                    <td className="mk-meta">
                      <span>{c.status === 'sent' ? when(c.sentAt) : when(c.scheduledAt)}</span>
                    </td>
                    <td className="mk-row-actions">
                      <a href={`${BASE}/${c.id}`} className="mk-btn mk-btn--ghost">
                        Modifier
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="mk-side">
          <section className="mk-card">
            <h2 className="mk-side__title">Listes de destinataires</h2>
            <ul className="mk-cats">
              {audiences.map((a) => (
                <li key={a.label}>
                  <a href={a.href}>
                    <Icon name="users" size={16} /> {a.label}
                  </a>
                  <span>{a.n}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href={`${BASE}/create`} className="mk-tone-blue">
                <Icon name="plus" size={20} /> Rédiger une infolettre
              </a>
              <a href="/admin/collections/newsletter-subscribers" className="mk-tone-green">
                <Icon name="users" size={20} /> Voir les abonnés
              </a>
              <a href="/admin/collections/announcements" className="mk-tone-violet">
                <Icon name="megaphone" size={20} /> Annonces
              </a>
              <a href="/admin/communications" className="mk-tone-gold">
                <Icon name="message" size={20} /> Communications
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
