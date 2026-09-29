import type { Payload } from 'payload'

export type SermonStats = { views: number; downloads: number }

/** Vues et téléchargements par message, à partir du compteur anonyme du site (clé : slug). */
export async function sermonStats(payload: Payload): Promise<Map<string, SermonStats>> {
  const stats = new Map<string, SermonStats>()
  const { docs } = await payload
    .find({
      collection: 'page-views',
      where: { path: { like: '/messages/' } },
      limit: 100000,
      pagination: false,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [] as { path: string; count: number }[] }))
  for (const v of docs) {
    const m = /^\/messages\/([^/]+)(\/telechargement)?$/.exec(v.path)
    if (!m) continue
    const s = stats.get(m[1]) ?? { views: 0, downloads: 0 }
    if (m[2]) s.downloads += v.count
    else s.views += v.count
    stats.set(m[1], s)
  }
  return stats
}
