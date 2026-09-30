import { APIError, type CollectionConfig } from 'payload'
import { isAdmin, isAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    group: 'Paramètres',
    defaultColumns: ['name', 'email', 'role'],
    components: { views: { list: { Component: '@/components/admin/UsersList' } } },
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (user?.active === false) throw new APIError('Ce compte est suspendu. Contactez un administrateur.', 403)
        return user
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        // Date de dernière connexion (affichée dans l’écran Utilisateurs).
        await req.payload
          .update({ collection: 'users', id: user.id, data: { lastLoginAt: new Date().toISOString() }, overrideAccess: true, req })
          .catch(() => null)
      },
    ],
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
    { name: 'title', label: 'Fonction (ex. Responsable jeunesse)', type: 'text' },
    { name: 'phone', label: 'Téléphone', type: 'text' },
    {
      name: 'active',
      label: 'Compte actif',
      type: 'checkbox',
      defaultValue: true,
      access: { update: isAdminField, create: isAdminField },
      admin: { position: 'sidebar', description: 'Décocher pour suspendre l’accès sans supprimer le compte.' },
    },
    { name: 'lastLoginAt', label: 'Dernière connexion', type: 'date', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
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
