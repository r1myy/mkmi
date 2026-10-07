import type { Field, GlobalConfig, Tab } from 'payload'

import { anyone, isEditor } from '../access'
import { iconOptions } from '../components/site/iconOptions'

/**
 * Briques de l’éditeur de pages : chaque page du site est un « global » Payload,
 * chaque onglet est une section de la page (dans l’ordre d’affichage),
 * et chaque champ est un texte, un bouton ou une photo de cette section.
 */

const GOLD_HINT = 'Mettez entre *astérisques* les mots à afficher en or. Un retour à la ligne crée une nouvelle ligne.'

export const text = (name: string, label: string, defaultValue?: string, opts: { long?: boolean; description?: string } = {}): Field => {
  const base = {
    name,
    label,
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(opts.description ? { admin: { description: opts.description } } : {}),
  }
  return opts.long ? { ...base, type: 'textarea' } : { ...base, type: 'text' }
}

export const title = (defaultValue: string, name = 'title', label = 'Titre'): Field => ({
  name,
  label,
  type: 'textarea',
  defaultValue,
  admin: { description: GOLD_HINT, rows: 2 },
})

export const image = (name: string, label: string): Field => ({ name, label, type: 'upload', relationTo: 'media' })

export const button = (name: string, label: string, defaultValue: string): Field => ({
  name,
  label,
  type: 'text',
  defaultValue,
  admin: { description: 'Texte du bouton.' },
})

export const quote = (textDefault: string, sourceDefault: string): Field[] => [
  { name: 'quoteText', label: 'Citation', type: 'textarea', defaultValue: textDefault, admin: { rows: 3 } },
  { name: 'quoteSource', label: 'Référence de la citation', type: 'text', defaultValue: sourceDefault },
]

export const iconSelect: Field = { name: 'icon', label: 'Icône', type: 'select', options: iconOptions, defaultValue: 'heart', required: true }

type Item = { icon?: string; title: string; text?: string }

export const items = (name: string, label: string, defaultValue: Item[], opts: { withIcon?: boolean; withText?: boolean; maxRows?: number } = {}): Field => ({
  name,
  label,
  type: 'array',
  maxRows: opts.maxRows,
  defaultValue,
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        ...(opts.withIcon === false ? [] : [iconSelect]),
        { name: 'title', label: 'Titre', type: 'text', required: true },
      ],
    },
    ...(opts.withText === false ? [] : [{ name: 'text', label: 'Texte', type: 'textarea', admin: { rows: 2 } } as Field]),
  ],
})

/** Section standard : sur-titre, titre, texte et, au besoin, photo et bouton. */
export const section = (
  name: string,
  label: string,
  d: { eyebrow?: string; title?: string; text?: string; image?: string; button?: string },
  extra: Field[] = [],
): Tab => ({
  name,
  label,
  fields: [
    ...(d.eyebrow !== undefined ? [text('eyebrow', 'Sur-titre', d.eyebrow)] : []),
    ...(d.title !== undefined ? [title(d.title)] : []),
    ...(d.text !== undefined ? [text('text', 'Texte', d.text, { long: true })] : []),
    ...(d.button !== undefined ? [button('button', 'Bouton', d.button)] : []),
    ...(d.image !== undefined ? [image('image', d.image)] : []),
    ...extra,
  ],
})

/** Haut de page commun à toutes les pages intérieures. */
export const hero = (d: {
  eyebrow: string
  title: string
  text: string
  primary: string
  secondary: string
  quote?: [string, string]
}): Tab =>
  section('hero', 'Haut de page', { eyebrow: d.eyebrow, title: d.title, text: d.text }, [
    { type: 'row', fields: [button('primary', 'Bouton principal', d.primary), button('secondary', 'Bouton secondaire', d.secondary)] },
    image('image', 'Photo de fond'),
    ...(d.quote ? quote(d.quote[0], d.quote[1]) : []),
  ])

export const features = (defaultValue: Item[]): Tab => ({
  name: 'features',
  label: 'Atouts',
  description: 'Les quatre atouts affichés dans le bandeau blanc sous le haut de page.',
  fields: [items('items', 'Atouts', defaultValue, { maxRows: 4 })],
})

export const cta = (d: { eyebrow: string; title: string; text: string; primary: string; secondary?: string }): Tab =>
  section('cta', 'Appel final', { eyebrow: d.eyebrow, title: d.title, text: d.text }, [
    {
      type: 'row',
      fields: [button('primary', 'Bouton principal', d.primary), ...(d.secondary ? [button('secondary', 'Bouton secondaire', d.secondary)] : [])],
    },
    image('image', 'Photo de fond'),
  ])

/**
 * Crée la fiche d’une page : un onglet par section, brouillons enregistrés
 * automatiquement et aperçu en direct du site à côté des champs.
 */
export function pageGlobal(slug: string, label: string, path: string, tabs: Tab[]): GlobalConfig {
  return {
    slug,
    label,
    admin: {
      group: 'Pages du site',
      description: `Chaque onglet correspond à une section de la page, dans l’ordre d’affichage. L’aperçu à droite se met à jour pendant que vous écrivez ; cliquez sur « Publier les modifications » pour mettre en ligne.`,
      livePreview: { openByDefault: true, url: () => `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/preview?path=${encodeURIComponent(path)}` },
      preview: () => `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/preview?path=${encodeURIComponent(path)}`,
    },
    access: { read: anyone, update: isEditor },
    versions: { drafts: { autosave: { interval: 700 } }, max: 20 },
    fields: [
      {
        name: 'sectionFocus',
        type: 'ui',
        admin: { components: { Field: '@/components/admin/SectionFocus#SectionFocus' } },
      },
      { type: 'tabs', tabs },
    ],
  }
}
