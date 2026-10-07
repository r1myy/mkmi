'use client'

import { useActionState, useMemo, useState, type ReactNode } from 'react'
import { CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight, Clock, Lock, Mail, MessageSquareText, Phone, User, Users } from 'lucide-react'

import { submitVisitPlan, type FormState } from '@/app/(frontend)/actions'
import { Field, Honeypot, inputClass, Result } from './forms'

export type VisitService = { name: string; badge?: string | null; weekday: number; time?: string | null; text?: string | null; image?: string | null }

const TZ = 'America/Toronto'
const DAYS_AHEAD = 42
const VISIBLE = 7
// Les dates sont calculées à midi UTC à partir du jour de Québec : pas de doublon au changement d’heure.
const part = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-CA', { timeZone: 'UTC', ...o }).format(d).replace('.', '')

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-extrabold text-white">{n}</span>
      <div>
        <h2 className="text-2xl font-extrabold text-navy-900">{title}</h2>
        <p className="text-sm text-muted">{text}</p>
      </div>
    </div>
  )
}

/** Choix du service et de la date, puis coordonnées du visiteur (maquette « Planifier ma visite »). */
export function VisitPlanner({ services, formTitle, practical, faq }: { services: VisitService[]; formTitle?: string | null; practical: ReactNode; faq: ReactNode }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitVisitPlan, { status: 'idle' })
  const dates = useMemo(() => {
    const start = new Date(`${new Date().toLocaleDateString('en-CA', { timeZone: TZ })}T12:00:00Z`).getTime()
    const out: { iso: string; weekday: number; day: string; num: string; month: string }[] = []
    for (let i = 0; i < DAYS_AHEAD && out.length < 21; i++) {
      const d = new Date(start + i * 86400000)
      const w = d.getUTCDay()
      if (services.some((s) => s.weekday === w))
        out.push({ iso: d.toISOString().slice(0, 10), weekday: w, day: part(d, { weekday: 'short' }), num: part(d, { day: '2-digit' }), month: part(d, { month: 'short' }) })
    }
    return out
  }, [services])
  const [date, setDate] = useState(dates[0]?.iso ?? '')
  const [service, setService] = useState(() => Math.max(0, services.findIndex((s) => s.weekday === dates[0]?.weekday)))
  const [offset, setOffset] = useState(0)
  const selected = dates.find((d) => d.iso === date)
  const current = services[service]

  const pickDate = (iso: string) => {
    setDate(iso)
    const w = dates.find((d) => d.iso === iso)?.weekday
    if (current?.weekday !== w) {
      const idx = services.findIndex((s) => s.weekday === w)
      if (idx >= 0) setService(idx)
    }
  }
  const pickService = (i: number) => {
    setService(i)
    if (selected?.weekday !== services[i].weekday) {
      const idx = dates.findIndex((d) => d.weekday === services[i].weekday)
      if (idx >= 0) {
        setDate(dates[idx].iso)
        setOffset(Math.max(0, Math.min(idx - 2, dates.length - VISIBLE)))
      }
    }
  }

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
      <input type="hidden" name="visitDate" value={date} />
      <input type="hidden" name="service" value={current ? `${current.name}${current.time ? ` (${current.time})` : ''}` : ''} />
      <div className="min-w-0 space-y-8">
        <Step n={1} title="Choisissez un service" text="Sélectionnez la date et le service qui vous conviennent." />
        {dates.length > 0 && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setOffset(Math.max(0, offset - VISIBLE))} disabled={offset === 0} aria-label="Dates précédentes" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-navy-900/15 disabled:opacity-40">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div role="radiogroup" aria-label="Date de la visite" className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-7">
              {dates.slice(offset, offset + VISIBLE).map((d) => {
                const on = d.iso === date
                return (
                  <button
                    key={d.iso}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => pickDate(d.iso)}
                    className={`rounded-xl px-2 py-2.5 text-center text-sm capitalize transition-colors ${on ? 'bg-navy-900 text-white shadow-lg' : 'bg-mist text-navy-900 hover:ring-2 hover:ring-gold-400'}`}
                  >
                    <span className="block text-xs">{d.day}</span>
                    <span className="block font-display text-xl font-extrabold">{d.num}</span>
                    <span className="block text-xs">{d.month}</span>
                  </button>
                )
              })}
            </div>
            <button type="button" onClick={() => setOffset(Math.min(Math.max(0, dates.length - VISIBLE), offset + VISIBLE))} disabled={offset + VISIBLE >= dates.length} aria-label="Dates suivantes" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-navy-900/15 disabled:opacity-40">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
        <div role="radiogroup" aria-label="Service" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => {
            const on = i === service
            return (
              <button
                key={`${s.name}-${i}`}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => pickService(i)}
                className={`overflow-hidden rounded-2xl bg-white text-left shadow-sm transition-all ${on ? 'ring-2 ring-gold-400' : 'ring-1 ring-navy-900/10 hover:ring-gold-400/60'}`}
              >
                <span className="relative block aspect-[16/9] bg-navy-900 bg-cover bg-center" style={s.image ? { backgroundImage: `url(${s.image})` } : undefined}>
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                  {s.badge && <span className="absolute bottom-3 left-3 rounded bg-navy-950/80 px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">{s.badge}</span>}
                </span>
                <span className="block p-4">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-bold text-navy-900">{s.name}</span>
                    {on ? <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-500" aria-hidden="true" /> : <span className="h-5 w-5 shrink-0 rounded-full ring-2 ring-navy-900/20" aria-hidden="true" />}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span className="capitalize">{['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][s.weekday]}</span> · {s.time}
                  </span>
                  {s.text && <span className="mt-2 block text-sm text-muted">{s.text}</span>}
                </span>
              </button>
            )
          })}
        </div>
        {practical}
      </div>

      <div className="space-y-8">
        <div className="rounded-3xl border border-navy-900/5 bg-white p-6 shadow-[0_30px_70px_-35px_rgba(11,22,40,.5)] sm:p-8">
          <Step n={2} title="Vos informations" text={formTitle ?? 'Remplissez ce formulaire pour confirmer votre visite.'} />
          {state.status === 'success' ? (
            <div className="mt-6">
              <Result state={state} />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <Field name="name" label="Nom complet" icon={User} required autoComplete="name" />
              <Field name="email" label="Adresse courriel" icon={Mail} type="email" required autoComplete="email" />
              <Field name="phone" label="Numéro de téléphone (optionnel)" icon={Phone} type="tel" autoComplete="tel" />
              <label className="relative block">
                <span className="sr-only">Nombre de personnes</span>
                <Users className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <select name="people" defaultValue="1" className={`${inputClass} pl-11`}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n === 8 ? '8 personnes ou plus' : `${n} personne${n > 1 ? 's' : ''}`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-start gap-3 text-sm text-muted">
                <input type="checkbox" name="withChildren" className="mt-0.5 h-4 w-4 accent-gold-500" />
                <span>Je viendrai avec des enfants.</span>
              </label>
              <label className="relative block">
                <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <MessageSquareText className="h-4 w-4 text-gold-500" aria-hidden="true" /> Des besoins particuliers ? (optionnel)
                </span>
                <textarea name="message" rows={3} maxLength={1000} placeholder="Ex. accès mobilité réduite, accueil pour enfants…" className={`${inputClass} resize-y pl-4`} />
              </label>
              <label className="flex items-start gap-3 text-sm text-muted">
                <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-gold-500" />
                <span>J’accepte que MKMI Québec utilise ces informations pour préparer mon accueil. *</span>
              </label>
              <Honeypot />
              <Result state={state} />
              <button
                type="submit"
                disabled={pending || !date}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-5 text-sm font-bold text-navy-900 shadow-[0_10px_30px_-12px_rgba(245,191,79,.9)] transition-colors hover:bg-gold-300 disabled:opacity-60"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                {pending ? 'Envoi en cours…' : 'Confirmer ma visite'}
              </button>
              <p className="flex items-start gap-2 text-xs text-muted">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Vos informations servent uniquement à préparer votre accueil. Elles ne sont jamais publiées ni partagées.
              </p>
            </div>
          )}
        </div>
        {faq}
      </div>
    </form>
  )
}
