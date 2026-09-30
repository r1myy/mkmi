import config from '@payload-config'
import { getPayload } from 'payload'

const BACK = '/admin/collections/testimonials'
const statusFor: Record<string, 'published' | 'rejected' | 'pending'> = {
  publish: 'published',
  reject: 'rejected',
  pending: 'pending',
}

/** Modération rapide des témoignages (publier, refuser, remettre en attente), une ligne ou plusieurs. */
export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  const role = (user as { role?: string } | null)?.role
  if (!user || !['admin', 'editor'].includes(role ?? '')) return new Response('Accès refusé', { status: 403 })

  const form = await request.formData()
  const status = statusFor[String(form.get('action') ?? '')]
  const ids = form
    .getAll('id')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 200)
  const back = String(form.get('back') ?? BACK)
  if (status && ids.length) {
    await payload.update({ collection: 'testimonials', where: { id: { in: ids } }, data: { status }, user, overrideAccess: false })
  }
  return Response.redirect(new URL(back.startsWith('/admin/') ? back : BACK, request.url), 303)
}
