import type { CollectionConfig } from 'payload'
import { isPastoral } from '../access'

export const VisitPlans: CollectionConfig = {
  slug: 'visit-plans',
  labels: { singular: 'Visite planifiée', plural: 'Visites planifiées' },
  admin: { useAsTitle: 'name', group: 'Communauté', defaultColumns: ['name', 'visitDate', 'people', 'createdAt'] },
  access: { read: isPastoral, create: isPastoral, update: isPastoral, delete: isPastoral },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'Courriel', type: 'email', required: true },
    { name: 'phone', label: 'Téléphone', type: 'text' },
    { name: 'visitDate', label: 'Date souhaitée', type: 'date' },
    { name: 'people', label: 'Nombre de personnes', type: 'number', min: 1, defaultValue: 1 },
    { name: 'withChildren', label: 'Avec enfants', type: 'checkbox' },
    { name: 'consent', label: 'Consentement', type: 'checkbox', required: true },
  ],
}
