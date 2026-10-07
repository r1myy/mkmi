'use client'

import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Retour en haut de la page"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-400 hover:text-navy-900"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
