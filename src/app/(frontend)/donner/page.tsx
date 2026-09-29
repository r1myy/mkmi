import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  Building2,
  Church,
  Copy,
  Globe2,
  HandCoins,
  HandHeart,
  Heart,
  Mail,
  MonitorSmartphone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Sprout,
  Users,
} from 'lucide-react'

import { CtaBand, Faq, FeatureStrip, Glow, Gold, PageHero, QuoteCard, SectionHead } from '@/components/pages/blocks'
import { JsonLd } from '@/components/site/JsonLd'
import { Photo } from '@/components/site/Photo'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getPagesContent, getSettings } from '@/lib/content'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Donner',
  description:
    'Soutenez la mission de MKMI Québec : vos dons font vivre l’église locale, les missions et l’entraide auprès des familles. Découvrez comment donner.',
  path: '/donner',
  eyebrow: 'Donner',
  ogTitle: 'Donner avec joie.',
  keywords: ['don église Québec', 'offrande', 'dîme', 'soutenir MKMI Québec'],
})

const uses = [
  { icon: Church, title: 'La vie de l’église', text: 'Les cultes, l’accueil, les locaux et tout ce qui rend nos rencontres possibles.' },
  { icon: Globe2, title: 'Les missions', text: 'Les initiatives soutenues ici et ailleurs pour partager l’Évangile.' },
  { icon: HandHeart, title: 'L’entraide', text: 'Un soutien concret aux personnes et aux familles dans le besoin.' },
  { icon: Sprout, title: 'Jeunesse et familles', text: 'Des activités pour faire grandir la prochaine génération dans la foi.' },
]

function Way({ icon: Icon, title, children, action }: { icon: typeof Heart; title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <li className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-[0_14px_40px_-24px_rgba(11,22,40,.45)] ring-1 ring-navy-900/5">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-navy-900">{title}</h3>
      <div className="mt-2 flex-1 text-sm leading-relaxed text-muted">{children}</div>
      {action && <div className="mt-5">{action}</div>}
    </li>
  )
}

