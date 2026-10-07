import { siFacebook, siInstagram, siTiktok, siWhatsapp, siYoutube } from 'simple-icons'

import type { SiteSetting } from '@/payload-types'

const networks = [
  { key: 'facebook', label: 'Facebook', icon: siFacebook },
  { key: 'instagram', label: 'Instagram', icon: siInstagram },
  { key: 'youtube', label: 'YouTube', icon: siYoutube },
  { key: 'tiktok', label: 'TikTok', icon: siTiktok },
  { key: 'whatsapp', label: 'WhatsApp', icon: siWhatsapp },
] as const

/** N’affiche que les réseaux dont l’URL officielle a été saisie dans l’administration. */
export function SocialIcons({ settings }: { settings: SiteSetting }) {
  const items = networks.filter((n) => settings[n.key])
  if (items.length === 0) return null
  return (
    <ul className="flex gap-3" aria-label="Réseaux sociaux">
      {items.map((n) => (
        <li key={n.key}>
          <a
            href={settings[n.key] as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={n.label}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-400 hover:text-navy-900"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d={n.icon.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
