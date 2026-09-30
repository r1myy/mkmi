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

export async function registerForEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  const thanks = 'Merci ! Votre inscription est confirmée. À très bientôt !'
  if (formData.get('website')) return { status: 'success', message: thanks }

  const eventId = Number(formData.get('event'))
  const name = clean(formData, 'name', 120)
  const email = clean(formData, 'email', 254).toLowerCase()
  const seats = Math.min(Math.max(Number(formData.get('seats')) || 1, 1), 10)
  if (!Number.isInteger(eventId) || eventId <= 0) return { status: 'error', message: 'Événement introuvable.' }
  if (!name) return { status: 'error', message: 'Veuillez indiquer votre nom.' }
  if (!EMAIL.test(email)) return { status: 'error', message: 'Veuillez entrer une adresse courriel valide.' }
  if (formData.get('consent') !== 'on') return { status: 'error', message: 'Veuillez cocher la case de consentement.' }
  if (!rateLimit(`event:${clientKey(await headers())}`, 10, 60 * 60 * 1000)) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' }
  }

  try {
    const payload = await getPayload({ config })
    const event = await payload.findByID({ collection: 'events', id: eventId, depth: 0, overrideAccess: false })
    if (!event || event._status !== 'published' || !event.registrationEnabled) {
      return { status: 'error', message: 'Les inscriptions ne sont pas ouvertes pour cet événement.' }
    }
    if (typeof event.capacity === 'number' && event.capacity > 0) {
      const existing = await payload.find({
        collection: 'event-registrations',
        where: { and: [{ event: { equals: eventId } }, { status: { not_equals: 'cancelled' } }] },
        limit: 1000,
        depth: 0,
        overrideAccess: true,
      })
      const taken = existing.docs.reduce((sum, r) => sum + (r.seats ?? 1), 0)
      if (taken + seats > event.capacity) {
        const left = Math.max(event.capacity - taken, 0)
        return { status: 'error', message: left ? `Il ne reste que ${left} place(s).` : 'Désolé, cet événement est complet.' }
      }
    }
    await payload.create({
      collection: 'event-registrations',
      data: { event: eventId, name, email, seats, consent: true },
      overrideAccess: true,
    })
    return { status: 'success', message: thanks }
  } catch {
    return { status: 'error', message: 'Une erreur est survenue. Réessayez plus tard.' }
  }
}

export async function submitVisitPlan(_prev: FormState, formData: FormData): Promise<FormState> {
  const thanks = 'Merci ! Votre visite est notée : notre équipe d’accueil vous attend avec joie.'
  if (formData.get('website')) return { status: 'success', message: thanks }

  const name = clean(formData, 'name', 120)
  const email = clean(formData, 'email', 254).toLowerCase()
  const phone = clean(formData, 'phone', 40)
  const message = clean(formData, 'message', 1000)
  const service = clean(formData, 'service', 120)
  const people = Math.min(Math.max(Number(formData.get('people')) || 1, 1), 20)
  const rawDate = clean(formData, 'visitDate', 10)
  const visitDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? new Date(`${rawDate}T12:00:00Z`) : null
  if (!name) return { status: 'error', message: 'Veuillez indiquer votre nom.' }
  if (!EMAIL.test(email)) return { status: 'error', message: 'Veuillez entrer une adresse courriel valide.' }
  if (visitDate && visitDate.getTime() < Date.now() - 36 * 3600 * 1000) {
    return { status: 'error', message: 'Veuillez choisir une date à venir.' }
  }
  if (formData.get('consent') !== 'on') {
    return { status: 'error', message: 'Veuillez cocher la case de consentement.' }
  }
  if (!rateLimit(`visit:${clientKey(await headers())}`, 5, 60 * 60 * 1000)) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'visit-plans',
      data: {
        name,
        email,
        phone: phone || undefined,
        service: service || undefined,
        visitDate: visitDate?.toISOString(),
        people,
        withChildren: formData.get('withChildren') === 'on',
        message: message || undefined,
        consent: true,
      },
      overrideAccess: true,
    })
    return { status: 'success', message: thanks }
  } catch {
    return { status: 'error', message: 'Une erreur est survenue. Réessayez plus tard.' }
  }
}

const TESTIMONY_CATEGORIES = ['guerison', 'delivrance', 'restauration', 'provision', 'direction', 'priere', 'etude', 'famille', 'autre'] as const

export async function submitTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  const thanks = 'Merci pour votre témoignage ! Notre équipe le relira avec soin avant de le publier.'
  if (formData.get('website')) return { status: 'success', message: thanks }

  const firstName = clean(formData, 'firstName', 80)
  const email = clean(formData, 'email', 254).toLowerCase()
  const title = clean(formData, 'title', 140)
  const text = clean(formData, 'text', 4000)
  const rawCategory = clean(formData, 'category', 20)
  const category = (TESTIMONY_CATEGORIES as readonly string[]).includes(rawCategory)
    ? (rawCategory as (typeof TESTIMONY_CATEGORIES)[number])
    : 'autre'
  if (!firstName || !title || text.length < 20) {
    return { status: 'error', message: 'Veuillez indiquer votre nom, un titre et votre témoignage (20 caractères minimum).' }
  }
  if (!EMAIL.test(email)) return { status: 'error', message: 'Veuillez entrer une adresse courriel valide.' }
  if (formData.get('consent') !== 'on') {
    return { status: 'error', message: 'Veuillez cocher la case de consentement.' }
  }
  if (!rateLimit(`testimony:${clientKey(await headers())}`, 3, 60 * 60 * 1000)) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'testimonials',
      data: { firstName, email, title, text, category, consent: true, status: 'pending' },
      overrideAccess: true,
    })
    return { status: 'success', message: thanks }
  } catch {
    return { status: 'error', message: 'Une erreur est survenue. Réessayez plus tard.' }
  }
}

export async function submitVolunteer(_prev: FormState, formData: FormData): Promise<FormState> {
  const thanks = 'Merci pour votre intérêt ! Un responsable vous contactera très bientôt.'
  if (formData.get('website')) return { status: 'success', message: thanks }

  const name = clean(formData, 'name', 120)
  const email = clean(formData, 'email', 254).toLowerCase()
  const phone = clean(formData, 'phone', 40)
  const team = clean(formData, 'team', 80) || 'À déterminer'
  const availability = clean(formData, 'availability', 80)
  const message = clean(formData, 'message', 500)
  if (!name) return { status: 'error', message: 'Veuillez indiquer votre nom.' }
  if (!EMAIL.test(email)) return { status: 'error', message: 'Veuillez entrer une adresse courriel valide.' }
  if (formData.get('consent') !== 'on') return { status: 'error', message: 'Veuillez cocher la case de consentement.' }
  if (!rateLimit(`volunteer:${clientKey(await headers())}`, 5, 60 * 60 * 1000)) {
    return { status: 'error', message: 'Trop de tentatives. Réessayez plus tard.' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'contact-messages',
      data: {
        name,
        email,
        phone: phone || undefined,
        subject: `M’impliquer : ${team}`.slice(0, 120),
        message: [availability && `Disponibilités : ${availability}`, message].filter(Boolean).join('\n\n') || 'Souhaite s’impliquer comme bénévole.',
      },
      overrideAccess: true,
    })
    return { status: 'success', message: thanks }
  } catch {
    return { status: 'error', message: 'Une erreur est survenue. Réessayez plus tard.' }
  }
}
