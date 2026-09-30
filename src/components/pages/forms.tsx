'use client'

import { useActionState, useState, type ComponentType, type ReactNode } from 'react'
import { CalendarDays, CheckCircle2, Lock, Mail, Phone, Send, User } from 'lucide-react'

import { registerForEvent, submitContactMessage, submitPrayerRequest, submitTestimonial, submitVisitPlan, type FormState } from '@/app/(frontend)/actions'

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>

const inputClass =
  'w-full rounded-xl border border-navy-900/15 bg-white py-3 pr-4 text-sm text-navy-900 placeholder:text-muted/70 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 focus:outline-none'

function Field({
  name,
  label,
  icon: Icon,
  type = 'text',
  required,
  autoComplete,
}: {
  name: string
  label: string
  icon?: Icon
  type?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <label className="relative block">
      <span className="sr-only">
        {label}
        {required ? ' (obligatoire)' : ''}
      </span>
      {Icon && <Icon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={`${label}${required ? ' *' : ''}`}
        className={`${inputClass} ${Icon ? 'pl-11' : 'pl-4'}`}
      />
    </label>
  )
}

function Subject({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-900">{label} *</span>
      <select name="subject" required defaultValue="" className={`${inputClass} pl-4`}>
        <option value="" disabled>
          Sélectionnez un sujet
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

function Message({ name, label, max }: { name: string; label: string; max: number }) {
  const [count, setCount] = useState(0)
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-900">{label} *</span>
      <textarea
        name={name}
        required
        rows={5}
        maxLength={max}
        onChange={(e) => setCount(e.target.value.length)}
        className={`${inputClass} resize-y pl-4`}
      />
      <span className="mt-1 block text-right text-xs text-muted" aria-live="polite">
        {count} / {max}
      </span>
    </label>
  )
}

function Check({ name, children }: { name: string; children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-sm text-muted">
      <input type="checkbox" name={name} className="mt-0.5 h-4 w-4 accent-gold-500" />
      <span>{children}</span>
    </label>
  )
}

function Result({ state }: { state: FormState }) {
  if (state.status === 'idle') return null
  return (
    <p
      role={state.status === 'error' ? 'alert' : 'status'}
      className={
        state.status === 'error'
          ? 'rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700'
          : 'flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800'
      }
    >
      {state.status === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />}
      {state.message}
    </p>
  )
}

function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
}

function Submit({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-5 text-sm font-bold text-navy-900 shadow-[0_10px_30px_-12px_rgba(245,191,79,.9)] transition-colors hover:bg-gold-300 disabled:opacity-60"
    >
      <Send className="h-4 w-4" aria-hidden="true" />
      {pending ? 'Envoi en cours…' : children}
    </button>
  )
}

export function PrayerForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitPrayerRequest, { status: 'idle' })
  if (state.status === 'success') return <Result state={state} />
  return (
    <form action={action} className="space-y-4">
      <Field name="name" label="Nom complet" icon={User} required autoComplete="name" />
      <Field name="email" label="Adresse courriel" icon={Mail} type="email" required autoComplete="email" />
      <Field name="phone" label="Téléphone (optionnel)" icon={Phone} type="tel" autoComplete="tel" />
      <Subject
        label="Sujet de votre prière"
        options={['Santé', 'Famille', 'Travail et finances', 'Vie spirituelle', 'Remerciement', 'Autre']}
      />
      <Message name="request" label="Votre demande de prière" max={1000} />
      <Check name="wantsReply">Je souhaite qu’un membre de l’équipe me contacte.</Check>
      <Check name="confidential">Garder ma demande confidentielle (équipe pastorale uniquement).</Check>
      <Honeypot />
      <Result state={state} />
      <Submit pending={pending}>Envoyer ma demande de prière</Submit>
      <p className="flex items-start gap-2 text-xs text-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Vos informations sont protégées et utilisées uniquement pour le suivi pastoral. Elles ne sont jamais publiées.
      </p>
    </form>
  )
}

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitContactMessage, { status: 'idle' })
  if (state.status === 'success') return <Result state={state} />
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Nom complet" icon={User} required autoComplete="name" />
        <Field name="email" label="Adresse courriel" icon={Mail} type="email" required autoComplete="email" />
        <Field name="phone" label="Téléphone (optionnel)" icon={Phone} type="tel" autoComplete="tel" />
        <label className="block">
          <span className="sr-only">Sujet de votre message (obligatoire)</span>
          <select name="subject" required defaultValue="" className={`${inputClass} pl-4`}>
            <option value="" disabled>
              Sujet de votre message *
            </option>
            {['Question générale', 'Première visite', 'Besoin de prière', 'Parler à un pasteur', 'M’impliquer', 'Autre'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      <Message name="message" label="Votre message" max={500} />
      <Check name="newsletter">J’aimerais recevoir les nouvelles de MKMI Québec.</Check>
      <Honeypot />
      <Result state={state} />
      <Submit pending={pending}>Envoyer le message</Submit>
    </form>
  )
}

