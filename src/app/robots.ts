import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: ['/', '/api/og'], disallow: ['/admin', '/api/'] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
