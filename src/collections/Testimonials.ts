import type { CollectionConfig, Where } from 'payload'
import { isEditor } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Témoignage', plural: 'Témoignages' },
  admin: { useAsTitle: 'firstName', group: 'Communauté', defaultColumns: ['firstName', 'approved', 'createdAt'] },
  access: {
    // Seuls les témoignages approuvés et consentis sont publics. Les soumissions passeront par un formulaire serveur (phase 6).
    read: ({ req: { user } }) => {
      if (user) return true
      const where: Where = { and: [{ approved: { equals: true } }, { consent: { equals: true } }] }
      return where
    },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: 'firstName', label: 'Prénom', type: 'text', required: true, maxLength: 80 },
    { name: 'email', label: 'Courriel', type: 'email', access: { read: ({ req }) => Boolean(req.user) } },
    { name: 'text', label: 'Témoignage', type: 'textarea', required: true, maxLength: 4000 },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media' },
    { name: 'consent', label: 'Consentement à la publication', type: 'checkbox', required: true },
    {
      name: 'approved',
      label: 'Approuvé pour publication',
      type: 'checkbox',
      defaultValue: false,
      access: { create: () => false },
      admin: { position: 'sidebar' },
    },
  ],
}
