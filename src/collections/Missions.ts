import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'

export const Missions: CollectionConfig = {
  slug: 'missions',
  labels: { singular: 'Mission', plural: 'Missions' },
  admin: { useAsTitle: 'project', group: 'Contenu', defaultColumns: ['project', 'zone', 'status'] },
  versions: { drafts: true },
  access: { read: publishedOrAuthenticated, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'project', label: 'Projet', type: 'text', required: true },
    { name: 'zone', label: 'Zone', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'images', label: 'Images', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      // Évite le conflit avec l’énumération « _status » des brouillons.
      enumName: 'enum_missions_project_status',
      defaultValue: 'active',
      options: [
        { label: 'En cours', value: 'active' },
        { label: 'À venir', value: 'planned' },
        { label: 'Terminé', value: 'done' },
      ],
    },
  ],
}
