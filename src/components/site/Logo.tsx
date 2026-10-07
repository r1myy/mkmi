import Link from 'next/link'

/** Feuille d’érable stylisée — à remplacer par le logo officiel dès qu’il est fourni. */
export function MapleLeaf({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} fill="currentColor">
      <path d="M32 2l5.5 11.5 6-3-2.5 14.5 9-9.5 2 6 10-2-4 11 5 3-15.5 12.5 2 6-15.5-2.5V62h-4V49.5L14.5 52l2-6L1 33.5l5-3-4-11 10 2 2-6 9 9.5L20.5 10.5l6 3z" />
    </svg>
  )
}

export function Logo({ light = true, name = 'MKMI Québec' }: { light?: boolean; name?: string }) {
  const [first, ...rest] = name.split(' ')
  return (
    <Link href="/" className="group inline-flex items-center gap-2" aria-label={`${name} — accueil`}>
      <MapleLeaf className="h-8 w-8 text-gold-400 transition-transform group-hover:-rotate-6" />
      <span className={`flex flex-col leading-none ${light ? 'text-white' : 'text-navy-900'}`}>
        <span className="font-display text-2xl font-extrabold tracking-tight">{first}</span>
        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase">{rest.join(' ')}</span>
      </span>
    </Link>
  )
}
