import type { CollectionConfig } from 'payload'
import { isPastoral } from '../access'

/**
 * Données potentiellement sensibles (Loi 25) : jamais publiques,
 * lisibles uniquement par les administrateurs et l’équipe pastorale.
 * La création passe par le formulaire du site (validation serveur).
 */
export const PrayerRequests: CollectionConfig = {
  slug: 'prayer-requests',
  labels: { singular: 'Demande de prière', plural: 'Demandes de prière' },
  admin: {
    useAsTitle: 'name',
    group: 'Communauté',
    defaultColumns: ['name', 'status', 'confidential', 'createdAt'],
  },
  access: { read: isPastoral, create: isPastoral, update: isPastoral, delete: isPastoral },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true, maxLength: 120 },
    { name: 'email', label: 'Courriel', type: 'email', required: true },
    { name: 'phone', label: 'Téléphone', type: 'text', maxLength: 40 },
    { name: 'request', label: 'Demande', type: 'textarea', required: true, maxLength: 5000 },
    { name: 'wantsReply', label: 'Souhaite une réponse', type: 'checkbox', defaultValue: false },
    { name: 'confidential', label: 'Confidentielle', type: 'checkbox', defaultValue: true },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouvelle', value: 'new' },
        { label: 'En prière', value: 'praying' },
        { label: 'Répondue', value: 'answered' },
        { label: 'Archivée', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'internalNotes', label: 'Notes internes', type: 'textarea' },
  ],
}
