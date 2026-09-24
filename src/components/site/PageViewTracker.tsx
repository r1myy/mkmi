'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Envoie une vue de page anonyme (sans cookie ni identifiant) pour le tableau de bord. */
export function PageViewTracker() {
  const pathname = usePathname()
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    const body = JSON.stringify({ path: pathname })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
    } else {
      void fetch('/api/track', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } })
    }
  }, [pathname])
  return null
}
