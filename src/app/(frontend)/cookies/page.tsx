import type { Metadata } from 'next'

import { LegalPage } from '@/components/pages/LegalPage'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Cookies',
  description: 'Le site de MKMI Québec n’utilise aucun cookie publicitaire ni de mesure d’audience.',
  path: '/cookies',
  eyebrow: 'Informations légales',
})

export default function Page() {
  return <LegalPage kind="cookies" />
}
