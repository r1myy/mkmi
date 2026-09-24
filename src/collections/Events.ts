import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Événement', plural: 'Événements' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'startsAt', 'location', '_status'],
  },
  versions: { drafts: true },
  access: { read: publishedOrAuthenticated, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: 'startsAt',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          label: 'Date et heure de début',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'timeToConfirm',
          label: 'Heure à confirmer',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    { name: 'location', label: 'Lieu', type: 'text', defaultValue: 'Québec, Québec' },
    { name: 'summary', label: 'Description courte', type: 'textarea' },
    { name: 'description', label: 'Description complète', type: 'richText' },
    {
      type: 'row',
      fields: [
        { name: 'registrationEnabled', label: 'Inscriptions ouvertes', type: 'checkbox', defaultValue: true },
        { name: 'capacity', label: 'Places disponibles', type: 'number', min: 0 },
      ],
    },
    slugField(),
  ],
}
