import type { CollectionConfig, Where } from 'payload'
import { isEditor } from '../access'

export const announcementCategories = [
  { label: 'Événement', value: 'evenement' },
  { label: 'Prière', value: 'priere' },
  { label: 'Formation', value: 'formation' },
  { label: 'Missions', value: 'missions' },
  { label: 'Enseignement', value: 'enseignement' },
  { label: 'Familles', value: 'familles' },
  { label: 'Vie de l’église', value: 'eglise' },
] as const

/**
 * Annonces à la communauté. Une annonce « À la une » publiée s’affiche en bandeau sur la page d’accueil.
 * Le public ne voit que les annonces publiées dont la date de publication est passée.
 */
export const Announcements: CollectionConfig = {
  slug: 'announcements',
  labels: { singular: 'Annonce', plural: 'Annonces' },
  admin: {
    useAsTitle: 'title',
    group: 'Communication',
    defaultColumns: ['title', 'category', 'status', 'publishAt'],
    components: { views: { list: { Component: '@/components/admin/AnnouncementsList' } } },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      const where: Where = {
        and: [{ status: { equals: 'published' } }, { publishAt: { less_than_equal: new Date().toISOString() } }],
      }
      return where
    },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  defaultSort: '-publishAt',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'summary', label: 'Texte de l’annonce', type: 'textarea', required: true, maxLength: 400 },
    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'link', label: 'Lien (ex. /evenements ou https://…)', type: 'text' },
        { name: 'linkLabel', label: 'Texte du lien', type: 'text', defaultValue: 'En savoir plus' },
      ],
    },
    {
      name: 'category',
      label: 'Catégorie',
      type: 'select',
      options: [...announcementCategories],
      defaultValue: 'eglise',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      enumName: 'enum_announcements_status',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'En attente de validation', value: 'pending' },
        { label: 'Publiée', value: 'published' },
        { label: 'Archivée', value: 'archived' },
      ],
      admin: { position: 'sidebar', description: 'Une annonce publiée avec une date future est « planifiée ».' },
    },
    {
      name: 'publishAt',
      label: 'Date de publication',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'featured',
      label: 'À la une (bandeau sur l’accueil)',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
