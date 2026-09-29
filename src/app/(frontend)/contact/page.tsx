import type { Metadata } from 'next'
import { ArrowRight, Clock, Headset, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'

import { CtaBand, Faq, Glow, Gold, PageHero, SectionHead } from '@/components/pages/blocks'
import { ContactForm } from '@/components/pages/forms'
import { Photo } from '@/components/site/Photo'
import { SocialIcons } from '@/components/site/SocialIcons'
import { ButtonLink, Eyebrow } from '@/components/site/ui'
import { asMedia, getPagesContent, getSettings } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Nous contacter',
  description: 'Une question, un besoin de prière ou envie de nous visiter ? Écrivez-nous ou venez nous rencontrer.',
}

export default async function ContactPage() {
  const [pages, settings] = await Promise.all([getPagesContent(), getSettings()])
  const content = pages.contact!
  const phoneDigits = (settings.phone ?? '').replace(/\D/g, '').slice(-10)
  const hasPhone = phoneDigits.length === 10
  const hasEmail = settings.email?.includes('@')
  const hasSocial = ['facebook', 'instagram', 'youtube', 'tiktok', 'whatsapp'].some((k) => settings[k as keyof typeof settings])

  const cards = [
    {
      icon: MapPin,
      title: 'Notre adresse',
      lines: [settings.address, `${settings.city} ${settings.postalCode}`],
      href: settings.directionsUrl,
      external: true,
    },
    { icon: Phone, title: 'Téléphone', lines: [settings.phone], href: hasPhone ? `tel:+1${phoneDigits}` : null },
    { icon: Mail, title: 'Courriel', lines: [settings.email], href: hasEmail ? `mailto:${settings.email}` : null },
    {
      icon: Clock,
      title: 'Heures',
      lines: [content.officeHours, `Culte : ${settings.serviceDay}, ${settings.serviceTime}`],
      href: null,
    },
  ]

  return (
    <>
      <PageHero
        id="contact-title"
        eyebrow="Nous contacter"
        title={
          <>
            Nous serions heureux <br />
            de <Gold>vous rencontrer.</Gold>
          </>
        }
        text="Que vous ayez une question, un besoin de prière ou désiriez en savoir plus sur notre église, notre équipe est là pour vous."
        image={asMedia(content.heroImage)}
        placeholder="Photo d’accueil à venir"
        actions={
          <>
            <ButtonLink href="#ecrire">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Nous écrire
            </ButtonLink>
            <ButtonLink href="/planifier-ma-visite" variant="outline-light">
              Planifier ma visite <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </>
        }
      />

      {/* Coordonnées */}
      <div className="container-site relative z-10 -mt-12">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, lines, href, external }) => {
            const body = (
              <>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 text-sm">
                  <span className="block font-bold text-navy-900">{title}</span>
                  {lines.filter(Boolean).map((l) => (
                    <span key={l} className="block break-words text-muted">
                      {l}
                    </span>
                  ))}
                </span>
                {href && <ArrowRight className="ml-auto h-4 w-4 shrink-0 self-center text-gold-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
              </>
            )
            const className =
              'group flex h-full gap-4 rounded-2xl bg-white p-5 shadow-[0_24px_60px_-30px_rgba(11,22,40,.5)] ring-1 ring-navy-900/5'
            return (
              <li key={title}>
                {href ? (
                  <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {body}
                  </a>
                ) : (
                  <div className={className}>{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Carte, visite et formulaire */}
      <section className="py-16 lg:py-20">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="relative isolate overflow-hidden rounded-3xl bg-navy-900 p-8 text-white">
              <Glow />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,rgba(59,130,246,.35),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(245,191,79,.25),transparent_45%)]"
              />
              <span className="relative flex h-14 w-14 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/40 motion-reduce:hidden" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-navy-900">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </span>
              </span>
              <p className="mt-6 font-display text-2xl font-extrabold">{settings.name}</p>
              <p className="mt-1 text-white/75">
                {settings.address}
                <br />
                {settings.city} {settings.postalCode}
              </p>
              {settings.directionsUrl && (
                <a
                  href={settings.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-300"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" /> Obtenir l’itinéraire
                </a>
              )}
            </div>

            <div className="relative isolate overflow-hidden rounded-3xl text-white">
              <div className="absolute inset-0 -z-10">
                <Photo media={asMedia(content.visitImage)} alt="" placeholder="" className="h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />
              </div>
              <div className="p-8 pt-32">
                <Eyebrow light>Visitez-nous</Eyebrow>
                <h2 className="text-3xl font-extrabold">Nous avons hâte de vous accueillir.</h2>
                <p className="mt-3 text-white/80">
                  Venez vivre un temps de louange, de prière et d’enseignement dans une atmosphère chaleureuse et familiale.
                </p>
                <ButtonLink href="/planifier-ma-visite" className="mt-6">
                  Planifier ma première visite <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div id="ecrire" className="scroll-mt-24 rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
              <SectionHead
                eyebrow="Écrivez-nous"
                title="Une question ? Un besoin de prière ?"
                text="Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais."
                className="mb-6"
              />
              <ContactForm />
            </div>

            <div>
              <Eyebrow>Autres moyens de nous joindre</Eyebrow>
              <h2 className="text-2xl font-extrabold text-navy-900">Restons en contact.</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {settings.whatsapp && (
                  <li className="rounded-2xl bg-mist p-5 text-sm">
                    <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="font-bold text-navy-900 hover:underline">
                      WhatsApp
                    </a>
                    <p className="text-muted">Écrivez-nous directement.</p>
                  </li>
                )}
                {hasSocial && (
                  <li className="rounded-2xl bg-navy-900 p-5 text-sm text-white">
                    <p className="font-bold">Réseaux sociaux</p>
                    <p className="mb-3 text-white/70">Suivez nos activités.</p>
                    <SocialIcons settings={settings} />
                  </li>
                )}
                <li className="rounded-2xl bg-mist p-5 text-sm">
                  <p className="flex items-center gap-2 font-bold text-navy-900">
                    <Mail className="h-4 w-4 text-gold-500" aria-hidden="true" /> Courrier postal
                  </p>
                  <p className="mt-1 text-muted">
                    {settings.name}
                    <br />
                    {settings.address}, {settings.city} {settings.postalCode}
                  </p>
                </li>
                <li className="rounded-2xl bg-mist p-5 text-sm">
                  <p className="flex items-center gap-2 font-bold text-navy-900">
                    <Headset className="h-4 w-4 text-gold-500" aria-hidden="true" /> Besoin d’aide ?
                  </p>
                  <p className="mt-1 text-muted">Notre équipe est disponible pour répondre à vos questions.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-mist py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <SectionHead
            id="faq-title"
            eyebrow="Questions fréquentes"
            title="Vous avez une question ?"
            text="Voici les réponses aux questions les plus courantes. Si vous ne trouvez pas l’information recherchée, n’hésitez pas à nous écrire."
          />
          <Faq items={pages.eglise?.faq ?? []} />
        </div>
      </section>

      <CtaBand
        id="proche-title"
        eyebrow="Une église proche de vous"
        title="Vous n’êtes pas seul."
        text="Nous sommes là pour vous écouter, vous accompagner et marcher avec vous."
        actions={
          <>
            <ButtonLink href="/priere#demande">
              Demander une prière <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#ecrire" variant="outline-light">
              Nous écrire <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </>
        }
      />
    </>
  )
}
