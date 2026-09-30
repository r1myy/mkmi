import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'editor' | 'pastoral'

const hasRole =
  (...roles: Role[]) =>
  ({ req: { user } }: { req: { user?: unknown } }) => {
    const role = (user as { role?: Role } | null | undefined)?.role
    return Boolean(role && roles.includes(role))
  }

export const anyone: Access = () => true
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
export const isAdmin: Access = hasRole('admin')
export const isEditor: Access = hasRole('admin', 'editor')
/** Données sensibles (demandes de prière, visites) : administrateurs et équipe pastorale uniquement. */
export const isPastoral: Access = hasRole('admin', 'pastoral')
export const isAdminField: FieldAccess = hasRole('admin')

/** Contenu public : publié pour tous, brouillons visibles par l'équipe connectée. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
