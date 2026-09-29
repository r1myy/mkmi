import 'server-only'
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { HomePage as HomePageConfig } from '@/globals/HomePage'
import { PagesContent as PagesContentConfig } from '@/globals/PagesContent'
import { SiteSettings as SiteSettingsConfig } from '@/globals/SiteSettings'
import type { Event, HomePage, Media, Ministry, Mission, PagesContent, Sermon, SiteSetting, Testimonial } from '@/payload-types'
import { extractDefaults, withDefaults } from './defaults'

const homeDefaults = extractDefaults(HomePageConfig.fields)
const settingsDefaults = extractDefaults(SiteSettingsConfig.fields)
const pagesDefaults = extractDefaults(PagesContentConfig.fields)

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

export const getHomePage = cache(async () =>
  withDefaults<HomePage>(
    await safe(async () => (await payloadClient()).findGlobal({ slug: 'home-page', depth: 1 }), null),
    homeDefaults,
  ),
)

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

export const getPagesContent = cache(async () =>
  withDefaults<PagesContent>(
    await safe(async () => (await payloadClient()).findGlobal({ slug: 'pages-content', depth: 1 }), null),
    pagesDefaults,
  ),
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

/** Retourne le média s’il est peuplé (profondeur ≥ 1), sinon null. */
export function asMedia(value: unknown): Media | null {
  return value && typeof value === 'object' && 'url' in value ? (value as Media) : null
}
