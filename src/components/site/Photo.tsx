import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import clsx from 'clsx'

import type { Media } from '@/payload-types'

type Props = {
  media?: Media | null
  src?: string | null
  alt?: string
  /** Libellé du placeholder, affiché tant qu’aucune photo réelle n’est fournie. */
  placeholder?: string
  className?: string
  sizes?: string
  priority?: boolean
  tone?: 'dark' | 'light'
}

/**
 * Photo gérée par le CMS. Tant que MKMI Québec n’a pas fourni ses propres photos
 * (cahier des charges §24), un placeholder sobre est affiché : aucune photo de banque.
 */
export function Photo({
  media,
  src,
  alt,
  placeholder = 'Photo à venir',
  className,
  sizes = '100vw',
  priority,
  tone = 'dark',
}: Props) {
  const url = media?.url ?? src
  if (url) {
    return (
      <div className={clsx('relative overflow-hidden', className)}>
        <Image
          src={url}
          alt={media?.alt ?? alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }
  return (
    <div
      role="img"
      aria-label={alt ?? placeholder}
      className={clsx(
        'relative flex items-center justify-center overflow-hidden',
        tone === 'dark'
          ? 'bg-[radial-gradient(120%_90%_at_30%_20%,#2a3f63_0%,#12213a_55%,#070f1d_100%)] text-white/35'
          : 'bg-[radial-gradient(120%_90%_at_30%_20%,#fdf3dc_0%,#eef1f6_60%,#dfe4ec_100%)] text-navy-900/30',
        className,
      )}
    >
      <span className="flex flex-col items-center gap-1 text-[10px] font-medium tracking-wider uppercase">
        <ImageIcon className="h-5 w-5" aria-hidden="true" />
        {placeholder}
      </span>
    </div>
  )
}
