'use client'

import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'

import { useAuth } from '@payloadcms/ui'
import {
  BookOpen,
  CalendarDays,
  ChartNoAxesColumn,
  ClipboardList,
  DoorOpen,
  ExternalLink,
  FileText,
  Globe,
  HandCoins,
  HandHeart,
  House,
  Images,
  Inbox,
  Link2,
  MailCheck,
  Megaphone,
  MessagesSquare,
  Mic,
  PanelsTopLeft,
  Quote,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LEAF =
  'M32 2l5.5 11.5 6-3-2.5 14.5 9-9.5 2 6 10-2-4 11 5 3-15.5 12.5 2 6-15.5-2.5V62h-4V49.5L14.5 52l2-6L1 33.5l5-3-4-11 10 2 2-6 9 9.5L20.5 10.5l6 3z'

type Item = { href: string; label: string; icon: LucideIcon; slug?: string; match?: (p: string) => boolean }
type Group = { title: string; items: Item[] }

const C = (slug: string) => `/admin/collections/${slug}`

/** Menu de l’administration, regroupé comme les maquettes ; chaque onglet a son icône. */
const groups: Group[] = [
  {
    title: 'Tableau de bord',
    items: [
      { href: '/admin', label: 'Tableau de bord', icon: House, match: (p) => p === '/admin' || p === '/admin/' },
      { href: '/admin/communications', label: 'Communications', icon: MessagesSquare },
    ],
  },
  {
    title: 'Gestion',
    items: [
      { href: C('members'), slug: 'members', label: 'Membres', icon: UserRound },
      { href: C('events'), slug: 'events', label: 'Événements', icon: CalendarDays },
      { href: C('event-registrations'), slug: 'event-registrations', label: 'Inscriptions', icon: ClipboardList },
      { href: C('visit-plans'), slug: 'visit-plans', label: 'Visites', icon: DoorOpen },
      { href: C('donations'), slug: 'donations', label: 'Dons', icon: HandCoins },
      { href: C('ministries'), slug: 'ministries', label: 'Ministères', icon: UsersRound },
      { href: C('missions'), slug: 'missions', label: 'Missions', icon: Globe },
      { href: C('prayer-requests'), slug: 'prayer-requests', label: 'Demandes de prière', icon: HandHeart },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { href: C('sermons'), slug: 'sermons', label: 'Messages', icon: Mic },
      { href: C('faith-resources'), slug: 'faith-resources', label: 'Découvrir la foi', icon: BookOpen },
      { href: C('testimonials'), slug: 'testimonials', label: 'Témoignages', icon: Quote },
      { href: C('announcements'), slug: 'announcements', label: 'Annonces', icon: Megaphone },
      {
        href: '/admin/pages',
        label: 'Pages du site',
        icon: PanelsTopLeft,
        match: (p) => p.startsWith('/admin/pages') || p.startsWith('/admin/globals/page-') || p.startsWith('/admin/globals/home-page'),
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      { href: C('contact-messages'), slug: 'contact-messages', label: 'Boîte de réception', icon: Inbox },
      { href: C('email-campaigns'), slug: 'email-campaigns', label: 'Courriels', icon: Send },
      { href: C('social-posts'), slug: 'social-posts', label: 'Réseaux sociaux', icon: Share2 },
      { href: C('newsletter-subscribers'), slug: 'newsletter-subscribers', label: 'Abonnés infolettre', icon: MailCheck },
    ],
  },
  {
    title: 'Ressources',
    items: [
      { href: C('media'), slug: 'media', label: 'Médias', icon: Images },
      { href: C('documents'), slug: 'documents', label: 'Documents', icon: FileText },
      { href: C('links'), slug: 'links', label: 'Liens utiles', icon: Link2 },
    ],
  },
  {
    title: 'Paramètres',
    items: [
      { href: C('users'), slug: 'users', label: 'Utilisateurs', icon: ShieldCheck },
      { href: C('page-views'), slug: 'page-views', label: 'Statistiques', icon: ChartNoAxesColumn },
      {
        href: '/admin/parametres',
        label: 'Paramètres',
        icon: Settings,
        match: (p) => p.startsWith('/admin/parametres') || p.startsWith('/admin/globals/site-settings'),
      },
    ],
  },
]

/** En-tête et menu complet de l’administration (remplace les groupes par défaut de Payload). */
export function NavBrand() {
  const pathname = usePathname() ?? ''
  const { permissions } = useAuth()
  const can = (slug?: string) => !slug || Boolean(permissions?.collections?.[slug]?.read)
  const isActive = (i: Item) => (i.match ? i.match(pathname) : pathname === i.href || pathname.startsWith(`${i.href}/`))

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
      <nav aria-label="Menu de l’administration" className="mk-menu-nav">
        {groups.map((g) => {
          const items = g.items.filter((i) => can(i.slug))
          if (!items.length) return null
          return (
            <div key={g.title} className="mk-menu-nav__group">
              <p className="mk-nav-brand__group">{g.title}</p>
              <ul>
                {items.map((i) => {
                  const active = isActive(i)
                  const Icon = i.icon
                  return (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        className={`mk-nav-brand__home${active ? ' is-active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
                        {i.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

/** Pied du menu : lien vers le site public. */
export function NavFooter() {
  return (
    <a href="/" target="_blank" rel="noopener noreferrer" className="mk-nav-site">
      Voir le site <ExternalLink size={16} aria-hidden="true" />
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
