import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

export const faithTypes = [
  { label: 'Article', value: 'article' },
  { label: 'Vidéo', value: 'video' },
  { label: 'Guide', value: 'guide' },
  { label: 'Série', value: 'serie' },
  { label: 'Parcours', value: 'parcours' },
] as const

export const faithThemes = [
  { label: 'Qui est Dieu ?', value: 'dieu' },
  { label: 'Qui est Jésus ?', value: 'jesus' },
  { label: 'Lire la Bible', value: 'bible' },
  { label: 'La prière', value: 'priere' },
  { label: 'La vie chrétienne', value: 'vie' },
  { label: 'La croissance spirituelle', value: 'croissance' },
  { label: 'La famille', value: 'famille' },
  { label: 'Autres', value: 'autres' },
] as const

export const faithLevels = [
  { label: 'Débutant', value: 'debutant' },
  { label: 'Intermédiaire', value: 'intermediaire' },
  { label: 'Avancé', value: 'avance' },
] as const

/** Ressources de la section « Découvrir la foi » : articles, vidéos, guides, séries et parcours. */
export const FaithResources: CollectionConfig = {
  slug: 'faith-resources',
  labels: { singular: 'Ressource de foi', plural: 'Découvrir la foi' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenu',
    defaultColumns: ['title', 'type', 'theme', 'level', '_status'],
    description: 'Articles, vidéos, guides et parcours qui aident à connaître Dieu, comprendre la Bible et grandir dans la foi.',
    components: { views: { list: { Component: '@/components/admin/FaithResourcesList' } } },
  },
  versions: { drafts: true },
  access: { read: publishedOrAuthenticated, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true, maxLength: 140 },
    {
      type: 'row',
      fields: [
        { name: 'type', label: 'Type', type: 'select', options: [...faithTypes], defaultValue: 'article', required: true, enumName: 'enum_faith_type' },
        { name: 'theme', label: 'Thème', type: 'select', options: [...faithThemes], defaultValue: 'autres', required: true, enumName: 'enum_faith_theme' },
        { name: 'level', label: 'Niveau', type: 'select', options: [...faithLevels], defaultValue: 'debutant', enumName: 'enum_faith_level' },
      ],
    },
    { name: 'summary', label: 'Résumé (affiché sur les cartes)', type: 'textarea', maxLength: 300 },
    {
      type: 'row',
      fields: [
        { name: 'author', label: 'Auteur', type: 'text', maxLength: 80 },
        { name: 'publishedAt', label: 'Date de publication', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
        { name: 'duration', label: 'Durée ou temps de lecture (ex. 5 min, 28:40)', type: 'text', maxLength: 20 },
      ],
    },
    { name: 'cover', label: 'Image', type: 'upload', relationTo: 'media' },
    { name: 'youtubeUrl', label: 'Vidéo YouTube (facultatif)', type: 'text' },
    { name: 'body', label: 'Contenu', type: 'richText' },
    {
      name: 'featured',
      label: 'Mettre en avant',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Affichée en premier dans « Ressources récentes » ou « Vidéos populaires ».' },
    },
    slugField(),
  ],
}
