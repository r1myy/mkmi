import { BookOpen, Heart, Megaphone, Users } from 'lucide-react'

import { asMedia } from '@/lib/content'
import type { HomePage } from '@/payload-types'
import { Photo } from '../site/Photo'
import { Eyebrow } from '../site/ui'

const icons = { megaphone: Megaphone, book: BookOpen, users: Users, heart: Heart }

export function Pillars({ pillars }: { pillars: NonNullable<HomePage['pillars']> }) {
  return (
    <section aria-labelledby="pillars-title" className="relative isolate overflow-hidden bg-navy-900 py-16 text-white lg:py-20">
      <div className="absolute inset-0 -z-10">
        <Photo media={asMedia(pillars.background)} alt="" placeholder="" className="h-full w-full" />
        <div className="absolute inset-0 bg-navy-950/80" />
      </div>
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow light>{pillars.eyebrow}</Eyebrow>
            <h2 id="pillars-title" className="max-w-sm text-3xl font-bold sm:text-4xl">
              {pillars.title}
            </h2>
          </div>
          <p className="max-w-md text-white/80 lg:pt-8">{pillars.text}</p>
        </div>
        <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {(pillars.items ?? []).map((item, i) => {
            const Icon = icons[item.icon ?? 'heart'] ?? Heart
            return (
              <li
                key={item.id ?? i}
                className="flex flex-col items-center px-6 text-center lg:border-l lg:border-white/15 lg:first:border-l-0"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400 text-gold-400">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-extrabold tracking-wide uppercase">{item.title}</h3>
                <p className="mt-2 max-w-[16rem] text-sm text-white/75">{item.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
