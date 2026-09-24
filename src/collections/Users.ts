import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    group: 'Paramètres',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text' },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { update: isAdminField, create: isAdminField },
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur de contenu', value: 'editor' },
        { label: 'Équipe pastorale (prière, visites)', value: 'pastoral' },
      ],
      admin: {
        description:
          'Administrateur : tout. Éditeur : contenus publics. Équipe pastorale : demandes de prière et visites.',
      },
    },
  ],
}
