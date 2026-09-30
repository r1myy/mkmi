import type { Metadata } from 'next'

import { LegalPage } from '@/components/pages/LegalPage'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Conditions d’utilisation',
  description: 'Conditions d’utilisation du site de MKMI Québec.',
  path: '/conditions',
  eyebrow: 'Informations légales',
})

export default function Page() {
  return <LegalPage kind="terms" />
}
