import Link from 'next/link'
import {
  ArrowRight,
  Baby,
  BookOpen,
  Flower2,
  Globe2,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Megaphone,
  Music,
  Users,
  Video,
} from 'lucide-react'
import clsx from 'clsx'

import { asMedia } from '@/lib/content'
import type { Ministry } from '@/payload-types'
import { Photo } from '../site/Photo'
import { Eyebrow } from '../site/ui'

const icons = {
  baby: Baby,
  book: BookOpen,
  flower: Flower2,
  users: Users,
  'heart-handshake': HeartHandshake,
  'hand-heart': HandHeart,
  music: Music,
  globe: Globe2,
  video: Video,
  'graduation-cap': GraduationCap,
  megaphone: Megaphone,
}

const accents = {
  blue: 'text-blue-600',
  red: 'text-rose-500',
  green: 'text-emerald-600',
  purple: 'text-fuchsia-600',
  gold: 'text-gold-500',
}

export function Ministries({ ministries }: { ministries: Ministry[] }) {
  return (
    <section aria-labelledby="ministries-title" className="pb-16 lg:pb-20">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Nos ministères</Eyebrow>
            <h2 id="ministries-title" className="text-3xl font-extrabold text-navy-900">
              Grandir, servir, impacter ensemble
            </h2>
          </div>
          <Link
            href="/ministeres"
            className="inline-flex items-center gap-2 border-b-2 border-gold-400 pb-0.5 text-sm font-semibold text-navy-900"
          >
            Tous les ministères <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {ministries.length === 0 ? (
          <p className="mt-8 rounded-[var(--radius-card)] border border-dashed border-navy-900/20 bg-mist p-8 text-center text-muted">
            La liste des ministères sera publiée prochainement.
          </p>
        ) : (
          <ul className="mt-8 -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
            {ministries.map((m) => {
              const Icon = icons[(m.icon as keyof typeof icons) ?? 'users'] ?? Users
              return (
                <li key={m.id} className="w-36 shrink-0 snap-start sm:w-auto">
                  <Link
                    href={`/ministeres/${m.slug ?? ''}`}
                    className="group block overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[0_10px_28px_-18px_rgba(11,22,40,.45)] transition-transform hover:-translate-y-1"
                  >
                    <Photo media={asMedia(m.image)} className="aspect-[4/3.4] w-full" tone="light" sizes="160px" placeholder="" />
                    <div className="relative px-4 pt-7 pb-4">
                      <span
                        className={clsx(
                          'absolute -top-5 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md',
                          accents[(m.accent as keyof typeof accents) ?? 'blue'],
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="text-sm font-bold text-navy-900">{m.name}</h3>
                      <span className="mt-2 flex h-7 w-7 items-center justify-center rounded-full border border-navy-900/20 text-navy-900 transition-colors group-hover:border-gold-400 group-hover:bg-gold-400">
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
