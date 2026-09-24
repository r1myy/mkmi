'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { clientKey, rateLimit } from '@/lib/rateLimit'

export type FormState = { status: 'idle' | 'success' | 'error'; message?: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  // Piège à robots rempli : on fait comme si tout allait bien.
  if (formData.get('website')) return { status: 'success', message: 'Merci ! Vous êtes inscrit.' }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!EMAIL.test(email) || email.length > 254) {
    return { status: 'error', message: 'Veuillez entrer une adresse courriel valide.' }
  }
  if (formData.get('consent') !== 'on') {
    return { status: 'error', message: 'Veuillez cocher la case de consentement.' }
  }
  if (!rateLimit(`newsletter:${clientKey(await headers())}`, 5, 60 * 60 * 1000)) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' }
  }

  try {
    const payload = await getPayload({ config })
    const existing = await payload.count({
      collection: 'newsletter-subscribers',
      where: { email: { equals: email } },
      overrideAccess: true,
    })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'newsletter-subscribers',
        data: { email, consent: true },
        overrideAccess: true,
      })
    }
    return { status: 'success', message: 'Merci ! Vous êtes inscrit à nos nouvelles.' }
  } catch {
    return { status: 'error', message: 'Une erreur est survenue. Réessayez plus tard.' }
  }
}
