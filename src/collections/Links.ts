import type { CollectionConfig } from 'payload'
import { authenticated, isEditor } from '../access'
import { folderField } from '../fields/folder'

/** Liens utiles pour l’équipe (formulaires, outils, plateformes). Visibles seulement une fois connecté. */
export const Links: CollectionConfig = {
  slug: 'links',
  labels: { singular: 'Lien utile', plural: 'Liens utiles' },
  admin: { useAsTitle: 'title', group: 'Ressources', defaultColumns: ['title', 'url', 'folder'] },
  access: { read: authenticated, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'url', label: 'Adresse (https://…)', type: 'text', required: true, validate: (v: unknown) => (typeof v === 'string' && /^https?:\/\//.test(v) ? true : 'Indiquez une adresse qui commence par https://') },
    { name: 'description', label: 'Description', type: 'textarea' },
    folderField,
  ],
}
