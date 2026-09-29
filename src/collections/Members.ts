import type { CollectionConfig } from 'payload'
import { isPastoral } from '../access'

export const memberCategories = [
  { label: 'Jeunesse', value: 'jeunesse' },
  { label: 'Adulte', value: 'adulte' },
  { label: 'Famille', value: 'famille' },
  { label: 'Aîné', value: 'aine' },
] as const

/**
 * Registre des membres de la communauté (renseignements personnels, Loi 25) :
 * réservé aux administrateurs et à l’équipe pastorale, jamais public.
 * Le consentement de la personne est obligatoire pour l’inscrire.
 */
export const Members: CollectionConfig = {
  slug: 'members',
  labels: { singular: 'Membre', plural: 'Membres' },
  admin: {
    useAsTitle: 'name',
    group: 'Gestion',
    defaultColumns: ['name', 'email', 'category', 'status', 'joinedAt'],
    components: { views: { list: { Component: '@/components/admin/MembersList' } } },
  },
  access: { read: isPastoral, create: isPastoral, update: isPastoral, delete: isPastoral },
  defaultSort: 'name',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nom complet', type: 'text', required: true },
        { name: 'category', label: 'Catégorie', type: 'select', options: [...memberCategories], defaultValue: 'adulte' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Courriel', type: 'email' },
        { name: 'phone', label: 'Téléphone', type: 'text' },
      ],
    },
    { name: 'ministries', label: 'Ministères', type: 'relationship', relationTo: 'ministries', hasMany: true },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          label: 'Statut',
          type: 'select',
          enumName: 'enum_members_status',
          defaultValue: 'active',
          options: [
            { label: 'Actif', value: 'active' },
            { label: 'En attente', value: 'pending' },
            { label: 'Inactif', value: 'inactive' },
          ],
        },
        { name: 'joinedAt', label: 'Membre depuis', type: 'date', defaultValue: () => new Date().toISOString() },
      ],
    },
    {
      name: 'consent',
      label: 'La personne a donné son accord pour être inscrite au registre des membres',
      type: 'checkbox',
      required: true,
      validate: (v: unknown) => (v === true ? true : 'Le consentement est obligatoire (Loi 25).'),
    },
    { name: 'notes', label: 'Notes pastorales', type: 'textarea' },
  ],
}
