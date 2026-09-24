import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import clsx from 'clsx'

type Variant = 'gold' | 'outline-light' | 'outline-dark' | 'navy'

const variants: Record<Variant, string> = {
  gold: 'bg-gold-400 text-navy-900 hover:bg-gold-300 shadow-[0_8px_24px_-12px_rgba(245,191,79,.8)]',
  'outline-light': 'border border-white/40 text-white hover:bg-white/10',
  'outline-dark': 'border border-navy-900/25 text-navy-900 hover:bg-navy-900/5',
  navy: 'bg-navy-900 text-white hover:bg-navy-800',
}

export function ButtonLink({
  href,
  variant = 'gold',
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-bold tracking-wide uppercase transition-colors',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  )
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={clsx(
        'mb-3 flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] uppercase',
        light ? 'text-white/80' : 'text-muted',
      )}
    >
      <span className="h-0.5 w-6 rounded bg-gold-400" aria-hidden="true" />
      {children}
    </p>
  )
}
