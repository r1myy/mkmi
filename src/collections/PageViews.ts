import type { CollectionConfig } from 'payload'
import { isAdmin, isEditor } from '../access'

/**
 * Statistiques de fréquentation anonymes : un compteur par page et par jour.
 * Aucune adresse IP, aucun cookie, aucune donnée personnelle (compatible Loi 25).
 */
export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: { singular: 'Visite (statistique)', plural: 'Visites (statistiques)' },
  admin: { group: 'Statistiques', defaultColumns: ['day', 'path', 'count'], useAsTitle: 'path' },
  access: { read: isEditor, create: isAdmin, update: isAdmin, delete: isAdmin },
  indexes: [{ fields: ['day', 'path'], unique: true }],
  fields: [
    { name: 'day', label: 'Jour', type: 'text', required: true, index: true },
    { name: 'path', label: 'Page', type: 'text', required: true },
    { name: 'count', label: 'Vues', type: 'number', required: true, defaultValue: 0 },
  ],
}
