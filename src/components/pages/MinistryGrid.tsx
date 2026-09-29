'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Search, Users } from 'lucide-react'
import clsx from 'clsx'

import type { Media } from '@/payload-types'
import { ministryAccents, ministryIcons } from '../site/ministryIcons'
import { Photo } from '../site/Photo'

export type MinistryCard = {
  id: number
  name: string
  slug: string
  summary: string
  icon: string
  accent: string
  image: Media | null
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export function MinistryGrid({ ministries }: { ministries: MinistryCard[] }) {
  const [query, setQuery] = useState('')
  const q = normalize(query.trim())
  const shown = q ? ministries.filter((m) => normalize(`${m.name} ${m.summary}`).includes(q)) : ministries

  return (
    <>
      <div className="relative mt-8 max-w-sm">
        <label htmlFor="ministry-search" className="sr-only">
          Rechercher un ministère
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id="ministry-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un ministère…"
          className="w-full rounded-xl border border-navy-900/15 bg-white py-3 pr-4 pl-11 text-sm text-navy-900 shadow-sm focus:border-gold-400 focus:outline-none"
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {shown.length} ministère{shown.length > 1 ? 's' : ''}
      </p>

      {shown.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-navy-900/20 bg-mist p-8 text-center text-muted">
          {ministries.length === 0 ? 'La liste des ministères sera publiée prochainement.' : 'Aucun ministère ne correspond à votre recherche.'}
        </p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((m) => {
            const Icon = ministryIcons[m.icon as keyof typeof ministryIcons] ?? Users
            return (
              <li key={m.id}>
                <Link
                  href={`/ministeres/${m.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)] ring-1 ring-navy-900/5 transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(11,22,40,.5)]"
                >
                  <Photo media={m.image} tone="light" placeholder="" className="aspect-[16/10] w-full" sizes="(min-width:1024px) 25vw, 50vw" />
                  <div className="relative flex flex-1 flex-col p-5 pt-8">
                    <span
                      className={clsx(
                        'absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md',
                        ministryAccents[m.accent as keyof typeof ministryAccents] ?? 'text-blue-600',
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-bold text-navy-900">{m.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{m.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                      En savoir plus
                      <ArrowRight className="h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
