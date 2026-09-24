'use client'

import { useActionState } from 'react'
import { ArrowRight } from 'lucide-react'

import { subscribeNewsletter, type FormState } from '@/app/(frontend)/actions'

export function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeNewsletter, { status: 'idle' })

  return (
    <form action={action} className="space-y-3" noValidate>
      <div className="flex overflow-hidden rounded-lg border border-white/25 focus-within:border-gold-400">
        <label htmlFor="newsletter-email" className="sr-only">
          Votre courriel
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Votre courriel"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none"
        />
        {/* Piège à robots : doit rester vide. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button
          type="submit"
          disabled={pending}
          aria-label="S’inscrire à l’infolettre"
          className="flex w-12 items-center justify-center bg-gold-400 text-navy-900 transition-colors hover:bg-gold-300 disabled:opacity-60"
        >
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-white/60">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-gold-400" />
        <span>
          En vous inscrivant, vous acceptez de recevoir nos nouvelles. Vous pouvez vous désabonner en tout temps.
        </span>
      </label>
      <p aria-live="polite" className={state.status === 'error' ? 'text-xs text-red-300' : 'text-xs text-gold-300'}>
        {state.message}
      </p>
    </form>
  )
}
