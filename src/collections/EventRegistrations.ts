import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  labels: { singular: 'Inscription', plural: 'Inscriptions' },
  admin: { useAsTitle: 'name', group: 'Gestion', defaultColumns: ['name', 'event', 'seats', 'status', 'createdAt'],
    components: { views: { list: { Component: '@/components/admin/RegistrationsList' } } },
  },
  access: { read: isEditor, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'event', label: 'Événement', type: 'relationship', relationTo: 'events', required: true },
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'Courriel', type: 'email', required: true },
    { name: 'seats', label: 'Places', type: 'number', min: 1, defaultValue: 1 },
    { name: 'consent', label: 'Consentement', type: 'checkbox', required: true },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'confirmed',
      enumName: 'enum_event_registrations_status',
      options: [
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'En attente', value: 'pending' },
        { label: 'Annulée', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', label: 'Notes internes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
