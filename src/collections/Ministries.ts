import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

export const ministryIcons = [
  { label: 'Enfants', value: 'baby' },
  { label: 'Jeunesse (livre)', value: 'book' },
  { label: 'Femmes', value: 'flower' },
  { label: 'Hommes', value: 'users' },
  { label: 'Couples', value: 'heart-handshake' },
  { label: 'Prière', value: 'hand-heart' },
  { label: 'Louange (musique)', value: 'music' },
  { label: 'Missions (globe)', value: 'globe' },
  { label: 'Médias (caméra)', value: 'video' },
  { label: 'Formation', value: 'graduation-cap' },
  { label: 'Évangélisation', value: 'megaphone' },
] as const

export const Ministries: CollectionConfig = {
  slug: 'ministries',
  labels: { singular: 'Ministère', plural: 'Ministères' },
  admin: { useAsTitle: 'name', group: 'Contenu', defaultColumns: ['name', 'order', '_status'] },
  versions: { drafts: true },
  access: { read: publishedOrAuthenticated, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'icon', label: 'Icône', type: 'select', options: [...ministryIcons], defaultValue: 'users' },
        {
          name: 'accent',
          label: 'Couleur de l’icône',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { label: 'Bleu', value: 'blue' },
            { label: 'Rouge', value: 'red' },
            { label: 'Vert', value: 'green' },
            { label: 'Violet', value: 'purple' },
            { label: 'Or', value: 'gold' },
          ],
        },
        { name: 'order', label: 'Ordre', type: 'number', defaultValue: 0 },
      ],
    },
    { name: 'summary', label: 'Description courte', type: 'textarea' },
    { name: 'description', label: 'Description', type: 'richText' },
    { name: 'leader', label: 'Responsable', type: 'text' },
    { name: 'schedule', label: 'Horaires', type: 'text' },
    slugField('name'),
  ],
}
