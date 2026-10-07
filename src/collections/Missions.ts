import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'

export const Missions: CollectionConfig = {
  slug: 'missions',
  labels: { singular: 'Mission', plural: 'Missions' },
  admin: {
    useAsTitle: 'project',
    group: 'Gestion',
    defaultColumns: ['project', 'zone', 'status'],
    components: { views: { list: { Component: '@/components/admin/MissionsList' } } },
  },
  versions: { drafts: true },
  access: { read: publishedOrAuthenticated, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: 'project', label: 'Projet', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'zone', label: 'Zone (ville, pays)', type: 'text', required: true },
        {
          name: 'scope',
          label: 'Portée',
          type: 'select',
          defaultValue: 'international',
          options: [
            { label: 'Au Québec', value: 'quebec' },
            { label: 'Au Canada', value: 'canada' },
            { label: 'Internationale', value: 'international' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', label: 'Début', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } } },
        { name: 'endDate', label: 'Fin', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } } },
        { name: 'progress', label: 'Avancement (%)', type: 'number', min: 0, max: 100, defaultValue: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'leader', label: 'Responsable', type: 'text' },
        { name: 'ministry', label: 'Ministère lié', type: 'relationship', relationTo: 'ministries' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'images', label: 'Images', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      // Évite le conflit avec l’énumération « _status » des brouillons.
      enumName: 'enum_missions_project_status',
      defaultValue: 'active',
      options: [
        { label: 'En cours', value: 'active' },
        { label: 'À venir', value: 'planned' },
        { label: 'Terminé', value: 'done' },
      ],
    },
  ],
}
