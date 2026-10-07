'use client'

import type { AnchorHTMLAttributes } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { slug: string }

/** Lien de téléchargement de l’audio d’un message : compte le téléchargement (anonyme, sans cookie). */
export function TrackedDownload({ slug, onClick, ...props }: Props) {
  return (
    <a
      download
      {...props}
      onClick={(e) => {
        const body = JSON.stringify({ path: `/messages/${slug}/telechargement` })
        if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
        onClick?.(e)
      }}
    />
  )
}
