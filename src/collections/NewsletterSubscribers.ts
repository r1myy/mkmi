import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Abonné infolettre', plural: 'Abonnés infolettre' },
  admin: { useAsTitle: 'email', group: 'Communauté', defaultColumns: ['email', 'createdAt'] },
  access: { read: isEditor, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'email', label: 'Courriel', type: 'email', required: true, unique: true },
    { name: 'name', label: 'Nom', type: 'text' },
    { name: 'consent', label: 'Consentement', type: 'checkbox', required: true },
  ],
}
