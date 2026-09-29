import type { ReactNode } from 'react'

/**
 * Délimite une section modifiable. En mode édition, la survoler l’encadre
 * et le bouton « Modifier » ouvre cette section dans l’administration.
 */
export function EditZone({ page, section, children }: { page: string; section: string; children: ReactNode }) {
  return (
    <div data-edit-page={page} data-edit-section={section}>
      {children}
    </div>
  )
}
