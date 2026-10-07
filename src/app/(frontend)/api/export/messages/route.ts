import config from '@payload-config'
import { getPayload } from 'payload'

import { sermonStats } from '@/lib/sermonStats'

const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

/** Export CSV des messages (prédications), pour l’équipe connectée. */
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Accès refusé', { status: 403 })

  const [{ docs }, stats] = await Promise.all([
    payload.find({ collection: 'sermons', sort: '-date', limit: 100000, pagination: false, depth: 0, draft: true, overrideAccess: false, user }),
    sermonStats(payload),
  ])
  const rows = [
    ['titre', 'predicateur', 'date', 'serie', 'categorie', 'duree', 'youtube', 'balado', 'statut', 'vues', 'telechargements', 'jaime', 'commentaires', 'adresse'],
    ...docs.map((s) => {
      const st = stats.get(String(s.slug ?? s.id))
      return [
        s.title,
        s.preacher ?? '',
        s.date.slice(0, 10),
        s.series ?? '',
        s.category || 'Prédication',
        s.duration ?? '',
        s.youtubeUrl ?? '',
        s.podcastUrl ?? '',
        s._status === 'published' ? 'Publié' : 'Brouillon',
        st?.views ?? 0,
        st?.downloads ?? 0,
        s.likes ?? '',
        s.comments ?? '',
        `/messages/${s.slug ?? s.id}`,
      ]
    }),
  ]
  const csv = '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="messages-mkmi.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
