import { ArrowRight, MessageCircle } from 'lucide-react'

import { asMedia } from '@/lib/content'
import type { HomePage } from '@/payload-types'
import { Photo } from '../site/Photo'
import { ButtonLink } from '../site/ui'

export function FinalCta({ cta }: { cta: NonNullable<HomePage['finalCta']> }) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden text-white">
      <div className="absolute inset-0 -z-10">
        <Photo media={asMedia(cta.background)} alt="" placeholder="" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/75 to-navy-950/80" />
      </div>
      <div className="container-site flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-lg">
          <h2 id="cta-title" className="text-3xl font-bold sm:text-4xl">
            {cta.title}
          </h2>
          <p className="mt-3 text-white/80">{cta.text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/planifier-ma-visite">
            Planifier ma visite <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline-light">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Nous contacter
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
