import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import {
  Announcements,
  ContactMessages,
  Documents,
  Donations,
  EmailCampaigns,
  EventRegistrations,
  Events,
  Links,
  Members,
  Media,
  Ministries,
  Missions,
  NewsletterSubscribers,
  PageViews,
  PrayerRequests,
  SocialPosts,
  Sermons,
  Testimonials,
  FaithResources,
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
      views: {
        dashboard: { Component: '@/components/admin/Dashboard' },
        communications: { Component: '@/components/admin/CommunicationsHub', path: '/communications' },
        parametres: { Component: '@/components/admin/SettingsView', path: '/parametres' },
        pages: { Component: '@/components/admin/PagesView', path: '/pages' },
        recherche: { Component: '@/components/admin/SearchView', path: '/recherche' },
      },
    },
  },
  i18n: {
    supportedLanguages: { fr },
    fallbackLanguage: 'fr',
  },
  // L’ordre des collections fixe l’ordre des groupes du menu : Gestion, Communication, Ressources, Paramètres.
  collections: [
    Members,
    Events,
    EventRegistrations,
    Sermons,
    Donations,
    PrayerRequests,
    VisitPlans,
    Ministries,
    Missions,
    Testimonials,
    FaithResources,
    ContactMessages,
    Announcements,
    EmailCampaigns,
    SocialPosts,
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
  plugins: [
    // En ligne, les fichiers sont stockés dans Supabase Storage (compatible S3).
    // Le bucket reste privé : Payload sert les fichiers et applique les droits d’accès (documents internes).
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      // Mêmes colonnes en local et en ligne : le schéma (et les migrations) ne dépend pas du stockage choisi.
      alwaysInsertFields: true,
      // Envoi direct du navigateur vers le stockage : les gros fichiers (vidéos, PDF) ne passent pas par le serveur.
      clientUploads: true,
      collections: { media: { prefix: 'media' }, documents: { prefix: 'documents' } },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'ca-central-1',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
