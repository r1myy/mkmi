import type { CollectionConfig, Where } from 'payload'
import { isEditor } from '../access'

export const testimonialCategories = [
  { label: 'Guérison', value: 'guerison' },
  { label: 'Délivrance', value: 'delivrance' },
  { label: 'Restauration', value: 'restauration' },
  { label: 'Provision', value: 'provision' },
  { label: 'Direction', value: 'direction' },
  { label: 'Vie de prière', value: 'priere' },
  { label: 'Étude biblique', value: 'etude' },
  { label: 'Famille', value: 'famille' },
  { label: 'Autre', value: 'autre' },
] as const

export const testimonialStatuses = [
  { label: 'En attente', value: 'pending' },
  { label: 'Publié', value: 'published' },
  { label: 'Refusé', value: 'rejected' },
] as const

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'firstName', 'category', 'status', 'createdAt'],
    description: 'Témoignages partagés par la communauté. Seuls les témoignages publiés et consentis apparaissent sur le site.',
    components: { views: { list: { Component: '@/components/admin/TestimonialsList' } } },
  },
  access: {
    // Seuls les témoignages publiés et consentis sont publics.
    read: ({ req: { user } }) => {
      if (user) return true
      const where: Where = { and: [{ approved: { equals: true } }, { consent: { equals: true } }] }
      return where
    },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // « Approuvé » suit toujours le statut (sert au filtre public).
        if (data.status) data.approved = data.status === 'published'
        return data
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, maxLength: 140 },
    {
      type: 'row',
      fields: [
        { name: 'firstName', label: 'Auteur (prénom ou nom affiché)', type: 'text', required: true, maxLength: 80 },
        {
          name: 'category',
          label: 'Catégorie',
          type: 'select',
          options: [...testimonialCategories],
          defaultValue: 'autre',
          enumName: 'enum_testimonials_category',
        },
      ],
    },
    { name: 'email', label: 'Courriel', type: 'email', access: { read: ({ req }) => Boolean(req.user) } },
    { name: 'text', label: 'Témoignage', type: 'textarea', required: true, maxLength: 4000 },
    {
      type: 'row',
      fields: [
        { name: 'youtubeUrl', label: 'Vidéo YouTube (facultatif)', type: 'text' },
        { name: 'duration', label: 'Durée (ex. 8:24)', type: 'text', maxLength: 10 },
      ],
    },
    { name: 'photo', label: 'Photo ou miniature', type: 'upload', relationTo: 'media' },
    { name: 'consent', label: 'Consentement à la publication', type: 'checkbox', required: true },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      options: [...testimonialStatuses],
      defaultValue: 'pending',
      enumName: 'enum_testimonials_status',
      admin: { position: 'sidebar' },
    },
    {
      name: 'approved',
      label: 'Approuvé pour publication',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', readOnly: true, description: 'Coché automatiquement quand le statut est « Publié ».' },
    },
  ],
}
