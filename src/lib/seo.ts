import type { Metadata } from 'next'

export const SITE_NAME = 'MKMI Québec'
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

type PageSeo = {
  /** Titre court de la page (le suffixe « — MKMI Québec » est ajouté automatiquement). */
  title: string
  description: string
  /** Chemin canonique, ex. « /eglise ». */
  path: string
  /** Sur-titre et accroche affichés sur l’image de partage générée. */
  eyebrow?: string
  ogTitle?: string
  /** Image de partage téléversée dans l’administration (sinon une image est générée). */
  image?: string | null
  keywords?: string[]
  noindex?: boolean
}

/** Image de partage générée aux couleurs de MKMI (1200 × 630). */
export function ogImageUrl(title: string, eyebrow = SITE_NAME) {
  return `/api/og?${new URLSearchParams({ title, eyebrow }).toString()}`
}

/**
 * Métadonnées complètes d’une page : titre, description, adresse canonique,
 * partage Facebook / WhatsApp (Open Graph) et X (Twitter).
 * Les objets openGraph/twitter remplacent ceux du gabarit : on les complète donc ici.
 */
export function pageMetadata({ title, description, path, eyebrow, ogTitle, image, keywords, noindex }: PageSeo): Metadata {
  const images = [{ url: image || ogImageUrl(ogTitle ?? title, eyebrow), width: 1200, height: 630, alt: title }]
  return {
    title,
    description,
    keywords: [...(keywords ?? []), 'MKMI Québec', 'église Québec', 'église chrétienne', 'Charlesbourg'],
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'fr_CA',
      siteName: SITE_NAME,
      url: path,
      title: `${title} — ${SITE_NAME}`,
      description,
      images,
    },
    twitter: { card: 'summary_large_image', title: `${title} — ${SITE_NAME}`, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Fil d’Ariane pour les moteurs de recherche (données structurées schema.org). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Accueil', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

/** Sérialise des données structurées sans risque d’injection HTML. */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })
