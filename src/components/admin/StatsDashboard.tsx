import type { Payload } from 'payload'
import React from 'react'

import './stats.scss'

type Props = { payload: Payload }

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

async function count(payload: Payload, collection: Parameters<Payload['count']>[0]['collection'], where = {}) {
  try {
    const { totalDocs } = await payload.count({ collection, where, overrideAccess: true })
    return totalDocs
  } catch {
    return 0
  }
}

/**
 * Tableau de bord affiché en haut de l’administration : indicateurs clés
 * et fréquentation des 30 derniers jours (sans données personnelles).
 */
export default async function StatsDashboard({ payload }: Props) {
  const today = new Date()
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setUTCDate(d.getUTCDate() - (29 - i))
    return dayKey(d)
  })
  const since30 = days[0]
  const since7 = days[23]

  const [views, newPrayers, prayers, visits, registrations, subscribers, upcomingEvents, sermons] =
    await Promise.all([
      payload
        .find({
          collection: 'page-views',
          where: { day: { greater_than_equal: since30 } },
          limit: 5000,
          pagination: false,
          overrideAccess: true,
        })
        .catch(() => ({ docs: [] as { day: string; path: string; count: number }[] })),
      count(payload, 'prayer-requests', { status: { equals: 'new' } }),
      count(payload, 'prayer-requests'),
      count(payload, 'visit-plans'),
      count(payload, 'event-registrations'),
      count(payload, 'newsletter-subscribers'),
      count(payload, 'events', { startsAt: { greater_than_equal: today.toISOString() } }),
      count(payload, 'sermons'),
    ])

  const perDay = new Map(days.map((d) => [d, 0]))
  const perPath = new Map<string, number>()
  let total30 = 0
  let total7 = 0
  for (const v of views.docs) {
    perDay.set(v.day, (perDay.get(v.day) ?? 0) + v.count)
    perPath.set(v.path, (perPath.get(v.path) ?? 0) + v.count)
    total30 += v.count
    if (v.day >= since7) total7 += v.count
  }
  const max = Math.max(1, ...perDay.values())
  const topPages = [...perPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const tiles = [
    { label: 'Vues (7 jours)', value: total7, href: '/admin/collections/page-views' },
    { label: 'Vues (30 jours)', value: total30, href: '/admin/collections/page-views' },
    {
      label: 'Nouvelles demandes de prière',
      value: newPrayers,
      sub: `${prayers} au total`,
      href: '/admin/collections/prayer-requests',
    },
    { label: 'Visites planifiées', value: visits, href: '/admin/collections/visit-plans' },
    { label: 'Inscriptions aux événements', value: registrations, href: '/admin/collections/event-registrations' },
    { label: 'Abonnés infolettre', value: subscribers, href: '/admin/collections/newsletter-subscribers' },
    { label: 'Événements à venir', value: upcomingEvents, href: '/admin/collections/events' },
    { label: 'Messages publiés', value: sermons, href: '/admin/collections/sermons' },
  ]

  return (
    <section className="mkmi-stats" aria-labelledby="mkmi-stats-title">
      <h2 id="mkmi-stats-title">Statistiques</h2>
      <div className="mkmi-stats__tiles">
        {tiles.map((t) => (
          <a key={t.label} href={t.href} className="mkmi-stats__tile">
            <span className="mkmi-stats__value">{t.value.toLocaleString('fr-CA')}</span>
            <span className="mkmi-stats__label">{t.label}</span>
            {t.sub ? <span className="mkmi-stats__sub">{t.sub}</span> : null}
          </a>
        ))}
      </div>
      <div className="mkmi-stats__panels">
        <div className="mkmi-stats__panel">
          <h3>Fréquentation — 30 derniers jours</h3>
          <div className="mkmi-stats__chart" role="img" aria-label={`${total30} vues sur 30 jours`}>
            {[...perDay.entries()].map(([day, n]) => (
              <div key={day} className="mkmi-stats__bar" title={`${day} : ${n} vue(s)`}>
                <span style={{ height: `${(n / max) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="mkmi-stats__axis">
            <span>{since30}</span>
            <span>{days[29]}</span>
          </div>
        </div>
        <div className="mkmi-stats__panel">
          <h3>Pages les plus vues</h3>
          {topPages.length === 0 ? (
            <p className="mkmi-stats__empty">Pas encore de données.</p>
          ) : (
            <ol className="mkmi-stats__top">
              {topPages.map(([path, n]) => (
                <li key={path}>
                  <span>{path}</span>
                  <strong>{n.toLocaleString('fr-CA')}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <p className="mkmi-stats__note">
        Statistiques anonymes : aucun cookie ni adresse IP n’est enregistré.
      </p>
    </section>
  )
}
