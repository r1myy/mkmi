import config from '@payload-config'
import { NextResponse, type NextRequest } from 'next/server'
import { getPayload, type Where } from 'payload'

import { clientKey, rateLimit } from '@/lib/rateLimit'

const PATH = /^\/[a-z0-9\-/_]{0,150}$/i

/** Compteur de vues anonyme : incrémente (jour, page). Aucune donnée personnelle n’est conservée. */
export async function POST(req: NextRequest) {
  let path: unknown
  try {
    ;({ path } = await req.json())
  } catch {
    return new NextResponse(null, { status: 400 })
  }
  if (typeof path !== 'string' || !PATH.test(path) || path.startsWith('/admin') || path.startsWith('/api')) {
    return new NextResponse(null, { status: 400 })
  }
  if (!rateLimit(`track:${clientKey(req.headers)}`, 120, 60 * 1000)) {
    return new NextResponse(null, { status: 429 })
  }

  const day = new Date().toISOString().slice(0, 10)
  try {
    const payload = await getPayload({ config })
    const where: Where = { and: [{ day: { equals: day } }, { path: { equals: path } }] }
    const found = await payload.find({ collection: 'page-views', where, limit: 1, overrideAccess: true })
    if (found.docs[0]) {
      await payload.update({
        collection: 'page-views',
        id: found.docs[0].id,
        data: { count: found.docs[0].count + 1 },
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'page-views', data: { day, path, count: 1 }, overrideAccess: true })
    }
  } catch {
    // Les statistiques ne doivent jamais casser la navigation.
  }
  return new NextResponse(null, { status: 204 })
}
