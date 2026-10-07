import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

import type { SiteSetting } from '@/payload-types'
import { Logo } from './Logo'
import { NewsletterForm } from './NewsletterForm'
import { SocialIcons } from './SocialIcons'
import { footerNav } from './nav'
import { BackToTop } from './BackToTop'

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xs font-bold tracking-widest text-white uppercase">{title}</h2>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-white/65 transition-colors hover:text-gold-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer({ settings }: { settings: SiteSetting }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_.8fr_1.2fr_1.5fr]">
        <div className="space-y-5">
          <Logo name={settings.name ?? 'MKMI Québec'} />
          <p className="text-sm whitespace-pre-line text-white/65">{settings.tagline}</p>
          <SocialIcons settings={settings} />
        </div>
        <FooterColumn title="Explorer" links={footerNav.explorer} />
        <FooterColumn title="Participer" links={footerNav.participer} />
        <div>
          <h2 className="mb-4 text-xs font-bold tracking-widest text-white uppercase">Nous contacter</h2>
          <ul className="space-y-3 text-sm text-white/65">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <span>
                {settings.address}
                <br />
                {settings.city} {settings.postalCode}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              {/\d{3}.*\d{4}/.test(settings.phone ?? '') ? (
                <a href={`tel:+1${(settings.phone ?? '').replace(/\D/g, '').slice(-10)}`} className="hover:text-gold-400">
                  {settings.phone}
                </a>
              ) : (
                <span>{settings.phone}</span>
              )}
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              {settings.email?.includes('@') ? (
                <a href={`mailto:${settings.email}`} className="hover:text-gold-400">
                  {settings.email}
                </a>
              ) : (
                <span>{settings.email}</span>
              )}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold text-white">Recevez nos nouvelles</h2>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}
