import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

import { ButtonLink } from '@/components/site/ui'

export const metadata: Metadata = { title: 'Page introuvable', robots: { index: false } }

/** Page 404 en français, dans l’habillage du site. */
export default function NotFound() {
  return (
    <section className="bg-navy-950 pt-36 pb-24 text-white">
      <div className="container-site max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">Erreur 404</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Page introuvable</h1>
        <p className="mt-5 text-white/75">
          Cette page n’existe pas ou a été déplacée. Vérifiez l’adresse ou revenez à l’accueil.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour à l’accueil
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline-light">
            Nous contacter
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
