import config from '@payload-config'
import { getPayload } from 'payload'

const statusLabels: Record<string, string> = { confirmed: 'Confirmée', pending: 'En attente', cancelled: 'Annulée' }
const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

/** Export CSV des inscriptions (équipe connectée uniquement), filtrable par ?evenement=ID. */
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  const role = (user as { role?: string } | null)?.role
  if (!user || !['admin', 'editor'].includes(role ?? '')) return new Response('Accès refusé', { status: 403 })

  const eventId = Number(new URL(request.url).searchParams.get('evenement'))
  const { docs } = await payload.find({
    collection: 'event-registrations',
    where: eventId ? { event: { equals: eventId } } : undefined,
    sort: '-createdAt',
    limit: 10000,
    pagination: false,
    depth: 1,
    overrideAccess: false,
    user,
  })
  const rows = [
    ['Nom', 'Courriel', 'Événement', 'Date de l’événement', 'Places', 'Statut', 'Inscrit le'],
    ...docs.map((r) => {
      const e = typeof r.event === 'object' && r.event ? r.event : null
      return [
        r.name,
        r.email,
        e?.title ?? '',
        e ? new Date(e.startsAt).toLocaleString('fr-CA', { timeZone: 'America/Toronto' }) : '',
        r.seats ?? 1,
        statusLabels[r.status ?? 'confirmed'],
        new Date(r.createdAt).toLocaleString('fr-CA', { timeZone: 'America/Toronto' }),
      ]
    }),
  ]
  const csv = '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inscriptions-mkmi${eventId ? `-${eventId}` : ''}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
