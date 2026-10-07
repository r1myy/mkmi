import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Quitte le mode édition et revient à la version publiée de la page. */
export async function POST(request: Request) {
  ;(await draftMode()).disable()
  const form = await request.formData()
  const raw = String(form.get('path') || '/')
  redirect(/^\/(?!\/)/.test(raw) ? raw : '/')
}
