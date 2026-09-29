import type { Field } from 'payload'

export const folderOptions = [
  { label: 'Ministères', value: 'ministeres' },
  { label: 'Missions', value: 'missions' },
  { label: 'Événements', value: 'evenements' },
  { label: 'Communications', value: 'communications' },
  { label: 'Formations', value: 'formations' },
  { label: 'Administration', value: 'administration' },
  { label: 'Modèles', value: 'modeles' },
  { label: 'Site web', value: 'site' },
  { label: 'Autres', value: 'autres' },
] as const

/** Dossier de classement (médias, documents, liens utiles). */
export const folderField: Field = {
  name: 'folder',
  label: 'Dossier',
  type: 'select',
  options: [...folderOptions],
  defaultValue: 'site',
  admin: { position: 'sidebar' },
}
