/* eslint-disable @next/next/no-html-link-for-pages -- liens de l’administration et exports : navigation classique voulue. */
import type { Payload } from 'payload'
import React from 'react'

import { donationCategories, donationMethods } from '@/collections/Donations'
import type { Donation } from '@/payload-types'
import './dashboard.scss'
import { Donut, Icon, Kpi, LineChart, ScreenHeader } from './ui'

type Props = {
  payload: Payload
  user?: { role?: string } | null
  searchParams?: Record<string, string | string[] | undefined>
}

const PER_PAGE = 12
const BASE = '/admin/collections/donations'
const money = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })
const money2 = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? ''
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
const label = (list: readonly { label: string; value: string }[], v?: string | null) => list.find((o) => o.value === v)?.label ?? '—'
const statusLabel: Record<string, string> = { confirmed: 'Confirmé', pending: 'En attente', refunded: 'Remboursé' }
const statusClass: Record<string, string> = { confirmed: 'upcoming', pending: 'live', refunded: 'cancelled' }
const shortDate = (iso: string) => new Intl.DateTimeFormat('fr-CA', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso)).replace('.', '')

function Trend({ now, before }: { now: number; before: number }) {
  if (!before) return <span className="mk-kpi__sub">vs mois dernier : —</span>
  const pct = Math.round(((now - before) / before) * 100)
  return (
    <span className="mk-kpi__trend">
      <span className={pct >= 0 ? 'mk-up' : 'mk-down'}>
        <Icon name={pct >= 0 ? 'up' : 'down'} size={14} /> {Math.abs(pct)} %
      </span>
      <span className="mk-kpi__sub">vs mois dernier</span>
    </span>
  )
}

