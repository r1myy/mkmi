import Link from 'next/link'
import { ArrowRight, BookOpen, Users, UsersRound } from 'lucide-react'

import { asMedia } from '@/lib/content'
import type { HomePage } from '@/payload-types'
import { Photo } from '../site/Photo'
import { ButtonLink, Eyebrow } from '../site/ui'

const icons = { church: UsersRound, book: BookOpen, users: Users }

export function Welcome({ welcome }: { welcome: NonNullable<HomePage['welcome']> }) {
  return (
    <section aria-labelledby="welcome-title" className="bg-mist py-16 lg:py-20">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[.9fr_1.4fr]">
        <div>
          <Eyebrow>{welcome.eyebrow}</Eyebrow>
          <h2 id="welcome-title" className="text-3xl font-extrabold text-navy-900 sm:text-4xl">
            {welcome.title}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">{welcome.text}</p>
          <ButtonLink href="/planifier-ma-visite" className="mt-7">
            Planifier ma première visite <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          {(welcome.cards ?? []).map((card, i) => {
            const Icon = icons[card.icon ?? 'users'] ?? Users
            return (
              <li key={card.id ?? i}>
                <Link
                  href={card.href || '/decouvrir'}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy-900/5 bg-white shadow-[0_10px_30px_-18px_rgba(11,22,40,.35)] transition-transform hover:-translate-y-1"
                >
                  <Photo media={asMedia(card.image)} className="aspect-[4/3] w-full" tone="light" sizes="(min-width:1024px) 240px, 100vw" />
                  <div className="relative flex flex-1 flex-col p-5 pt-8">
                    <span className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-700 shadow-md">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-bold text-navy-900">{card.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{card.text}</p>
                    <span className="mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-gold-400 text-gold-500 transition-colors group-hover:bg-gold-400 group-hover:text-navy-900">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
