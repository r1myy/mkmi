import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Événement', plural: 'Événements' },
  admin: {
    useAsTitle: 'title',
    group: 'Gestion',
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
          name: 'endsAt',
          label: 'Date et heure de fin',
          type: 'date',
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
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          label: 'Catégorie',
          type: 'select',
          defaultValue: 'rencontre',
          options: [
            { label: 'Louange', value: 'louange' },
            { label: 'Enseignement', value: 'enseignement' },
            { label: 'Prière', value: 'priere' },
            { label: 'Conférence', value: 'conference' },
            { label: 'Atelier', value: 'atelier' },
            { label: 'Jeunesse', value: 'jeunesse' },
            { label: 'Famille', value: 'famille' },
            { label: 'Rencontre', value: 'rencontre' },
          ],
        },
        {
          name: 'format',
          label: 'Format',
          type: 'select',
          defaultValue: 'onsite',
          options: [
            { label: 'En présentiel', value: 'onsite' },
            { label: 'En ligne', value: 'online' },
            { label: 'En présentiel et en ligne', value: 'hybrid' },
          ],
        },
        {
          name: 'featured',
          label: 'À la une',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Mis en avant en haut de la page Événements.' },
        },
      ],
    },
    { name: 'location', label: 'Lieu', type: 'text', defaultValue: 'Québec, Québec' },
    { name: 'streamUrl', label: 'Lien de la diffusion en ligne', type: 'text' },
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
