import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

/**
 * Active le « mode édition » (brouillons + boutons Modifier) pour un membre
 * de l’équipe connecté à l’administration, puis affiche la page demandée.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const raw = url.searchParams.get('path') || '/'
  // Chemin interne uniquement (pas de redirection vers un autre site).
  const path = /^\/(?!\/)[\w\-/À-ÿ%?=&#.]*$/.test(raw) ? raw : '/'

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) redirect(`/admin/login?redirect=${encodeURIComponent(`/api/preview?path=${path}`)}`)

  ;(await draftMode()).enable()
  redirect(path)
}