export default async function DonnerPage() {
  const [pages, settings] = await Promise.all([getPagesContent(), getSettings()])
  const don = pages.don ?? {}
  const donateUrl = settings.donateUrl?.startsWith('http') ? settings.donateUrl : null

  const faq = [
    {
      question: 'Est-ce que je peux donner de façon régulière ?',
      answer: donateUrl
        ? 'Oui. Selon la plateforme de don, vous pouvez choisir un don unique ou un don mensuel.'
        : 'Le don en ligne sera bientôt disponible. En attendant, vous pouvez donner pendant le culte ou nous écrire pour connaître les autres options.',
    },
    {
      question: 'Est-ce que je recevrai un reçu fiscal ?',
      answer: don.taxReceipts
        ? `Oui. Des reçus officiels aux fins de l’impôt sont délivrés${don.charityNumber ? ` (numéro d’organisme de bienfaisance : ${don.charityNumber})` : ''}. Pensez à indiquer votre nom et votre adresse.`
        : 'Pour toute question sur les reçus, écrivez-nous : nous vous répondrons avec plaisir.',
    },
    {
      question: 'À quoi servent les dons ?',
      answer: 'Ils soutiennent la vie de l’église locale, les missions, l’entraide et les activités pour les jeunes et les familles.',
    },
    {
      question: 'Puis-je donner pour un projet précis ?',
      answer: 'Oui. Précisez-le dans votre message ou écrivez-nous : nous vous indiquerons comment faire.',
    },
  ]

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Donner', path: '/donner' }])} />
      <PageHero
        id="donner-title"
        eyebrow="Donner"
        title={
          <>
            Donner <Gold>avec joie.</Gold>
          </>
        }
        text="Chaque don, petit ou grand, permet à MKMI Québec d’accueillir, d’enseigner, d’aider les familles et de porter l’Évangile plus loin. Merci de faire partie de cette mission."
        image={asMedia(don.heroImage)}
        placeholder="Photo à venir"
        actions={
          <>
            <ButtonLink href={donateUrl ?? '#facons'} {...(donateUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <Heart className="h-4 w-4" aria-hidden="true" /> {donateUrl ? 'Faire un don en ligne' : 'Comment donner'}
            </ButtonLink>
            <ButtonLink href="#impact" variant="outline-light">
              À quoi sert votre don <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </>
        }
        aside={
          <QuoteCard
            text="Que chacun donne comme il l’a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie."
            source="2 Corinthiens 9:7"
          />
        }
      />

      <FeatureStrip
        items={[
          { icon: Church, title: 'L’église locale', text: 'Faire vivre nos cultes et notre accueil à Québec.' },
          { icon: Globe2, title: 'La mission', text: 'Porter l’Évangile ici et dans le monde.' },
          { icon: Users, title: 'Les familles', text: 'Soutenir concrètement celles et ceux qui en ont besoin.' },
          { icon: ShieldCheck, title: 'La confiance', text: 'Des dons gérés avec intégrité et transparence.' },
        ]}
      />

      {/* Façons de donner */}
      <section id="facons" aria-labelledby="facons-title" className="scroll-mt-20 py-20 lg:py-24">
        <div className="container-site">
          <SectionHead
            id="facons-title"
            eyebrow="Façons de donner"
            title="Choisissez la façon qui vous convient."
            text="Simple, rapide et sécurisé : donnez là où vous êtes."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Way
              icon={MonitorSmartphone}
              title="En ligne"
              action={
                donateUrl ? (
                  <ButtonLink href={donateUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    Donner en ligne <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ButtonLink>
                ) : (
                  <span className="inline-flex rounded-lg border border-dashed border-navy-900/20 px-3 py-2 text-xs font-semibold text-muted">
                    Bientôt disponible
                  </span>
                )
              }
            >
              Par carte, en quelques clics, depuis votre téléphone ou votre ordinateur.
            </Way>
            {don.interacEmail && (
              <Way icon={Smartphone} title="Virement Interac">
                Depuis votre institution financière, envoyez votre don à :
                <span className="mt-2 flex items-center gap-2 rounded-lg bg-mist px-3 py-2 font-semibold break-all text-navy-900">
                  <Copy className="h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" /> {don.interacEmail}
                </span>
                {don.interacNote && <span className="mt-2 block">{don.interacNote}</span>}
              </Way>
            )}
            <Way icon={HandCoins} title="Sur place">
              {don.inPersonNote}
            </Way>
            {don.mailingAddress && (
              <Way icon={Mail} title="Par chèque">
                <span className="whitespace-pre-line">{don.mailingAddress}</span>
              </Way>
            )}
            {!don.interacEmail && !don.mailingAddress && (
              <Way icon={Building2} title="Autres options" action={<ButtonLink href="/contact" variant="outline-dark">Nous écrire</ButtonLink>}>
                Pour un don par virement, par chèque ou pour un projet précis, contactez-nous.
              </Way>
            )}
          </ul>
        </div>
      </section>

      {/* À quoi sert votre don */}
      <section id="impact" aria-labelledby="impact-title" className="relative isolate scroll-mt-20 overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 -z-20">
          <Photo media={asMedia(don.impactImage)} alt="" placeholder="" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/70" />
        </div>
        <Glow />
        <div className="container-site">
          <SectionHead
            light
            id="impact-title"
            eyebrow="Votre don fait la différence"
            title="À quoi sert votre générosité."
            text="Vos dons sont investis là où ils portent du fruit, pour notre ville et au-delà."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {uses.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <span aria-hidden="true" className="absolute top-4 right-5 font-display text-5xl font-extrabold text-white/5">
                  0{i + 1}
                </span>
                <Icon className="h-8 w-8 text-gold-400" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-white/70">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reçus et confiance */}
      <section aria-labelledby="confiance-title" className="py-20 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <SectionHead
              id="confiance-title"
              eyebrow="Questions fréquentes"
              title="Donner en toute confiance."
              text="Vos dons sont reçus avec reconnaissance et gérés avec intégrité."
            />
            {don.taxReceipts && (
              <p className="mt-8 flex items-start gap-3 rounded-2xl bg-mist p-5 text-sm text-navy-900">
                <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" aria-hidden="true" />
                <span>
                  Reçus officiels aux fins de l’impôt délivrés.
                  {don.charityNumber && <span className="block text-muted">Numéro d’organisme de bienfaisance : {don.charityNumber}</span>}
                </span>
              </p>
            )}
          </div>
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand
        id="merci-title"
        eyebrow="Merci"
        title="Ensemble, nous allons plus loin."
        text="Votre générosité rend possible chaque rencontre, chaque projet et chaque vie touchée."
        actions={
          <>
            {donateUrl ? (
              <ButtonLink href={donateUrl} target="_blank" rel="noopener noreferrer">
                <Heart className="h-4 w-4" aria-hidden="true" /> Faire un don
              </ButtonLink>
            ) : (
              <ButtonLink href="#facons">
                <Heart className="h-4 w-4" aria-hidden="true" /> Comment donner
              </ButtonLink>
            )}
            <ButtonLink href="/contact" variant="outline-light">
              Nous contacter <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
