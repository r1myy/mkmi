'use client'

import { useEffect } from 'react'

/**
 * Ouvre directement l’onglet de la section demandée :
 * - depuis le site : lien « Modifier » vers /admin/globals/…?section=Nom de la section ;
 * - depuis l’aperçu en direct : message envoyé par la page affichée à droite.
 */
export function SectionFocus() {
  useEffect(() => {
    const focus = (label: string) => {
      const target = label.trim().toLowerCase()
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.tabs-field__tab-button'))
      const button = buttons.find((b) => b.textContent?.trim().toLowerCase() === target)
      if (!button) return false
      button.click()
      button.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
      return true
    }

    const initial = new URLSearchParams(window.location.search).get('section')
    if (initial) {
      // Les onglets s’affichent après le premier rendu : on réessaie quelques fois.
      let tries = 0
      const timer = window.setInterval(() => {
        if (focus(initial) || ++tries > 20) window.clearInterval(timer)
      }, 150)
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; section?: string } | null
      if (data?.type === 'mkmi:focus-section' && data.section) focus(data.section)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return null
}
