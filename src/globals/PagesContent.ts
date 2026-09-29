import type { Field, GlobalConfig } from 'payload'
import { anyone, isEditor } from '../access'

const image = (name: string, label: string): Field => ({ name, label, type: 'upload', relationTo: 'media' })

const faqDefaults = [
  {
    question: 'Combien de temps dure le culte ?',
    answer: 'La durée du culte sera précisée prochainement. N’hésitez pas à nous écrire pour toute question.',
  },
  {
    question: 'Les enfants sont-ils accueillis ?',
    answer: 'Oui ! Les familles sont les bienvenues. Écrivez-nous pour connaître ce qui est prévu pour les enfants.',
  },
  {
    question: 'Comment dois-je m’habiller ?',
    answer: 'Venez comme vous êtes. Il n’y a pas de code vestimentaire : l’important, c’est que vous soyez à l’aise.',
  },
  {
    question: 'Où stationner ?',
    answer: 'Les informations sur le stationnement seront publiées prochainement.',
  },
  {
    question: 'Est-il nécessaire d’être membre pour participer ?',
    answer: 'Non. Tout le monde est bienvenu à nos cultes et à nos activités, membre ou non.',
  },
]

/**
 * Contenus des pages intérieures modifiables sans toucher au code :
 * photos, questions fréquentes, équipe, liens du balado, etc.
 * Rien d’officiel n’est inventé : les valeurs par défaut sont des espaces réservés.
 */
export const PagesContent: GlobalConfig = {
  slug: 'pages-content',
  label: 'Pages intérieures',
  admin: { group: 'Contenu', description: 'Photos et contenus des pages Église, Découvrir, Ministères, etc.' },
  access: { read: anyone, update: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Église',
          name: 'eglise',
          fields: [
            image('heroImage', 'Photo du haut de page'),
            image('welcomeImage', 'Photo « Venez comme vous êtes »'),
            image('membershipImage', 'Photo « Devenir membre »'),
            {
              name: 'faq',
              label: 'Questions fréquentes',
              type: 'array',
              defaultValue: faqDefaults,
              fields: [
                { name: 'question', label: 'Question', type: 'text', required: true },
                { name: 'answer', label: 'Réponse', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Découvrir',
          name: 'decouvrir',
          fields: [
            image('heroImage', 'Photo du haut de page'),
            image('storyImage', 'Photo « Qui sommes-nous »'),
            image('faithImage', 'Photo « Notre foi »'),
            {
              name: 'timeline',
              label: 'Notre histoire (étapes)',
              type: 'array',
              defaultValue: [
                { label: 'Les débuts', title: 'Fondation de MKMI', text: 'Date à confirmer' },
                { label: 'Au fil des années', title: 'Expansion', text: 'Dans plusieurs pays et villes' },
                { label: 'Aujourd’hui', title: 'MKMI Québec', text: 'Au service de notre communauté' },
                { label: 'Demain', title: 'Toujours plus loin', text: 'Pour la gloire de Dieu' },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: 'Repère (année, période)', type: 'text', required: true },
                    { name: 'title', label: 'Titre', type: 'text', required: true },
                  ],
                },
                { name: 'text', label: 'Texte', type: 'text' },
              ],
            },
            {
              name: 'leaders',
              label: 'Équipe de leadership',
              type: 'array',
              defaultValue: [
                { name: 'Nom à confirmer', role: 'Pasteur principal' },
                { name: 'Nom à confirmer', role: 'Pasteure associée' },
                { name: 'Nom à confirmer', role: 'Leader pastoral' },
                { name: 'Nom à confirmer', role: 'Responsable des ministères' },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Nom', type: 'text', required: true },
                    { name: 'role', label: 'Rôle', type: 'text', required: true },
                  ],
                },
                image('photo', 'Photo'),
              ],
            },
          ],
        },
        {
          label: 'Ministères',
          name: 'ministeres',
          fields: [image('heroImage', 'Photo du haut de page'), image('serveImage', 'Photo « S’impliquer »')],
        },
        {
          label: 'Messages',
          name: 'messages',
          fields: [
            image('heroImage', 'Photo du haut de page'),
            { name: 'spotifyUrl', label: 'Lien Spotify du balado', type: 'text' },
            { name: 'applePodcastsUrl', label: 'Lien Apple Podcasts', type: 'text' },
            { name: 'youtubeChannelUrl', label: 'Lien de la chaîne YouTube', type: 'text' },
          ],
        },
        {
          label: 'Missions',
          name: 'missions',
          fields: [image('heroImage', 'Photo du haut de page'), image('visionImage', 'Photo « Notre vision »')],
        },
        {
          label: 'Prière',
          name: 'priere',
          fields: [image('heroImage', 'Photo du haut de page'), image('sideImage', 'Photo à côté du formulaire')],
        },
        {
          label: 'Contact',
          name: 'contact',
          fields: [
            image('heroImage', 'Photo du haut de page'),
            image('visitImage', 'Photo « Visitez-nous »'),
            {
              name: 'officeHours',
              label: 'Heures d’ouverture',
              type: 'text',
              defaultValue: 'Heures à confirmer',
            },
          ],
        },
      ],
    },
  ],
}
