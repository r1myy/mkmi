import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  labels: { singular: 'Inscription', plural: 'Inscriptions' },
  admin: { useAsTitle: 'name', group: 'Communauté', defaultColumns: ['name', 'event', 'seats', 'createdAt'] },
  access: { read: isEditor, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'event', label: 'Événement', type: 'relationship', relationTo: 'events', required: true },
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'Courriel', type: 'email', required: true },
    { name: 'seats', label: 'Places', type: 'number', min: 1, defaultValue: 1 },
    { name: 'consent', label: 'Consentement', type: 'checkbox', required: true },
  ],
}
