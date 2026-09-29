/* eslint-disable @next/next/no-html-link-for-pages -- liens de l’administration : navigation classique voulue. */
import React, { type ReactNode } from 'react'

/* ---------- petites icônes (traits, 24 × 24) ---------- */
const paths = {
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clipboard: 'M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1zM8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M9 12l2 2 4-4',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  heart: 'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
  pen: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  up: 'M12 19V5M5 12l7-7 7 7',
  down: 'M12 5v14M19 12l-7 7-7-7',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  external: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  refresh: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  radio: 'M4.9 19.1a10 10 0 0 1 0-14.2M19.1 4.9a10 10 0 0 1 0 14.2M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  check: 'M20 6 9 17l-5-5',
  message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  reply: 'M9 17l-5-5 5-5M4 12h11a5 5 0 0 1 5 5v2',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  x: 'M18 6 6 18M6 6l12 12',
  tag: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01',
}
export type IconName = keyof typeof paths

export const Icon = ({ name, size = 22 }: { name: IconName; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={paths[name]} />
  </svg>
)


/** En-tête d’écran : fil d’Ariane, titre, description et boutons. */
export function ScreenHeader({ crumb, title, text, actions }: { crumb: string; title: string; text: string; actions?: ReactNode }) {
  return (
    <header className="mk-screen__head">
      <div>
        <p className="mk-crumb">
          <a href="/admin">Accueil</a> <span aria-hidden="true">›</span> <strong>{crumb}</strong>
        </p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {actions && <div className="mk-screen__actions">{actions}</div>}
    </header>
  )
}

export function Kpi({ icon, tone = 'navy', label, value, extra, href }: { icon: IconName; tone?: string; label: string; value: ReactNode; extra?: ReactNode; href?: string }) {
  const body = (
    <>
      <span className={`mk-kpi__icon mk-bg-${tone}`}>
        <Icon name={icon} size={26} />
      </span>
      <span className="mk-kpi__body">
        <span className="mk-kpi__label">{label}</span>
        <span className="mk-kpi__row">
          <strong className="mk-kpi__value">{value}</strong>
          {extra}
        </span>
      </span>
    </>
  )
  return href ? (
    <a href={href} className="mk-card mk-kpi">
      {body}
    </a>
  ) : (
    <div className="mk-card mk-kpi">{body}</div>
  )
}

const fmtN = new Intl.NumberFormat('fr-CA')

/** Anneau de répartition avec légende. */
export function Donut({ parts, total, caption, colors }: { parts: { label: string; value: number }[]; total: number; caption: string; colors?: string[] }) {
  const palette = colors ?? ['#1d4fa3', '#f5bf4f', '#2bb58a', '#7c8db0', '#c9d3e6']
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
                stroke={palette[i % palette.length]}
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
          {fmtN.format(total)}
        </text>
        <text x="80" y="98" textAnchor="middle" className="mk-axis">
          {caption}
        </text>
      </svg>
      <ul>
        {parts.map((p, i) => (
          <li key={p.label}>
            <span className="mk-swatch" style={{ background: palette[i % palette.length] }} />
            <span className="mk-donut__label">{p.label}</span>
            <strong>{total ? Math.round((p.value / total) * 100) : 0} %</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

