export const mainNav = [
  { href: '/', label: 'Accueil' },
  { href: '/decouvrir', label: 'Découvrir' },
  { href: '/eglise', label: 'Église' },
  { href: '/ministeres', label: 'Ministères' },
  { href: '/messages', label: 'Messages' },
  { href: '/evenements', label: 'Événements' },
]

export const footerNav = {
  explorer: mainNav,
  participer: [
    { href: '/priere', label: 'Prière' },
    { href: '/donner', label: 'Donner' },
    { href: '/servir', label: 'Servir' },
    { href: '/planifier-ma-visite', label: 'Nous rejoindre' },
  ],
  legal: [
    { href: '/confidentialite', label: 'Confidentialité' },
    { href: '/conditions', label: 'Conditions d’utilisation' },
    { href: '/cookies', label: 'Cookies' },
  ],
}

/** Pages prévues au plan du site, pas encore construites (phase 4). */
export const upcomingPages: Record<string, string> = {
  decouvrir: 'Découvrir MKMI Québec',
  'decouvrir/foi': 'Découvrir la foi',
  eglise: 'Église',
  ministeres: 'Ministères',
  messages: 'Messages',
  evenements: 'Événements',
  priere: 'Prière',
  temoignages: 'Témoignages',
  missions: 'Missions',
  donner: 'Donner',
  servir: 'Servir',
  contact: 'Contact',
  'planifier-ma-visite': 'Planifier ma visite',
  recherche: 'Recherche',
  confidentialite: 'Politique de confidentialité',
  conditions: 'Conditions d’utilisation',
  cookies: 'Cookies',
}
