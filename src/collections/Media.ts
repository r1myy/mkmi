import type { CollectionConfig } from 'payload'
import { anyone, isEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: { group: 'Contenu' },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    {
      name: 'alt',
      label: 'Texte alternatif',
      type: 'text',
      required: true,
      admin: { description: 'Décrivez l’image pour les personnes malvoyantes (accessibilité).' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'audio/*', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'hero', width: 1920 },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
}
