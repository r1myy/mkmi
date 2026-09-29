import type { ComponentType, ReactNode } from 'react'
import { ArrowRight, ChevronDown, Quote } from 'lucide-react'
import clsx from 'clsx'

import type { Media } from '@/payload-types'
import { Photo } from '../site/Photo'
import { Eyebrow } from '../site/ui'

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>

/** Halo doré et trame discrète : la signature visuelle des pages intérieures. */
export function Glow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={clsx('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute -top-56 -right-40 h-[34rem] w-[34rem] rounded-full bg-gold-400/10 blur-[120px]" />
      <div className="absolute -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-blue-500/15 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  )
}

export function QuoteCard({ text, source, className }: { text: string; source: string; className?: string }) {
  return (
    <figure
      className={clsx(
        'rounded-2xl border border-white/15 bg-navy-950/55 p-6 text-white shadow-2xl backdrop-blur-md',
        className,
      )}
    >
      <Quote className="h-8 w-8 fill-gold-400 text-gold-400" aria-hidden="true" />
      <blockquote className="mt-3 text-[15px] leading-relaxed text-white/90">« {text} »</blockquote>
      <figcaption className="mt-4 flex items-center gap-3 text-sm text-white/70">
        <span className="h-0.5 w-5 rounded bg-gold-400" aria-hidden="true" />
        {source}
      </figcaption>
    </figure>
  )
}

type HeroProps = {
  id: string
  eyebrow: string
  title: ReactNode
  text: string
  image?: Media | null
  placeholder?: string
  actions?: ReactNode
  aside?: ReactNode
}

/** Haut de page des pages intérieures : grand titre, halo doré, carte flottante optionnelle. */
export function PageHero({ id, eyebrow, title, text, image, placeholder, actions, aside }: HeroProps) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 -z-20">
        <Photo media={image} alt="" placeholder={placeholder ?? ''} className="h-full w-full" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/25" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
      </div>
      {!image && <Glow />}

      <div className="container-site grid min-h-[560px] items-end gap-10 pt-32 pb-24 lg:min-h-[600px] lg:grid-cols-[1fr_320px] lg:items-center">
        <div className="max-w-2xl motion-safe:animate-[rise_.7s_ease-out_both]">
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 id={id} className="text-[2.6rem] leading-[1.03] font-extrabold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">{text}</p>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside && (
          <div className="hidden motion-safe:animate-[rise_.9s_.15s_ease-out_both] lg:block">{aside}</div>
        )}
      </div>
    </section>
  )
}

/** Mot mis en valeur en or dans un titre. */
export function Gold({ children }: { children: ReactNode }) {
  return <span className="text-gold-400">{children}</span>
}

export type Feature = { icon: Icon; title: string; text: string }

/** Bandeau de quatre atouts, posé à cheval sur le haut de page. */
export function FeatureStrip({ items }: { items: Feature[] }) {
  return (
    <div className="container-site relative z-10 -mt-12">
      <ul className="grid gap-px overflow-hidden rounded-2xl bg-navy-900/10 shadow-[0_24px_60px_-30px_rgba(11,22,40,.5)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 bg-white p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-navy-900">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-navy-900">{title}</h2>
              <p className="mt-1 text-sm leading-snug text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SectionHead({
  id,
  eyebrow,
  title,
  text,
  action,
  light = false,
  className,
}: {
  id?: string
  eyebrow: string
  title: ReactNode
  text?: string
  action?: ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <div className={clsx('flex flex-wrap items-end justify-between gap-6', className)}>
      <div className="max-w-2xl">
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 id={id} className={clsx('text-3xl font-extrabold sm:text-4xl', light ? 'text-white' : 'text-navy-900')}>
          {title}
        </h2>
        {text && <p className={clsx('mt-4 leading-relaxed', light ? 'text-white/75' : 'text-muted')}>{text}</p>}
      </div>
      {action}
    </div>
  )
}

/** Lien discret souligné d’or (« Voir tout »). */
export function TextLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <a
      href={href}
      className={clsx(
        'group inline-flex items-center gap-2 text-sm font-semibold',
        light ? 'text-white' : 'text-navy-900',
      )}
    >
      <span className="border-b-2 border-gold-400 pb-0.5">{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </a>
  )
}

export function Faq({ items }: { items: { id?: string | null; question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-navy-900/10 rounded-2xl border border-navy-900/10 bg-white px-6 shadow-[0_18px_50px_-30px_rgba(11,22,40,.4)]">
      {items.map((item, i) => (
        <details key={item.id ?? i} className="group py-1" name="faq">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist transition-colors group-open:bg-gold-400">
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>
          <p className="pb-5 text-sm leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

/** Bandeau d’appel à l’action de fin de page. */
export function CtaBand({
  id,
  eyebrow,
  title,
  text,
  actions,
  image,
}: {
  id: string
  eyebrow: string
  title: string
  text: string
  actions: ReactNode
  image?: Media | null
}) {
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-0 -z-20">
        <Photo media={image} alt="" placeholder="" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-950/70" />
      </div>
      <Glow />
      <div className="container-site flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h2 id={id} className="text-3xl font-extrabold sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-white/75">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">{actions}</div>
      </div>
    </section>
  )
}

/** Pastille d’icône dorée (sections sombres). */
export function IconRing({ icon: Icon, label }: { icon: Icon; label: string }) {
  return (
    <li className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/60 bg-gold-400/10 text-gold-400 transition-transform hover:scale-105">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="max-w-[9rem] text-sm font-semibold whitespace-pre-line text-white">{label}</span>
    </li>
  )
}
