'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HandHeart, Heart, Menu, Search, X } from 'lucide-react'
import clsx from 'clsx'

import { Logo } from './Logo'
import { mainNav } from './nav'

export function Header({ siteName }: { siteName: string }) {
  const pathname = usePathname()
  // Le menu se referme de lui-même quand la page change.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open ? 'bg-navy-950/95 shadow-lg backdrop-blur' : 'bg-gradient-to-b from-navy-950/80 to-transparent',
      )}
    >
      <a
        href="#contenu"
        className="sr-only z-50 rounded bg-gold-400 px-4 py-2 text-navy-900 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Aller au contenu
      </a>
      <div className="container-site flex h-18 items-center justify-between gap-4 py-3">
        <Logo name={siteName} />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={clsx(
                    'relative py-2 text-sm font-medium transition-colors',
                    isActive(item.href) ? 'text-gold-400' : 'text-white/85 hover:text-white',
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded bg-gold-400" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/recherche"
            aria-label="Rechercher"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-white/85 hover:bg-white/10 hover:text-white sm:flex"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="hidden h-10 rounded-md px-2 text-xs font-semibold text-white/85 hover:text-white md:block"
            aria-label="Langue : français (English à venir)"
            title="English à venir"
          >
            FR
          </button>
          <Link
            href="/priere"
            className="hidden items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:inline-flex"
          >
            Prière <HandHeart className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/donner"
            className="inline-flex items-center gap-2 rounded-lg bg-gold-400 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-300"
          >
            Donner <Heart className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-x-0 top-18 bottom-0 overflow-y-auto bg-navy-950 lg:hidden"
      >
        <nav aria-label="Navigation mobile" className="container-site flex flex-col gap-1 py-8">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={clsx(
                'rounded-lg px-3 py-4 font-display text-2xl font-bold',
                isActive(item.href) ? 'text-gold-400' : 'text-white',
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href="/priere"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/40 py-3 font-semibold text-white"
            >
              Prière <HandHeart className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/recherche"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/40 py-3 font-semibold text-white"
            >
              Rechercher <Search className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
