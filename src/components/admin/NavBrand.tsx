'use client'

import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LEAF =
  'M32 2l5.5 11.5 6-3-2.5 14.5 9-9.5 2 6 10-2-4 11 5 3-15.5 12.5 2 6-15.5-2.5V62h-4V49.5L14.5 52l2-6L1 33.5l5-3-4-11 10 2 2-6 9 9.5L20.5 10.5l6 3z'

/** En-tête du menu de l’administration : logo MKMI et lien « Tableau de bord ». */
export function NavBrand() {
  const pathname = usePathname()
  const active = pathname === '/admin' || pathname === '/admin/'
  return (
    <div className="mk-nav-brand">
      <Link href="/admin" className="mk-nav-brand__logo" aria-label="MKMI Québec, tableau de bord">
        <svg viewBox="0 0 64 64" width="38" height="38" fill="#f5bf4f" aria-hidden="true">
          <path d={LEAF} />
        </svg>
        <span>
          <strong>MKMI</strong>
          <small>QUÉBEC</small>
        </span>
      </Link>
      <p className="mk-nav-brand__tagline">Une communauté. Une foi. Une mission.</p>
      <p className="mk-nav-brand__group">Tableau de bord</p>
      <Link href="/admin" className={`mk-nav-brand__home${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
        Tableau de bord
      </Link>
      <Link
        href="/admin/communications"
        className={`mk-nav-brand__home${pathname.startsWith('/admin/communications') ? ' is-active' : ''}`}
        aria-current={pathname.startsWith('/admin/communications') ? 'page' : undefined}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Communications
      </Link>
    </div>
  )
}

/** Pied du menu : lien vers le site public. */
export function NavFooter() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer" className="mk-nav-site">
      Voir le site
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    </a>
  )
}

/** Petit logo (fil d’Ariane de l’administration). */
export function AdminIcon() {
  return (
    <svg viewBox="0 0 64 64" width="24" height="24" fill="#f5bf4f" aria-hidden="true">
      <path d={LEAF} />
    </svg>
  )
}

/** Logo de la page de connexion. */
export function AdminLogo() {
  return (
    <span className="mk-login-logo">
      <svg viewBox="0 0 64 64" width="56" height="56" fill="#f5bf4f" aria-hidden="true">
        <path d={LEAF} />
      </svg>
      <span>
        <strong>MKMI Québec</strong>
        <small>Administration du site</small>
      </span>
    </span>
  )
}
