import type { MetadataRoute } from 'next'

import { getAllMinistries, getSermons } from '@/lib/content'
import { siteUrl } from '@/lib/seo'

// Plan du site pour Google et Bing, régénéré au plus toutes les heures.
export const revalidate = 3600

const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/eglise', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/decouvrir', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/messages', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/ministeres', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/missions', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/priere', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ministries, sermons] = await Promise.all([getAllMinistries(), getSermons()])
  return [
    ...pages.map(({ path, priority, changeFrequency }) => ({ url: `${siteUrl}${path === '/' ? '' : path}`, priority, changeFrequency })),
    ...ministries
      .filter((m) => m.slug)
      .map((m) => ({ url: `${siteUrl}/ministeres/${m.slug}`, lastModified: m.updatedAt, priority: 0.5 })),
    ...sermons.map((s) => ({ url: `${siteUrl}/messages/${s.slug ?? s.id}`, lastModified: s.updatedAt, priority: 0.6 })),
  ]
}
