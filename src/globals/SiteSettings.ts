import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '../access'

/** Informations officielles de l’église. Tant qu’elles ne sont pas validées, des placeholders sont affichés. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Informations de l’église',
  admin: { group: 'Paramètres' },
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identité',
          fields: [
            { name: 'name', label: 'Nom public', type: 'text', defaultValue: 'MKMI Québec' },
            {
              name: 'tagline',
              label: 'Signature (pied de page)',
              type: 'textarea',
              defaultValue: 'Une communauté.\nUne foi.\nUne mission.',
            },
            { name: 'logo', label: 'Logo officiel', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Culte',
          fields: [
            { name: 'serviceDay', label: 'Jour du culte', type: 'text', defaultValue: 'Dimanche' },
            { name: 'serviceTime', label: 'Heure du culte', type: 'text', defaultValue: 'Heure à confirmer' },
            { name: 'city', label: 'Ville affichée', type: 'text', defaultValue: 'Québec, Québec' },
            { name: 'address', label: 'Adresse complète', type: 'text', defaultValue: '(Adresse à confirmer)' },
            {
              name: 'directionsUrl',
              label: 'Lien d’itinéraire (Google Maps)',
              type: 'text',
              admin: { description: 'Laisser vide tant que l’adresse n’est pas confirmée.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phone', label: 'Téléphone', type: 'text', defaultValue: 'Téléphone à confirmer' },
            { name: 'email', label: 'Courriel', type: 'text', defaultValue: 'Email à confirmer' },
            { name: 'donateUrl', label: 'Lien de don', type: 'text' },
          ],
        },
        {
          label: 'Réseaux sociaux',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'instagram', type: 'text' },
            { name: 'youtube', type: 'text' },
            { name: 'tiktok', type: 'text' },
            { name: 'whatsapp', type: 'text' },
          ],
        },
      ],
    },
  ],
}
