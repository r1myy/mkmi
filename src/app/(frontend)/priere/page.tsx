import type { Metadata } from 'next'
import { ArrowRight, CalendarClock, HandHeart, Heart, Lock, Phone, PlayCircle, Radio, Users } from 'lucide-react'
import { siWhatsapp } from 'simple-icons'

import { CtaBand, FeatureStrip, Glow, Gold, PageHero, QuoteCard, SectionHead } from '@/components/pages/blocks'
import { PrayerForm } from '@/components/pages/forms'
import { Photo } from '@/components/site/Photo'
import { ButtonLink } from '@/components/site/ui'
import { asMedia, getPagesContent, getSettings, getTestimonials } from '@/lib/content'
import { JsonLd } from '@/components/site/JsonLd'
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Demande de prière',
  description:
    'Vous n’êtes pas seul. Envoyez votre demande de prière à l’équipe de MKMI Québec : nous prions pour vous, en toute confidentialité.',
  path: '/priere',
  eyebrow: 'Prière',
  ogTitle: 'Vous n’êtes pas seul. Nous prions avec vous.',
  keywords: ['demande de prière', 'prière Québec', 'soutien spirituel'],
})

const steps = [
  { title: 'Vous partagez', text: 'Remplissez le formulaire ou contactez notre équipe.' },
  { title: 'Nous recevons', text: 'Votre demande est transmise à notre équipe de prière.' },
  { title: 'Nous prions', text: 'Notre équipe et la communauté prient pour vous.' },
  { title: 'Dieu agit', text: 'Nous croyons que Dieu répond et nous restons disponibles pour vous accompagner.' },
]