export function EventRegistrationForm({ eventId }: { eventId: number }) {
  const [state, action, pending] = useActionState<FormState, FormData>(registerForEvent, { status: 'idle' })
  if (state.status === 'success') return <Result state={state} />
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="event" value={eventId} />
      <Field name="name" label="Nom complet" icon={User} required autoComplete="name" />
      <Field name="email" label="Adresse courriel" icon={Mail} type="email" required autoComplete="email" />
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-navy-900">Nombre de places</span>
        <select name="seats" defaultValue="1" className={`${inputClass} pl-4`}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-gold-500" />
        <span>J’accepte que MKMI Québec utilise ces informations pour gérer mon inscription.</span>
      </label>
      <Honeypot />
      <Result state={state} />
      <Submit pending={pending}>Confirmer mon inscription</Submit>
    </form>
  )
}

export function VisitForm({ serviceDay }: { serviceDay?: string | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitVisitPlan, { status: 'idle' })
  const [today] = useState(() => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' }))
  if (state.status === 'success') return <Result state={state} />
  return (
    <form action={action} className="space-y-4">
      <Field name="name" label="Nom complet" icon={User} required autoComplete="name" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="email" label="Adresse courriel" icon={Mail} type="email" required autoComplete="email" />
        <Field name="phone" label="Téléphone (optionnel)" icon={Phone} type="tel" autoComplete="tel" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-navy-900">
            <CalendarDays className="h-4 w-4 text-gold-500" aria-hidden="true" /> Date de votre visite
          </span>
          <input type="date" name="visitDate" min={today} className={`${inputClass} pl-4`} />
          {serviceDay && <span className="mt-1 block text-xs text-muted">Culte le {serviceDay.toLowerCase()}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-navy-900">Nombre de personnes</span>
          <select name="people" defaultValue="1" className={`${inputClass} pl-4`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n === 8 ? '8 ou plus' : n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Check name="withChildren">Je viendrai avec des enfants.</Check>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-navy-900">Questions ou besoins particuliers (optionnel)</span>
        <textarea name="message" rows={3} maxLength={1000} className={`${inputClass} resize-y pl-4`} />
      </label>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-gold-500" />
        <span>J’accepte que MKMI Québec utilise ces informations pour préparer mon accueil. *</span>
      </label>
      <Honeypot />
      <Result state={state} />
      <Submit pending={pending}>Planifier ma visite</Submit>
      <p className="flex items-start gap-2 text-xs text-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Vos informations servent uniquement à préparer votre accueil. Elles ne sont jamais publiées ni partagées.
      </p>
    </form>
  )
}

export function TestimonyForm({ categories }: { categories: readonly { label: string; value: string }[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitTestimonial, { status: 'idle' })
  if (state.status === 'success') return <Result state={state} />
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="firstName" label="Votre nom (tel qu’affiché)" icon={User} required autoComplete="name" />
        <Field name="email" label="Adresse courriel" icon={Mail} type="email" required autoComplete="email" />
      </div>
      <Field name="title" label="Titre de votre témoignage" required />
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-navy-900">Catégorie</span>
        <select name="category" defaultValue="autre" className={`${inputClass} pl-4`}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <Message name="text" label="Votre témoignage" max={4000} />
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-gold-500" />
        <span>J’accepte que MKMI Québec publie mon témoignage sur son site après relecture, avec le nom indiqué ci-dessus. *</span>
      </label>
      <Honeypot />
      <Result state={state} />
      <Submit pending={pending}>Envoyer mon témoignage</Submit>
      <p className="flex items-start gap-2 text-xs text-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Votre courriel ne sera jamais publié. Vous pouvez demander le retrait de votre témoignage en tout temps.
      </p>
    </form>
  )
}
