import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Actions de la boîte de réception (équipe pastorale et administrateurs) :
 * marquer lu / non lu, important, répondu, archiver, enregistrer une note interne.
 */
export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  const role = (user as { role?: string } | null)?.role
  if (!user || !['admin', 'pastoral'].includes(role ?? '')) return new Response('Accès refusé', { status: 403 })

  const form = await request.formData()
  const id = Number(form.get('id'))
  const action = String(form.get('action') ?? '')
  const back = String(form.get('back') ?? '/admin/collections/contact-messages')
  if (!Number.isInteger(id) || id <= 0) return new Response('Message introuvable', { status: 400 })

  const now = new Date().toISOString()
  const doc = await payload.findByID({ collection: 'contact-messages', id, depth: 0, user, overrideAccess: false })
  const data: Record<string, unknown> =
    action === 'unread'
      ? { readAt: null }
      : action === 'important'
        ? { important: !doc.important }
        : action === 'answered'
          ? { status: 'answered', answeredAt: now, readAt: doc.readAt ?? now }
          : action === 'archive'
            ? { status: 'archived' }
            : action === 'reopen'
              ? { status: 'new' }
              : action === 'note'
                ? { internalNotes: String(form.get('notes') ?? '').slice(0, 5000) }
                : {}
  if (Object.keys(data).length) await payload.update({ collection: 'contact-messages', id, data, user, overrideAccess: false })

  const target = back.startsWith('/admin/') ? back : '/admin/collections/contact-messages'
  return Response.redirect(new URL(target, request.url), 303)
}
