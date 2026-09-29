import React from 'react'

import './stats.scss'

const pages = [
  { label: 'Accueil', path: '/', slug: 'home-page' },
  { label: 'Église', path: '/eglise', slug: 'page-eglise' },
  { label: 'Découvrir', path: '/decouvrir', slug: 'page-decouvrir' },
  { label: 'Ministères', path: '/ministeres', slug: 'page-ministeres' },
  { label: 'Messages', path: '/messages', slug: 'page-messages' },
  { label: 'Événements', path: '/evenements', slug: 'page-evenements' },
  { label: 'Missions', path: '/missions', slug: 'page-missions' },
  { label: 'Prière', path: '/priere', slug: 'page-priere' },
  { label: 'Donner', path: '/donner', slug: 'page-don' },
  { label: 'Nous contacter', path: '/contact', slug: 'page-contact' },
]

/** Raccourcis de l’éditeur visuel, en haut du tableau de bord. */
export default function EditorShortcuts() {
  return (
    <section className="mkmi-editor" aria-labelledby="mkmi-editor-title">
      <div className="mkmi-editor__intro">
        <h2 id="mkmi-editor-title">Modifier le site</h2>
        <p>
          Ouvrez le site en mode édition : survolez une section, cliquez sur « Modifier », puis changez textes et photos avec
          l’aperçu en direct. Rien n’est visible du public avant « Publier les modifications ».
        </p>
        {/* Route API (active le mode édition) : un lien classique est nécessaire, pas <Link>. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="mkmi-editor__cta" href="/api/preview?path=/">
          Ouvrir le site en mode édition
        </a>
      </div>
      <ul className="mkmi-editor__pages">
        {pages.map((p) => (
          <li key={p.slug}>
            <a href={`/admin/globals/${p.slug}`}>{p.label}</a>
            <a href={`/api/preview?path=${encodeURIComponent(p.path)}`} aria-label={`Voir ${p.label} en mode édition`} title="Voir en mode édition">
              ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
