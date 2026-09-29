import type { CollectionConfig } from 'payload'
import { isPastoral } from '../access'

/** Messages envoyés depuis la page « Nous contacter ». Jamais publics (Loi 25). */
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Message reçu', plural: 'Messages reçus' },
  admin: {
    useAsTitle: 'name',
    group: 'Gestion',
    defaultColumns: ['name', 'subject', 'status', 'createdAt'],
  },
  access: { read: isPastoral, create: isPastoral, update: isPastoral, delete: isPastoral },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, maxLength: 120 },
    { name: 'email', label: 'Courriel', type: 'email', required: true },
    { name: 'phone', label: 'Téléphone', type: 'text', maxLength: 40 },
    { name: 'subject', label: 'Sujet', type: 'text', required: true, maxLength: 120 },
    { name: 'message', label: 'Message', type: 'textarea', required: true, maxLength: 5000 },
    { name: 'newsletter', label: 'Souhaite recevoir les nouvelles', type: 'checkbox', defaultValue: false },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'new',
      enumName: 'enum_contact_messages_status',
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Répondu', value: 'answered' },
        { label: 'Archivé', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
