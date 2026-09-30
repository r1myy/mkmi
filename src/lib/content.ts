import 'server-only'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type GlobalConfig } from 'payload'
import { cache } from 'react'

import { HomePage as HomePageConfig } from '@/globals/HomePage'
import { pageGlobals } from '@/globals/pages'
import { SiteSettings as SiteSettingsConfig } from '@/globals/SiteSettings'
import type { Config, Event, FaithResource, HomePage, Media, Ministry, Mission, Sermon, SiteSetting, Testimonial } from '@/payload-types'
import { extractDefaults, withDefaults } from './defaults'

const homeDefaults = extractDefaults(HomePageConfig.fields)
const settingsDefaults = extractDefaults(SiteSettingsConfig.fields)

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.warn('[content] CMS indisponible :', error)
    return fallback
  }
}

const payloadClient = cache(() => getPayload({ config }))

export const getSettings = cache(async () =>
  withDefaults<SiteSetting>(
    await safe(async () => (await payloadClient()).findGlobal({ slug: 'site-settings', depth: 1 }), null),
    settingsDefaults,
  ),
)

/** Vrai quand un membre de l’équipe regarde le site en mode édition (brouillons visibles). */
export const isEditing = cache(async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
})

export const getHomePage = cache(async () => {
  const draft = await isEditing()
  return withDefaults<HomePage>(
    await safe(async () => (await payloadClient()).findGlobal({ slug: 'home-page', depth: 1, draft }), null),
    homeDefaults,
  )
})

const pageDefaults = Object.fromEntries(pageGlobals.map((g: GlobalConfig) => [g.slug, extractDefaults(g.fields)]))

type PageSlug = Extract<keyof Config['globals'], `page-${string}`>

/** Contenu d’une page du site (sections modifiables dans « Pages du site »), brouillon inclus en mode édition. */
export const getPage = cache(async <S extends PageSlug>(slug: S): Promise<Config['globals'][S]> => {
  const draft = await isEditing()
  return withDefaults<Config['globals'][S]>(
    await safe(async () => (await payloadClient()).findGlobal({ slug, depth: 1, draft }), null),
    pageDefaults[slug],
  )
})

export const getUpcomingEvents = cache(async (limit = 4): Promise<Event[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'events',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { startsAt: { greater_than_equal: new Date(Date.now() - 12 * 3600 * 1000).toISOString() } },
        ],
      },
      sort: 'startsAt',
      limit,
      depth: 1,
    })
    return res.docs
  }, []),
)

export const getFeaturedSermon = cache(async (): Promise<Sermon | null> =>
  safe(async () => {
    const payload = await payloadClient()
    const published = { _status: { equals: 'published' } } as const
    const featured = await payload.find({
      collection: 'sermons',
      where: { and: [published, { featured: { equals: true } }] },
      sort: '-date',
      limit: 1,
      depth: 1,
    })
    if (featured.docs[0]) return featured.docs[0]
    const latest = await payload.find({ collection: 'sermons', where: published, sort: '-date', limit: 1, depth: 1 })
    return latest.docs[0] ?? null
  }, null),
)

export const getMinistries = cache(async (): Promise<Ministry[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'ministries',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      limit: 12,
      depth: 1,
    })
    return res.docs
  }, []),
)

export const getAllMinistries = cache(async (): Promise<Ministry[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'ministries',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      limit: 100,
      depth: 1,
    })
    return res.docs
  }, []),
)

/** Événements publiés à venir (y compris ceux commencés il y a moins de 12 h). */
export const getAllUpcomingEvents = cache(async (): Promise<Event[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'events',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { startsAt: { greater_than_equal: new Date(Date.now() - 12 * 3600 * 1000).toISOString() } },
        ],
      },
      sort: 'startsAt',
      limit: 200,
      depth: 1,
    })
    return res.docs
  }, []),
)

export const getEventBySlug = cache(async (slug: string): Promise<Event | null> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'events',
      where: { and: [{ _status: { equals: 'published' } }, { slug: { equals: slug } }] },
      limit: 1,
      depth: 1,
    })
    return res.docs[0] ?? null
  }, null),
)

/** Annonce « À la une » publiée (bandeau de la page d’accueil). */
export const getFeaturedAnnouncement = cache(async () =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'announcements',
      where: {
        and: [
          { status: { equals: 'published' } },
          { featured: { equals: true } },
          { publishAt: { less_than_equal: new Date().toISOString() } },
        ],
      },
      sort: '-publishAt',
      limit: 1,
      depth: 0,
      overrideAccess: false,
    })
    return res.docs[0] ?? null
  }, null),
)

/** Tous les messages publiés (les filtres de la page Messages s’appliquent ensuite). */
export const getSermons = cache(async (): Promise<Sermon[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'sermons',
      where: { _status: { equals: 'published' } },
      sort: '-date',
      limit: 500,
      depth: 1,
    })
    return res.docs
  }, []),
)

export const getMissions = cache(async (): Promise<Mission[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'missions',
      where: { _status: { equals: 'published' } },
      limit: 50,
      depth: 1,
    })
    return res.docs
  }, []),
)

export const getTestimonials = cache(async (limit = 6): Promise<Testimonial[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'testimonials',
      where: { and: [{ approved: { equals: true } }, { consent: { equals: true } }] },
      sort: '-createdAt',
      limit,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs
  }, []),
)

/** Tous les témoignages publiés et consentis (page Témoignages). */
export const getAllTestimonials = cache(async (): Promise<Testimonial[]> =>
  safe(async () => {
    const res = await (await payloadClient()).find({
      collection: 'testimonials',
      where: { and: [{ approved: { equals: true } }, { consent: { equals: true } }] },
      sort: '-createdAt',
      limit: 1000,
      pagination: false,
      depth: 1,
      overrideAccess: false,
    })
    return res.docs
  }, []),
)

/** Ressources publiées de « Découvrir la foi » (brouillons inclus en mode édition). */
export const getFaithResources = cache(async (): Promise<FaithResource[]> =>
  safe(async () => {
    const draft = await isEditing()
    const res = await (await payloadClient()).find({
      collection: 'faith-resources',
      sort: '-publishedAt',
      limit: 1000,
      pagination: false,
      depth: 1,
      draft,
      overrideAccess: false,
    })
    return res.docs
  }, []),
)

export const getFaithResourceBySlug = cache(async (slug: string): Promise<FaithResource | null> =>
  safe(async () => {
    const draft = await isEditing()
    const res = await (await payloadClient()).find({
      collection: 'faith-resources',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      draft,
      overrideAccess: false,
    })
    return res.docs[0] ?? null
  }, null),
)

/** Retourne le média s’il est peuplé (profondeur ≥ 1), sinon null. */
export function asMedia(value: unknown): Media | null {
  return value && typeof value === 'object' && 'url' in value ? (value as Media) : null
}
