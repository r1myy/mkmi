import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const audienceOptions = [
  { label: 'Abonnés à l’infolettre', value: 'newsletter' },
  { label: 'Inscrits à un événement', value: 'event' },
  { label: 'Personnes ayant écrit via le formulaire', value: 'contacts' },
] as const

/**
 * Courriels et infolettres préparés dans l’administration.
 * L’envoi réel sera branché sur un service d’envoi (Brevo ou équivalent) : en attendant,
 * les campagnes sont rédigées, relues et planifiées ici.
 */
export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  labels: { singular: 'Courriel', plural: 'Courriels' },
  admin: {
    useAsTitle: 'subject',
    group: 'Communication',
    defaultColumns: ['subject', 'audience', 'status', 'scheduledAt'],
    components: { views: { list: { Component: '@/components/admin/EmailsList' } } },
  },
  access: { read: isEditor, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: '-updatedAt',
  fields: [
    { name: 'subject', label: 'Objet', type: 'text', required: true, maxLength: 150 },
    { name: 'preheader', label: 'Texte d’aperçu (sous l’objet)', type: 'text', maxLength: 150 },
    { name: 'body', label: 'Contenu du courriel', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        { name: 'audience', label: 'Destinataires', type: 'select', options: [...audienceOptions], defaultValue: 'newsletter', required: true },
        {
          name: 'event',
          label: 'Événement',
          type: 'relationship',
          relationTo: 'events',
          admin: { condition: (data) => data?.audience === 'event' },
        },
      ],
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      enumName: 'enum_email_campaigns_status',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Planifié', value: 'scheduled' },
        { label: 'Envoyé', value: 'sent' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'scheduledAt', label: 'Date d’envoi prévue', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'sentAt', label: 'Envoyé le', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'recipients', label: 'Nombre de destinataires', type: 'number', admin: { position: 'sidebar', readOnly: true } },
  ],
}
