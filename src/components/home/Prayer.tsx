import { ArrowRight } from 'lucide-react'

import { asMedia } from '@/lib/content'
import type { HomePage } from '@/payload-types'
import { Photo } from '../site/Photo'
import { ButtonLink, Eyebrow } from '../site/ui'

export function Prayer({ prayer }: { prayer: NonNullable<HomePage['prayer']> }) {
  return (
    <section aria-labelledby="prayer-title" className="grid bg-navy-900 text-white lg:grid-cols-2">
      <div className="relative min-h-64 lg:min-h-[380px]">
        <Photo media={asMedia(prayer.image)} className="absolute inset-0" placeholder="Photo de prière à venir" sizes="(min-width:1024px) 50vw, 100vw" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent to-navy-900 lg:block" />
      </div>
      <div className="flex items-center px-4 py-14 sm:px-8 lg:px-14">
        <div className="max-w-lg">
          <Eyebrow light>{prayer.eyebrow}</Eyebrow>
          <h2 id="prayer-title" className="text-3xl font-bold sm:text-4xl">
            {prayer.title}
          </h2>
          <p className="mt-4 whitespace-pre-line text-white/80">{prayer.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/priere#demande">
              Envoyer une demande de prière <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/temoignages#partager" variant="outline-light">
              Partager un témoignage
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
