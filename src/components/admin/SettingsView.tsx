import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps, Payload } from 'payload'
import React from 'react'

import type { Media, SiteSetting } from '@/payload-types'
import './dashboard.scss'
import { Icon, type IconName, ScreenHeader } from './ui'

const SETTINGS = '/admin/globals/site-settings'

const sections: { icon: IconName; title: string; text: string; href: string }[] = [
  { icon: 'church', title: 'Informations de l’église', text: 'Nom, description, logo, culte, adresse, contact, réseaux', href: SETTINGS },
  { icon: 'users', title: 'Utilisateurs', text: 'Comptes, rôles et accès', href: '/admin/collections/users' },
  { icon: 'pen', title: 'Pages du site', text: 'Textes et photos de chaque page', href: '/admin/globals/home-page' },
  { icon: 'image', title: 'Médias', text: 'Photos, vidéos et fichiers', href: '/admin/collections/media' },
  { icon: 'eye', title: 'Statistiques', text: 'Visites anonymes du site', href: '/admin/collections/page-views' },
]

const Row = ({ label, value, empty = 'À compléter' }: { label: string; value?: string | null; empty?: string }) => (
  <li>
    <span>{label}</span>
    {value ? <strong>{value}</strong> : <em className="mk-tag mk-tag--gold">{empty}</em>}
  </li>
)

async function Settings({ payload }: { payload: Payload }) {
  const s = (await payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null)) as SiteSetting | null
  const logo = s?.logo && typeof s.logo === 'object' ? (s.logo as Media) : null
  const pending = (v?: string | null) => (v && !/confirmer/i.test(v) ? v : null)
  const socials = (['facebook', 'instagram', 'youtube', 'tiktok', 'whatsapp'] as const).filter((k) => s?.[k])

  return (
    <div className="mk-dash mk-screen">
      <ScreenHeader
        crumb="Paramètres"
        title="Paramètres"
        text="Configurez la plateforme selon les besoins de votre communauté."
        actions={
          <a href={SETTINGS} className="mk-btn mk-btn--gold">
            <Icon name="pen" size={18} /> Modifier les informations
          </a>
        }
      />

      <nav className="mk-settings-nav" aria-label="Rubriques">
        {sections.map((x) => (
          <a key={x.title} href={x.href} className="mk-card">
            <span className="mk-kpi__icon mk-bg-navy">
              <Icon name={x.icon} size={22} />
            </span>
            <span>
              <strong>{x.title}</strong>
              <span className="mk-kpi__sub">{x.text}</span>
            </span>
          </a>
        ))}
      </nav>

      <div className="mk-grid2">
        <section className="mk-card">
          <div className="mk-card__head">
            <h2>Informations générales</h2>
            <a href={SETTINGS} className="mk-btn mk-btn--outline">
              Modifier
            </a>
          </div>
          <div className="mk-general">
            <span className="mk-general__logo" style={logo ? { backgroundImage: `url(${logo.url})` } : undefined}>
              {!logo && <Icon name="image" size={30} />}
            </span>
            <ul className="mk-kv">
              <Row label="Nom" value={s?.name} />
              <Row label="Signature" value={s?.tagline?.replace(/\n/g, ' ')} />
              <Row label="Description" value={s?.description} />
            </ul>
          </div>
        </section>

        <section className="mk-card">
          <div className="mk-card__head">
            <h2>Coordonnées et culte</h2>
            <a href={SETTINGS} className="mk-btn mk-btn--outline">
              Modifier
            </a>
          </div>
          <ul className="mk-kv">
            <Row label="Adresse" value={s?.address ? `${s.address}, ${s.city ?? ''} ${s.postalCode ?? ''}` : null} />
            <Row label="Téléphone" value={pending(s?.phone)} />
            <Row label="Courriel" value={s?.email?.includes('@') ? s.email : null} />
            <Row label="Culte" value={pending(s?.serviceTime) ? `${s?.serviceDay}, ${s?.serviceTime}` : null} empty="Heure à confirmer" />
            <Row label="Lien de don en ligne" value={s?.donateUrl} empty="Non configuré" />
            <Row label="Réseaux sociaux" value={socials.length ? socials.map((k) => k[0].toUpperCase() + k.slice(1)).join(', ') : null} empty="Aucun lien" />
          </ul>
        </section>

        <section className="mk-card">
          <h2 className="mk-side__title">Paramètres régionaux et langue</h2>
          <ul className="mk-kv">
            <Row label="Langue" value="Français (Canada)" />
            <Row label="Fuseau horaire" value="Heure de l’Est (Québec)" />
            <Row label="Format de date" value="29 septembre 2026" />
            <Row label="Monnaie" value="Dollar canadien ($ CA)" />
          </ul>
          <p className="mk-kpi__sub" style={{ marginTop: 12 }}>
            L’anglais pourra être ajouté plus tard (structure prévue).
          </p>
        </section>

        <section className="mk-card">
          <h2 className="mk-side__title">Sécurité et confidentialité</h2>
          <ul className="mk-contact">
            <li>
              <Icon name="lock" size={16} /> Compte bloqué 15 minutes après 5 mots de passe erronés
            </li>
            <li>
              <Icon name="users" size={16} /> Trois rôles : administrateur, éditeur, équipe pastorale
            </li>
            <li>
              <Icon name="heart" size={16} /> Demandes de prière, messages, membres et dons jamais publics
            </li>
            <li>
              <Icon name="eye" size={16} /> Statistiques de visite anonymes, sans cookie (Loi 25)
            </li>
            <li>
              <Icon name="down" size={16} /> Exports CSV réservés à l’équipe connectée
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

/** Vue « Paramètres » de l’administration (maquette « Paramètres »). */
export default function SettingsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, locale, visibleEntities } = initPageResult
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={req.user ?? undefined}
      visibleEntities={visibleEntities}
    >
      <Settings payload={req.payload} />
    </DefaultTemplate>
  )
}
