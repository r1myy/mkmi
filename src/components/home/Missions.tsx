import { ArrowRight } from 'lucide-react'

import { asMedia } from '@/lib/content'
import type { HomePage } from '@/payload-types'
import { Photo } from '../site/Photo'
import { ButtonLink, Eyebrow } from '../site/ui'

export function Missions({ missions }: { missions: NonNullable<HomePage['missions']> }) {
  const images = (missions.images ?? []).map(asMedia)
  const slot = (i: number) => images[i] ?? null

  return (
    <section aria-labelledby="missions-title" className="py-16 lg:py-20">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[.8fr_1.4fr]">
        <div>
          <Eyebrow>{missions.eyebrow}</Eyebrow>
          <h2 id="missions-title" className="text-3xl font-extrabold text-navy-900 uppercase sm:text-4xl">
            {missions.title}
          </h2>
          <p className="mt-2 text-lg font-bold text-navy-900">{missions.subtitle}</p>
          <p className="mt-4 leading-relaxed text-muted">{missions.text}</p>
          <ButtonLink href="/missions" className="mt-7">
            En savoir plus sur nos missions <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
        <div>
          <div className="grid h-72 grid-cols-3 grid-rows-2 gap-2 sm:h-80">
            <Photo media={slot(0)} className="row-span-2 rounded-l-[var(--radius-card)]" sizes="33vw" />
            <Photo media={slot(1)} className="row-span-2" sizes="33vw" />
            <Photo media={slot(2)} className="rounded-tr-[var(--radius-card)]" sizes="33vw" placeholder="" />
            <div className="grid grid-cols-2 gap-2">
              <Photo media={slot(3)} sizes="16vw" placeholder="" />
              <Photo media={slot(4)} className="rounded-br-[var(--radius-card)]" sizes="16vw" placeholder="" />
            </div>
          </div>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs font-semibold tracking-widest text-muted uppercase">
            {(missions.zones ?? []).map((z, i) => (
              <li key={z.id ?? i} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="text-navy-900/20">|</span>}
                {z.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
