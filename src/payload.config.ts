import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  EventRegistrations,
  Events,
  Media,
  Ministries,
  Missions,
  NewsletterSubscribers,
  PageViews,
  PrayerRequests,
  Sermons,
  Testimonials,
  Users,
  VisitPlans,
} from './collections'
import { migrations } from './migrations'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Administration MKMI Québec',
    },
    components: {
      beforeDashboard: ['@/components/admin/StatsDashboard'],
    },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  collections: [
    Events,
    Sermons,
    Ministries,
    Missions,
    Media,
    Testimonials,
    PrayerRequests,
    VisitPlans,
    EventRegistrations,
    NewsletterSubscribers,
    PageViews,
    Users,
  ],
  globals: [HomePage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // En production, les migrations s’appliquent au démarrage.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
