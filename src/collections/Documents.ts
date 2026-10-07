import type { CollectionConfig } from 'payload'
import { authenticated, isEditor } from '../access'
import { folderField } from '../fields/folder'

/**
 * Documents internes de l’équipe (guides, modèles, rapports).
 * Jamais publics : les fichiers ne sont accessibles qu’aux personnes connectées.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Document', plural: 'Documents' },
  admin: {
    useAsTitle: 'title',
    group: 'Ressources',
    defaultColumns: ['title', 'folder', 'updatedAt'],
    components: { views: { list: { Component: '@/components/admin/ResourcesLibrary' } } },
  },
  access: { read: authenticated, create: isEditor, update: isEditor, delete: isEditor },
  upload: {
    staticDir: 'documents',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'image/*',
    ],
  },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    folderField,
  ],
}