/** Registre des dons (maquette « Dons »). Réservé aux administrateurs. */
export default async function DonationsList({ payload, user, searchParams = {} }: Props) {
  if (user?.role !== 'admin') {
    return (
      <div className="mk-dash mk-screen">
        <p className="mk-empty">Le registre des dons est réservé aux administrateurs.</p>
      </div>
    )
  }

  const q = one(searchParams.q)
  const cat = one(searchParams.categorie)
  const status = one(searchParams.statut)
  const method = one(searchParams.mode)
  const page = Math.max(1, Number(one(searchParams.p)) || 1)

  const all = await payload
    .find({ collection: 'donations', sort: '-date', limit: 100000, pagination: false, depth: 0, overrideAccess: true })
    .then((r) => r.docs)
    .catch(() => [] as Donation[])
  const valid = all.filter((d) => d.status !== 'refunded')

  const today = new Date()
  const ym = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  const thisMonth = ym(today)
  const lastMonth = ym(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1)))
  const inMonth = (m: string) => valid.filter((d) => d.date.slice(0, 7) === m)
  const sum = (list: Donation[]) => list.reduce((s, d) => s + d.amount, 0)
  const cur = inMonth(thisMonth)
  const prev = inMonth(lastMonth)
  const donors = new Set(cur.map((d) => (d.email || d.donorName).toLowerCase())).size
  const avg = cur.length ? sum(cur) / cur.length : 0
  const recurring = new Set(valid.filter((d) => d.recurring).map((d) => (d.email || d.donorName).toLowerCase())).size

  // 12 derniers mois
  const months = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 11 + i, 1)))
  const perMonth = months.map((m) => sum(inMonth(ym(m))))
  const monthLabels = months.map((m) => new Intl.DateTimeFormat('fr-CA', { month: 'short', timeZone: 'UTC' }).format(m).replace('.', ''))

  // Répartitions (12 derniers mois)
  const year = valid.filter((d) => d.date.slice(0, 7) >= ym(months[0]))
  const yearTotal = sum(year)
  const byCat = donationCategories
    .map((c) => ({ label: c.label, value: sum(year.filter((d) => d.category === c.value)) }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
  const byMethod = donationMethods
    .map((m) => ({ label: m.label, value: sum(year.filter((d) => d.method === m.value)) }))
    .filter((m) => m.value > 0)
    .sort((a, b) => b.value - a.value)

  const filtered = all.filter(
    (d) =>
      (!cat || d.category === cat) &&
      (!status || (d.status ?? 'confirmed') === status) &&
      (!method || d.method === method) &&
      (!q || norm(`${d.donorName} ${d.email ?? ''} ${d.notes ?? ''}`).includes(norm(q))),
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const href = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries({ q, categorie: cat, statut: status, mode: method, ...extra }))
      if (v !== undefined && v !== '') params.set(k, String(v))
    const s = params.toString()
    return `${BASE}${s ? `?${s}` : ''}`
  }

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Dons"
        title="Dons"
        text="Suivez et gérez les dons reçus pour soutenir la mission de MKMI Québec."
        actions={
          <>
            <a href={`${BASE}/create`} className="mk-btn mk-btn--gold">
              <Icon name="plus" size={18} /> Enregistrer un don
            </a>
            <a href="/api/export/dons" className="mk-btn mk-btn--outline">
              <Icon name="down" size={18} /> Exporter (CSV)
            </a>
          </>
        }
      />

      <section className="mk-kpis mk-kpis--4">
        <Kpi icon="heart" label="Total des dons (ce mois)" value={money.format(sum(cur))} extra={<Trend now={sum(cur)} before={sum(prev)} />} />
        <Kpi icon="users" tone="green" label="Donateurs (ce mois)" value={donors} extra={<span className="mk-kpi__sub">{cur.length} don{cur.length > 1 ? 's' : ''}</span>} />
        <Kpi icon="chart" tone="violet" label="Don moyen (ce mois)" value={money.format(avg)} />
        <Kpi icon="calendar" tone="gold" label="Donateurs récurrents" value={recurring} extra={<span className="mk-kpi__sub">Dons mensuels</span>} />
      </section>

      <section className="mk-grid3">
        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Évolution des dons</h2>
            <span className="mk-chip">12 derniers mois</span>
          </div>
          <LineChart data={perMonth} labels={monthLabels} label="Total des dons par mois" unit=" $" every={2} />
        </div>
        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Dons par catégorie</h2>
          </div>
          {yearTotal ? (
            <Donut parts={byCat} total={Math.round(yearTotal)} caption="$ sur 12 mois" colors={['#0b1628', '#1d4fa3', '#2bb58a', '#f5bf4f', '#e0473b', '#7b5cd6', '#7c8db0', '#c9d3e6']} />
          ) : (
            <p className="mk-empty">La répartition apparaîtra avec les premiers dons.</p>
          )}
        </div>
        <div className="mk-card">
          <div className="mk-card__head">
            <h2>Modes de paiement</h2>
          </div>
          {byMethod.length ? (
            <ul className="mk-bars">
              {byMethod.map((m) => {
                const pct = Math.round((m.value / yearTotal) * 100)
                return (
                  <li key={m.label}>
                    <span>{m.label}</span>
                    <strong>{pct} %</strong>
                    <span className="mk-progress__bar">
                      <span style={{ width: `${pct}%` }} />
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mk-empty">Aucun don enregistré pour l’instant.</p>
          )}
        </div>
      </section>

      <div className="mk-split mk-split--wide">
        <section className="mk-card mk-table-card">
          <div className="mk-toolbar">
            <form action={BASE} className="mk-filters">
              <label className="mk-search">
                <Icon name="search" size={16} />
                <span className="sr-only">Rechercher un donateur</span>
                <input type="search" name="q" defaultValue={q} placeholder="Rechercher un donateur…" />
              </label>
              <select name="categorie" defaultValue={cat} aria-label="Catégorie">
                <option value="">Toutes les catégories</option>
                {donationCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <select name="mode" defaultValue={method} aria-label="Mode de paiement">
                <option value="">Tous les modes</option>
                {donationMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select name="statut" defaultValue={status} aria-label="Statut">
                <option value="">Tous les statuts</option>
                {Object.entries(statusLabel).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
              <button type="submit" className="mk-btn mk-btn--navy">
                Filtrer
              </button>
              <a href={BASE} className="mk-btn mk-btn--outline">
                <Icon name="refresh" size={16} /> Réinitialiser
              </a>
            </form>
          </div>
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Donateur</th>
                  <th style={{ textAlign: 'right' }}>Montant</th>
                  <th>Catégorie</th>
                  <th>Mode de paiement</th>
                  <th>Statut</th>
                  <th>Reçu</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="mk-empty">
                      {all.length === 0 ? 'Aucun don enregistré. Cliquez sur « Enregistrer un don » pour commencer le registre.' : 'Aucun don ne correspond à votre recherche.'}
                    </td>
                  </tr>
                )}
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td className="mk-meta">
                      <span>{shortDate(d.date)}</span>
                    </td>
                    <td>
                      <a href={`${BASE}/${d.id}`} className="mk-person">
                        <span className="mk-avatar">{d.donorName.slice(0, 1).toUpperCase()}</span>
                        <span>
                          <strong>{d.donorName}</strong>
                          <span>{d.email || (d.recurring ? 'Don mensuel' : '')}</span>
                        </span>
                      </a>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>{money2.format(d.amount)}</strong>
                    </td>
                    <td>
                      <span className="mk-tag mk-tag--gold">{label(donationCategories, d.category)}</span>
                    </td>
                    <td>{label(donationMethods, d.method)}</td>
                    <td>
                      <span className={`mk-status mk-status--${statusClass[d.status ?? 'confirmed']}`}>{statusLabel[d.status ?? 'confirmed']}</span>
                    </td>
                    <td>{d.receiptSent ? <Icon name="check" size={18} /> : <span className="mk-kpi__sub">—</span>}</td>
                    <td className="mk-row-actions">
                      <a href={`${BASE}/${d.id}`} className="mk-btn mk-btn--ghost">
                        Modifier
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="mk-pager">
            <span>
              {filtered.length === 0
                ? 'Aucun résultat'
                : `Affichage de ${(current - 1) * PER_PAGE + 1} à ${Math.min(current * PER_PAGE, filtered.length)} sur ${filtered.length} don${filtered.length > 1 ? 's' : ''}`}
            </span>
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

        <aside className="mk-side">
          <section className="mk-card">
            <div className="mk-card__head">
              <h2>Dons récents</h2>
            </div>
            {valid.length === 0 ? (
              <p className="mk-empty">Aucun don pour l’instant.</p>
            ) : (
              <ul className="mk-people">
                {valid.slice(0, 5).map((d) => (
                  <li key={d.id}>
                    <span className="mk-avatar">{d.donorName.slice(0, 1).toUpperCase()}</span>
                    <span>
                      <strong>{money2.format(d.amount)}</strong>
                      <span>
                        {d.donorName} · {shortDate(d.date)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="mk-card">
            <h2 className="mk-side__title">Actions rapides</h2>
            <div className="mk-quick">
              <a href={`${BASE}/create`} className="mk-tone-gold">
                <Icon name="plus" size={20} /> Enregistrer un don
              </a>
              <a href="/api/export/dons" className="mk-tone-violet">
                <Icon name="down" size={20} /> Exporter le registre
              </a>
              <a href="/admin/globals/page-don" className="mk-tone-blue">
                <Icon name="pen" size={20} /> Modifier la page Donner
              </a>
              <a href="/admin/globals/site-settings" className="mk-tone-green">
                <Icon name="external" size={20} /> Lien de don en ligne
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
