import type { CollectionConfig } from 'payload'
import { anyone, isEditor } from '../access'
import { folderField } from '../fields/folder'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: {
    group: 'Ressources',
    description: 'Photos, vidéos et fichiers publics du site. Pour les documents internes, utilisez « Documents ».',
    components: { views: { list: { Component: '@/components/admin/MediaLibrary' } } },
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    {
      name: 'alt',
      label: 'Texte alternatif',
      type: 'text',
      required: true,
      admin: { description: 'Décrivez l’image pour les personnes malvoyantes (accessibilité).' },
    },
    folderField,
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'audio/*', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'hero', width: 1920 },
    ],
    formatOptions: { format: 'webp', options: { quality: 82 } },
  },
}
