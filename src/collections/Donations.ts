import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const donationCategories = [
  { label: 'Dons généraux', value: 'general' },
  { label: 'Dîme', value: 'tithe' },
  { label: 'Missions', value: 'missions' },
  { label: 'Projets spéciaux', value: 'projects' },
  { label: 'Bâtiment', value: 'building' },
  { label: 'Aide sociale', value: 'social' },
  { label: 'Jeunesse', value: 'youth' },
  { label: 'Autre', value: 'other' },
] as const

export const donationMethods = [
  { label: 'Carte de crédit', value: 'card' },
  { label: 'Virement Interac', value: 'interac' },
  { label: 'Virement bancaire', value: 'bank' },
  { label: 'Chèque', value: 'cheque' },
  { label: 'Espèces', value: 'cash' },
  { label: 'Plateforme en ligne', value: 'online' },
] as const

/**
 * Registre des dons (saisie par l’équipe, ou import depuis la plateforme de don).
 * Données financières : réservées aux administrateurs.
 */
export const Donations: CollectionConfig = {
  slug: 'donations',
  labels: { singular: 'Don', plural: 'Dons' },
  admin: {
    useAsTitle: 'donorName',
    group: 'Gestion',
    defaultColumns: ['date', 'donorName', 'amount', 'category', 'method', 'status'],
    components: { views: { list: { Component: '@/components/admin/DonationsList' } } },
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: '-date',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'date', label: 'Date du don', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
        { name: 'amount', label: 'Montant ($)', type: 'number', required: true, min: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'donorName', label: 'Donateur', type: 'text', required: true, defaultValue: 'Anonyme' },
        { name: 'email', label: 'Courriel', type: 'email' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'category', label: 'Catégorie', type: 'select', options: [...donationCategories], defaultValue: 'general', required: true },
        { name: 'method', label: 'Mode de paiement', type: 'select', options: [...donationMethods], defaultValue: 'cash', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          label: 'Statut',
          type: 'select',
          enumName: 'enum_donations_status',
          defaultValue: 'confirmed',
          options: [
            { label: 'Confirmé', value: 'confirmed' },
            { label: 'En attente', value: 'pending' },
            { label: 'Remboursé', value: 'refunded' },
          ],
        },
        { name: 'recurring', label: 'Don mensuel récurrent', type: 'checkbox', defaultValue: false },
        { name: 'receiptSent', label: 'Reçu remis', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
}
