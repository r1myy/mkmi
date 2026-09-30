import type { Metadata } from 'next'

import { LegalPage } from '@/components/pages/LegalPage'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Politique de confidentialité',
  description: 'Comment MKMI Québec recueille, utilise et protège vos renseignements personnels (Loi 25), et comment exercer vos droits.',
  path: '/confidentialite',
  eyebrow: 'Informations légales',
})

export default function Page() {
  return <LegalPage kind="privacy" />
}
