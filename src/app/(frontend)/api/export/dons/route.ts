import config from '@payload-config'
import { getPayload } from 'payload'

import { donationCategories, donationMethods } from '@/collections/Donations'

const label = (list: readonly { label: string; value: string }[], v?: string | null) => list.find((o) => o.value === v)?.label ?? ''
const statusLabels: Record<string, string> = { confirmed: 'Confirmé', pending: 'En attente', refunded: 'Remboursé' }
const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

/** Export CSV du registre des dons (administrateurs uniquement). */
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if ((user as { role?: string } | null)?.role !== 'admin') return new Response('Accès refusé', { status: 403 })

  const { docs } = await payload.find({ collection: 'donations', sort: '-date', limit: 100000, pagination: false, depth: 0, overrideAccess: false, user })
  const rows = [
    ['Date', 'Donateur', 'Courriel', 'Montant', 'Catégorie', 'Mode de paiement', 'Statut', 'Récurrent', 'Reçu remis', 'Notes'],
    ...docs.map((d) => [
      d.date.slice(0, 10),
      d.donorName,
      d.email ?? '',
      d.amount.toFixed(2).replace('.', ','),
      label(donationCategories, d.category),
      label(donationMethods, d.method),
      statusLabels[d.status ?? 'confirmed'],
      d.recurring ? 'Oui' : 'Non',
      d.receiptSent ? 'Oui' : 'Non',
      d.notes ?? '',
    ]),
  ]
  const csv = '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="dons-mkmi.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
