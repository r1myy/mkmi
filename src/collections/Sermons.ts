import type { CollectionConfig } from 'payload'
import { isEditor, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'

export const Sermons: CollectionConfig = {
  slug: 'sermons',
  labels: { singular: 'Message (prédication)', plural: 'Messages' },
  admin: {
    useAsTitle: 'title',
    group: 'Gestion',
    defaultColumns: ['title', 'preacher', 'date', 'featured', '_status'],
    description: 'Prédications, études bibliques et enseignements publiés sur la page Messages du site.',
    components: { views: { list: { Component: '@/components/admin/SermonsList' } } },
  },
  versions: { drafts: true },
  access: { read: publishedOrAuthenticated, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: '-date',
  fields: [
    { name: 'title', label: 'Titre', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'preacher', label: 'Prédicateur', type: 'text', defaultValue: 'Pasteur (nom à confirmer)' },
        { name: 'date', label: 'Date', type: 'date', required: true },
      ],
    },
    { name: 'series', label: 'Série', type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          label: 'Catégorie',
          type: 'text',
          defaultValue: 'Prédication',
          admin: { description: 'Ex. Prédication, Étude biblique, Conférence, Jeunesse, Témoignage, Louange.' },
        },
        { name: 'duration', label: 'Durée (ex. 48:32)', type: 'text', maxLength: 10 },
      ],
    },
    {
      name: 'featured',
      label: 'Message de la semaine',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Affiché sur la page d’accueil (sinon, le plus récent).' },
    },
    { name: 'thumbnail', label: 'Miniature', type: 'upload', relationTo: 'media' },
    { name: 'preacherPhoto', label: 'Photo du prédicateur', type: 'upload', relationTo: 'media' },
    {
      name: 'youtubeUrl',
      label: 'Lien YouTube',
      type: 'text',
      admin: { description: 'Si aucune miniature n’est fournie, celle de YouTube est utilisée.' },
    },
    { name: 'podcastUrl', label: 'Lien du podcast', type: 'text' },
    { name: 'audioFile', label: 'Fichier audio à télécharger', type: 'upload', relationTo: 'media' },
    { name: 'description', label: 'Description', type: 'richText' },
    slugField(),
  ],
}
