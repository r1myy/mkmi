import { ArrowRight, CalendarDays, MapPin, PlayCircle } from 'lucide-react'

import { asMedia } from '@/lib/content'
import type { HomePage, SiteSetting } from '@/payload-types'
import { Photo } from '../site/Photo'
import { ButtonLink, Eyebrow } from '../site/ui'

export function Hero({ hero, settings }: { hero: NonNullable<HomePage['hero']>; settings: SiteSetting }) {
  const image = asMedia(hero.image)
  const video = asMedia(hero.video)
  const directions = settings.directionsUrl

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 -z-10">
        {video?.url ? (
          <video
            className="h-full w-full object-cover motion-reduce:hidden"
            src={video.url}
            poster={image?.url ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <Photo
            media={image}
            alt=""
            placeholder="Photo ou vidéo du culte à venir"
            className="h-full w-full"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/70 to-transparent" />
      </div>

      <div className="container-site grid min-h-[640px] items-end gap-10 pt-32 pb-14 lg:min-h-[min(100svh,760px)] lg:grid-cols-[1fr_300px] lg:items-center lg:pb-20">
        <div className="max-w-xl">
          <Eyebrow light>{hero.eyebrow}</Eyebrow>
          <h1
            id="hero-title"
            className="text-[2.6rem] leading-[1.02] font-extrabold tracking-tight uppercase sm:text-6xl lg:text-7xl"
          >
            {(hero.lines ?? []).map((line, i) => (
              <span key={line.id ?? i} className="block">
                {line.lead} <span className="text-gold-400">{line.highlight}</span>
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/planifier-ma-visite">
              Nous rejoindre <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/decouvrir" variant="outline-light" className="bg-navy-950/40">
              <PlayCircle className="h-5 w-5" aria-hidden="true" /> Découvrir MKMI
            </ButtonLink>
          </div>
        </div>

        <aside
          aria-label="Prochain culte"
          className="w-full max-w-sm rounded-[var(--radius-card)] border border-white/15 bg-navy-950/70 p-6 backdrop-blur-md lg:justify-self-end"
        >
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold-400/60 text-gold-400">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase">Prochain culte</p>
              <p className="mt-1 font-display text-lg font-bold">{settings.serviceDay}</p>
              <p className="text-sm text-white/70">{settings.serviceTime}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-gold-400" aria-hidden="true" /> {settings.city}
              </p>
            </div>
          </div>
          <a
            href={directions || '/contact'}
            {...(directions ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-xs font-bold tracking-wide uppercase transition-colors hover:bg-white/10"
          >
            Voir l’itinéraire <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </aside>
      </div>
    </section>
  )
}
