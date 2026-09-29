import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  Announcements,
  ContactMessages,
  Documents,
  Donations,
  EventRegistrations,
  Events,
  Links,
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
import { pageGlobals } from './globals/pages'
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
      beforeNavLinks: ['@/components/admin/NavBrand#NavBrand'],
      afterNavLinks: ['@/components/admin/NavBrand#NavFooter'],
      graphics: { Icon: '@/components/admin/NavBrand#AdminIcon', Logo: '@/components/admin/NavBrand#AdminLogo' },
      views: { dashboard: { Component: '@/components/admin/Dashboard' } },
    },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  // L’ordre des collections fixe l’ordre des groupes du menu : Gestion, Communication, Ressources, Paramètres.
  collections: [
    Events,
    EventRegistrations,
    ContactMessages,
    Donations,
    PrayerRequests,
    VisitPlans,
    Ministries,
    Missions,
    Sermons,
    Testimonials,
    Announcements,
    NewsletterSubscribers,
    Media,
    Documents,
    Links,
    Users,
    PageViews,
  ],
  globals: [HomePage, ...pageGlobals, SiteSettings],
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
