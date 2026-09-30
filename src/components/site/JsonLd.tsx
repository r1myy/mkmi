import { jsonLd } from '@/lib/seo'

/** Données structurées schema.org (lues par Google, invisibles pour les visiteurs). */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
}
