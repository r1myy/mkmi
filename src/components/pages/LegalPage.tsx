import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

import { Glow } from '@/components/pages/blocks'
import { EditZone } from '@/components/site/EditZone'
import { Eyebrow } from '@/components/site/ui'
import { getPage, getSettings } from '@/lib/content'

type Kind = 'privacy' | 'terms' | 'cookies'
const tabLabel: Record<Kind, string> = { privacy: 'Confidentialité', terms: 'Conditions', cookies: 'Cookies' }
const links: { kind: Kind; href: string; label: string }[] = [
  { kind: 'privacy', href: '/confidentialite', label: 'Politique de confidentialité' },
  { kind: 'terms', href: '/conditions', label: 'Conditions d’utilisation' },
  { kind: 'cookies', href: '/cookies', label: 'Cookies' },
]

/** Paragraphes séparés par une ligne vide ; les lignes « - » deviennent des puces. */
function Body({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        const bullets = lines.filter((l) => l.startsWith('- '))
        const prose = lines.filter((l) => !l.startsWith('- '))
        return (
          <div key={i} className="space-y-3">
            {prose.length > 0 && <p>{prose.join(' ')}</p>}
            {bullets.length > 0 && (
              <ul className="list-disc space-y-1 pl-6">
                {bullets.map((b) => (
                  <li key={b}>{b.slice(2)}</li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </>
  )
}

/** Pages légales (confidentialité, conditions, cookies), modifiables dans « Pages légales ». */
export async function LegalPage({ kind }: { kind: Kind }) {
  const [page, settings] = await Promise.all([getPage('page-legal'), getSettings()])
  const doc = page[kind]
  const officer = page.officer
  const email = officer?.email || (settings.email?.includes('@') ? settings.email : null)
  const updated = doc?.updated ? new Intl.DateTimeFormat('fr-CA', { dateStyle: 'long' }).format(new Date(doc.updated)) : null

  return (
    <>
      <section aria-labelledby="legal-title" className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-14 text-white">
        <Glow />
        <div className="container-site max-w-3xl">
          <Eyebrow light>Informations légales</Eyebrow>
          <h1 id="legal-title" className="text-4xl font-extrabold sm:text-5xl">
            {doc?.title}
          </h1>
          {updated && <p className="mt-3 text-sm text-white/70">Dernière mise à jour : {updated}</p>}
        </div>
      </section>
      <section className="py-14">
        <div className="container-site grid max-w-5xl gap-10 lg:grid-cols-[1fr_260px]">
          <EditZone page="page-legal" section={tabLabel[kind]}>
            <article className="space-y-8 leading-relaxed text-navy-900/85">
              {doc?.intro && <p className="text-lg">{doc.intro}</p>}
              {(doc?.sections ?? []).map((s) => (
                <section key={s.id ?? s.heading} className="space-y-3">
                  <h2 className="text-xl font-extrabold text-navy-900">{s.heading}</h2>
                  <Body text={s.body} />
                </section>
              ))}
            </article>
          </EditZone>
          <aside className="h-fit space-y-6">
            <EditZone page="page-legal" section="Responsable">
              <div className="rounded-2xl bg-mist p-5 text-sm">
                <p className="flex items-center gap-2 font-bold text-navy-900">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-gold-500" aria-hidden="true" /> {officer?.role}
                </p>
                <p className="mt-2 text-navy-900">{officer?.name}</p>
                {email && (
                  <a href={`mailto:${email}`} className="mt-2 inline-flex items-center gap-2 font-semibold text-navy-900 underline">
                    <Mail className="h-4 w-4" aria-hidden="true" /> {email}
                  </a>
                )}
                <p className="mt-2 text-muted">{settings.name}, {settings.address}, {settings.city} {settings.postalCode}</p>
              </div>
            </EditZone>
            <nav aria-label="Informations légales" className="rounded-2xl p-5 ring-1 ring-navy-900/10">
              <ul className="space-y-2 text-sm">
                {links.map((l) => (
                  <li key={l.kind}>
                    <Link href={l.href} aria-current={l.kind === kind ? 'page' : undefined} className={l.kind === kind ? 'font-bold text-navy-900' : 'text-muted hover:text-navy-900'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour à l’accueil
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
