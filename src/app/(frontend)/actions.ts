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

const clean = (formData: FormData, key: string, max: number) => String(formData.get(key) ?? '').trim().slice(0, max)

export async function submitPrayerRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const thanks = 'Merci. Votre demande a bien été reçue : notre équipe priera pour vous.'
  if (formData.get('website')) return { status: 'success', message: thanks }

  const name = clean(formData, 'name', 120)
  const email = clean(formData, 'email', 254).toLowerCase()
  const phone = clean(formData, 'phone', 40)
  const subject = clean(formData, 'subject', 80)
  const request = clean(formData, 'request', 1000)
  if (!name || !request) return { status: 'error', message: 'Veuillez indiquer votre nom et votre demande de prière.' }
  if (!EMAIL.test(email)) return { status: 'error', message: 'Veuillez entrer une adresse courriel valide.' }
  if (!rateLimit(`prayer:${clientKey(await headers())}`, 5, 60 * 60 * 1000)) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'prayer-requests',
      data: {
        name,
        email,
        phone: phone || undefined,
        request: subject ? `[${subject}] ${request}` : request,
        wantsReply: formData.get('wantsReply') === 'on',
        confidential: formData.get('confidential') === 'on',
      },
      overrideAccess: true,
    })
    return { status: 'success', message: thanks }
  } catch {
    return { status: 'error', message: 'Une erreur est survenue. Réessayez plus tard.' }
  }
}

export async function submitContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const thanks = 'Merci ! Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.'
  if (formData.get('website')) return { status: 'success', message: thanks }

  const name = clean(formData, 'name', 120)
  const email = clean(formData, 'email', 254).toLowerCase()
  const phone = clean(formData, 'phone', 40)
  const subject = clean(formData, 'subject', 120)
  const message = clean(formData, 'message', 500)
  if (!name || !subject || !message) {
    return { status: 'error', message: 'Veuillez remplir votre nom, le sujet et votre message.' }
  }
  if (!EMAIL.test(email)) return { status: 'error', message: 'Veuillez entrer une adresse courriel valide.' }
  if (!rateLimit(`contact:${clientKey(await headers())}`, 5, 60 * 60 * 1000)) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' }
  }

  try {
    const payload = await getPayload({ config })
    const newsletter = formData.get('newsletter') === 'on'
    await payload.create({
      collection: 'contact-messages',
      data: { name, email, phone: phone || undefined, subject, message, newsletter },
      overrideAccess: true,
    })
    if (newsletter) {
      const existing = await payload.count({
        collection: 'newsletter-subscribers',
        where: { email: { equals: email } },
        overrideAccess: true,
      })
      if (existing.totalDocs === 0) {
        await payload.create({ collection: 'newsletter-subscribers', data: { email, consent: true }, overrideAccess: true })
      }
    }
    return { status: 'success', message: thanks }
  } catch {
    return { status: 'error', message: 'Une erreur est survenue. Réessayez plus tard.' }
  }
}
