import type { Field, GlobalConfig } from 'payload'
import { anyone, isEditor } from '../access'

const text = (name: string, label: string, defaultValue: string, textarea = false): Field =>
  textarea ? { name, label, type: 'textarea', defaultValue } : { name, label, type: 'text', defaultValue }

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Page d’accueil',
  admin: { group: 'Contenu' },
  access: { read: anyone, update: isEditor },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          name: 'hero',
          fields: [
            text('eyebrow', 'Sur-titre', 'MKMI Québec'),
            {
              name: 'lines',
              label: 'Accroche (une ligne par entrée)',
              type: 'array',
              defaultValue: [
                { lead: 'Une', highlight: 'famille.' },
                { lead: 'Une', highlight: 'foi.' },
                { lead: 'Une', highlight: 'mission.' },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'lead', label: 'Texte', type: 'text' },
                    { name: 'highlight', label: 'Texte en or', type: 'text' },
                  ],
                },
              ],
            },
            text(
              'subtitle',
              'Sous-titre',
              'Une communauté chrétienne où nous grandissons dans la foi, vivons la communion fraternelle et annonçons l’Évangile à notre génération.',
              true,
            ),
            { name: 'image', label: 'Photo ou affiche du hero', type: 'upload', relationTo: 'media' },
            {
              name: 'video',
              label: 'Vidéo du hero (optionnelle, MP4)',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Nouveau ici ?',
          name: 'welcome',
          fields: [
            text('eyebrow', 'Sur-titre', 'Nouveau ici ?'),
            text('title', 'Titre', 'Vous êtes les bienvenus.'),
            text(
              'text',
              'Texte',
              'Que vous découvriez la foi chrétienne, que vous soyez nouveau à Québec ou que vous cherchiez simplement une communauté où grandir, vous avez votre place parmi nous.',
              true,
            ),
            {
              name: 'cards',
              label: 'Cartes',
              type: 'array',
              maxRows: 3,
              defaultValue: [
                {
                  title: 'Je découvre l’église',
                  text: 'Apprenez à nous connaître et à quoi vous attendre.',
                  href: '/decouvrir',
                  icon: 'church',
                },
                {
                  title: 'Je découvre la foi',
                  text: 'Des réponses aux grandes questions de la vie.',
                  href: '/decouvrir/foi',
                  icon: 'book',
                },
                {
                  title: 'Je veux rencontrer quelqu’un',
                  text: 'Échangez avec notre équipe et trouvez votre place.',
                  href: '/contact',
                  icon: 'users',
                },
              ],
              fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'text', label: 'Texte', type: 'textarea' },
                { name: 'href', label: 'Lien', type: 'text' },
                {
                  name: 'icon',
                  label: 'Icône',
                  type: 'select',
                  options: [
                    { label: 'Église / groupe', value: 'church' },
                    { label: 'Bible', value: 'book' },
                    { label: 'Personnes', value: 'users' },
                  ],
                },
                { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Notre ADN',
          name: 'pillars',
          fields: [
            text('eyebrow', 'Sur-titre', 'Notre ADN'),
            text('title', 'Titre', 'Quatre piliers pour une génération'),
            text(
              'text',
              'Texte',
              'Nous sommes une église passionnée par Jésus, centrée sur la Parole, attachée à la communauté et engagée pour notre monde.',
              true,
            ),
            { name: 'background', label: 'Image de fond', type: 'upload', relationTo: 'media' },
            {
              name: 'items',
              label: 'Piliers',
              type: 'array',
              maxRows: 4,
              defaultValue: [
                { title: 'Évangéliser', text: 'Partager l’Évangile et rejoindre notre génération.', icon: 'megaphone' },
                { title: 'Enseigner', text: 'Grandir dans la connaissance de la Parole de Dieu.', icon: 'book' },
                { title: 'Communauté', text: 'Vivre une foi qui se partage avec les autres.', icon: 'users' },
                { title: 'Servir', text: 'Mettre nos dons au service de Dieu et de notre prochain.', icon: 'heart' },
              ],
              fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'text', label: 'Texte', type: 'textarea' },
                {
                  name: 'icon',
                  label: 'Icône',
                  type: 'select',
                  options: [
                    { label: 'Mégaphone', value: 'megaphone' },
                    { label: 'Livre', value: 'book' },
                    { label: 'Personnes', value: 'users' },
                    { label: 'Cœur', value: 'heart' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Prière',
          name: 'prayer',
          fields: [
            text('eyebrow', 'Sur-titre', 'Prière'),
            text('title', 'Titre', 'Vous n’avez pas à traverser cela seul.'),
            text(
              'text',
              'Texte',
              'Notre équipe est disponible pour prier avec vous.\nPeu importe ce que vous vivez, Dieu écoute et se soucie de vous.',
              true,
            ),
            { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Missions',
          name: 'missions',
          fields: [
            text('eyebrow', 'Sur-titre', 'Missions'),
            text('title', 'Titre', 'Au-delà de Québec'),
            text('subtitle', 'Sous-titre', 'L’Évangile ne connaît pas de frontières.'),
            text(
              'text',
              'Texte',
              'Nous croyons à une église qui impacte sa ville, son pays et les nations. Ensemble, nous soutenons des initiatives locales et internationales pour partager l’amour de Christ.',
              true,
            ),
            {
              name: 'zones',
              label: 'Zones (uniquement celles officiellement confirmées)',
              type: 'array',
              defaultValue: [
                { name: 'Québec' },
                { name: 'Canada' },
                { name: 'Haïti' },
                { name: 'Caraïbes' },
                { name: 'Afrique' },
                { name: 'Monde' },
              ],
              fields: [{ name: 'name', label: 'Zone', type: 'text', required: true }],
            },
            { name: 'images', label: 'Photos', type: 'upload', relationTo: 'media', hasMany: true, maxRows: 5 },
          ],
        },
        {
          label: 'Appel final',
          name: 'finalCta',
          fields: [
            text('title', 'Titre', 'Prêt à faire un pas de plus ?'),
            text(
              'text',
              'Texte',
              'Nous serions heureux de vous accueillir et de marcher avec vous sur votre cheminement de foi.',
              true,
            ),
            { name: 'background', label: 'Image de fond', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
