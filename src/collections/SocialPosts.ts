import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const platformOptions = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'WhatsApp', value: 'whatsapp' },
] as const

/**
 * Calendrier éditorial des réseaux sociaux : l’équipe prépare, planifie et suit ses publications.
 * La publication se fait sur chaque plateforme (ou via un outil de planification) ; les statistiques
 * sont saisies ou importées quand les comptes seront connectés.
 */
export const SocialPosts: CollectionConfig = {
  slug: 'social-posts',
  labels: { singular: 'Publication', plural: 'Réseaux sociaux' },
  admin: {
    useAsTitle: 'title',
    group: 'Communication',
    defaultColumns: ['title', 'platforms', 'status', 'scheduledAt'],
    components: { views: { list: { Component: '@/components/admin/SocialPlanner' } } },
  },
  access: { read: isEditor, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: 'scheduledAt',
  fields: [
    { name: 'title', label: 'Titre interne', type: 'text', required: true },
    { name: 'caption', label: 'Texte de la publication', type: 'textarea', maxLength: 2200 },
    { name: 'image', label: 'Visuel', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'platforms', label: 'Plateformes', type: 'select', hasMany: true, options: [...platformOptions], required: true, defaultValue: ['facebook', 'instagram'] },
        {
          name: 'format',
          label: 'Format',
          type: 'select',
          defaultValue: 'photo',
          options: [
            { label: 'Photo', value: 'photo' },
            { label: 'Vidéo', value: 'video' },
            { label: 'Carrousel', value: 'carousel' },
            { label: 'Story / Réel', value: 'story' },
            { label: 'Direct', value: 'live' },
            { label: 'Lien / article', value: 'link' },
          ],
        },
      ],
    },
    { name: 'link', label: 'Lien à partager', type: 'text' },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      enumName: 'enum_social_posts_status',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Planifiée', value: 'scheduled' },
        { label: 'Publiée', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'scheduledAt', label: 'Date de publication', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'postUrl', label: 'Lien de la publication (une fois en ligne)', type: 'text', admin: { position: 'sidebar' } },
    {
      type: 'collapsible',
      label: 'Résultats (après publication)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'reach', label: 'Portée', type: 'number', min: 0 },
            { name: 'likes', label: 'J’aime', type: 'number', min: 0 },
            { name: 'comments', label: 'Commentaires', type: 'number', min: 0 },
          ],
        },
      ],
    },
  ],
}