export default async function PrierePage() {
  const [pages, settings, testimonials] = await Promise.all([getPagesContent(), getSettings(), getTestimonials(3)])
  const content = pages.priere!
  const phoneDigits = (settings.phone ?? '').replace(/\D/g, '').slice(-10)
  const hasPhone = phoneDigits.length === 10

  const others = [
    settings.whatsapp && {
      key: 'whatsapp',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d={siWhatsapp.path} />
        </svg>
      ),
      tone: 'bg-[#25D366]/15 text-[#128C7E]',
      title: 'Nous écrire sur WhatsApp',
      text: 'Réponse de notre équipe',
      href: settings.whatsapp,
    },
    hasPhone && {
      key: 'phone',
      icon: <Phone className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-blue-50 text-blue-600',
      title: 'Nous appeler',
      text: settings.phone,
      href: `tel:+1${phoneDigits}`,
    },
    {
      key: 'person',
      icon: <Users className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-gold-400/15 text-navy-900',
      title: 'Demander une prière en personne',
      text: 'Rencontrez notre équipe à l’église',
      href: '/planifier-ma-visite',
    },
    {
      key: 'events',
      icon: <CalendarClock className="h-6 w-6" aria-hidden="true" />,
      tone: 'bg-rose-50 text-rose-500',
      title: 'Participer à nos soirées de prière',
      text: 'Voir le calendrier',
      href: '/evenements',
    },
  ].filter((o): o is Exclude<typeof o, false | '' | null | undefined> => Boolean(o))

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Prière', path: '/priere' }])} />
      <PageHero
        id="priere-title"
        eyebrow="Prière"
        title={
          <>
            Vous n’êtes pas seul. <Gold>Nous prions avec vous.</Gold>
          </>
        }
        text="Peu importe ce que vous traversez, notre équipe et notre communauté sont là pour vous soutenir dans la prière. Dieu écoute et il agit aujourd’hui."
        image={asMedia(content.heroImage)}
        placeholder="Photo de prière à venir"
        actions={
          <>
            <ButtonLink href="#demande">
              Envoyer une demande de prière <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#fonctionnement" variant="outline-light">
              <PlayCircle className="h-5 w-5" aria-hidden="true" /> Comment ça fonctionne
            </ButtonLink>
          </>
        }
        aside={
          <QuoteCard
            text="Invoque-moi, et je te répondrai ; je te ferai connaître de grandes choses, des choses cachées que tu ne connais pas."
            source="Jérémie 33:3"
          />
        }
      />

      <FeatureStrip
        items={[
          { icon: HandHeart, title: 'Une équipe dédiée', text: 'Une équipe de prière est là pour vous accompagner.' },
          { icon: Users, title: 'Une communauté qui prie', text: 'Nous croyons en la puissance de la prière collective.' },
          { icon: Lock, title: 'Confidentialité et respect', text: 'Vos demandes sont traitées avec soin et discrétion.' },
          { icon: Heart, title: 'Un Dieu qui répond', text: 'Nous croyons que la prière donne des réponses.' },
        ]}
      />

      {/* Formulaire */}
      <section id="demande" aria-labelledby="demande-title" className="scroll-mt-20 py-20 lg:py-24">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_1.1fr_.9fr]">
          <div>
            <SectionHead
              id="demande-title"
              eyebrow="Demande de prière"
              title="Nous voulons prier avec vous."
              text="Remplissez le formulaire et notre équipe priera pour votre situation. Vous pouvez nous partager votre sujet de prière en toute confiance."
            />
            <div className="relative mt-8 overflow-hidden rounded-3xl">
              <Photo media={asMedia(content.sideImage)} placeholder="" className="aspect-[4/3.4] w-full" sizes="(min-width:1024px) 33vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
              <figure className="absolute inset-x-0 bottom-0 p-6 text-white">
                <blockquote className="text-lg font-semibold">
                  « Là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux. »
                </blockquote>
                <figcaption className="mt-2 text-sm text-white/70">— Matthieu 18:20</figcaption>
              </figure>
            </div>
          </div>

          <div className="rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
            <h2 className="mb-6 text-lg font-bold text-navy-900">Envoyez votre demande de prière</h2>
            <PrayerForm />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-mist p-6">
              <h2 className="font-display text-xl font-extrabold text-navy-900">Autres façons de prier avec nous</h2>
              <ul className="mt-5 divide-y divide-navy-900/10">
                {others.map((o) => (
                  <li key={o.key}>
                    <a
                      href={o.href!}
                      {...(o.href!.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${o.tone}`}>{o.icon}</span>
                      <span className="text-sm">
                        <span className="block font-semibold text-navy-900 group-hover:underline">{o.title}</span>
                        <span className="text-muted">{o.text}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {settings.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="relative isolate block overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-navy-900 p-6 text-white"
              >
                <Radio className="h-8 w-8 text-gold-400" aria-hidden="true" />
                <p className="mt-3 font-display text-xl font-extrabold">Rejoignez nos moments de prière en ligne</p>
                <p className="mt-1 text-sm text-white/75">Sur notre chaîne YouTube.</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy-900">
                  Voir la chaîne <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section id="fonctionnement" aria-labelledby="processus-title" className="scroll-mt-20 bg-mist py-20">
        <div className="container-site">
          <SectionHead id="processus-title" eyebrow="Notre processus" title="Comment ça fonctionne ?" />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl bg-white p-6 shadow-sm">
                {i < steps.length - 1 && (
                  <span aria-hidden="true" className="absolute top-11 -right-8 hidden h-0.5 w-8 bg-gold-400/60 lg:block" />
                )}
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 font-display text-lg font-extrabold text-navy-900">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Témoignages */}
      <section aria-labelledby="temoignages-title" className="relative isolate overflow-hidden bg-navy-950 py-20 text-white">
        <Glow />
        <div className="container-site grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionHead
              light
              id="temoignages-title"
              eyebrow="Témoignages"
              title="Des vies transformées par la prière."
              text="Découvrez comment Dieu répond encore aujourd’hui aux prières de son peuple."
            />
            <ButtonLink href="/temoignages#partager" className="mt-8">
              Partager votre témoignage <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          {testimonials.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.id} className="rounded-2xl bg-white p-5 text-navy-900">
                  <p className="font-display text-3xl leading-none text-gold-400" aria-hidden="true">
                    “
                  </p>
                  <p className="text-sm leading-relaxed">« {t.text} »</p>
                  <p className="mt-4 text-xs font-semibold text-muted">— {t.firstName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-white/60">
              Les premiers témoignages seront publiés ici, avec l’accord de leurs auteurs.
            </p>
          )}
        </div>
      </section>

      <CtaBand
        id="ensemble-title"
        eyebrow="Ne cessez de prier"
        title="Une communauté qui tient devant Dieu ensemble."
        text="Joignez-vous à nos temps de prière et expérimentez la puissance d’une foi unie."
        actions={
          <ButtonLink href="/evenements">
            Voir nos temps de prière <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        }
      />
    </>
  )
}
