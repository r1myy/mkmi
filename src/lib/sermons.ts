import type { Sermon } from '@/payload-types'

export function youtubeId(url?: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/)
  return m?.[1] ?? null
}

/** Miniature YouTube à utiliser quand aucune miniature n’a été téléversée. */
export function youtubeThumb(sermon: Pick<Sermon, 'youtubeUrl'>) {
  const id = youtubeId(sermon.youtubeUrl)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export const formatSermonDate = (date: string, style: 'long' | 'medium' = 'long') =>
  new Intl.DateTimeFormat('fr-CA', { dateStyle: style, timeZone: 'UTC' }).format(new Date(date))
