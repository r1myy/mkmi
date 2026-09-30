import type { Field, Tab } from 'payload'

import { button, cta, features, hero, iconSelect, image, items, pageGlobal, quote, section, text } from '../fields/sections'

const faqDefaults = [
  {
    question: 'Combien de temps dure le culte ?',
    answer: 'La durée du culte sera précisée prochainement. N’hésitez pas à nous écrire pour toute question.',
  },
  {
    question: 'Les enfants sont-ils accueillis ?',
    answer: 'Oui ! Les familles sont les bienvenues. Écrivez-nous pour connaître ce qui est prévu pour les enfants.',
  },
  {
    question: 'Comment dois-je m’habiller ?',
    answer: 'Venez comme vous êtes. Il n’y a pas de code vestimentaire : l’important, c’est que vous soyez à l’aise.',
  },
  { question: 'Où stationner ?', answer: 'Les informations sur le stationnement seront publiées prochainement.' },
  {
    question: 'Est-il nécessaire d’être membre pour participer ?',
    answer: 'Non. Tout le monde est bienvenu à nos cultes et à nos activités, membre ou non.',
  },
]

const faqField = (defaultValue = faqDefaults): Field => ({
  name: 'questions',
  label: 'Questions',
  type: 'array',
  defaultValue,
  admin: { initCollapsed: true },
  fields: [
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Réponse', type: 'textarea', required: true },
  ],
})

const linkedItems = (name: string, label: string, defaultValue: { icon: string; title: string; text: string; link: string }[]): Field => ({
  name,
  label,
  type: 'array',
  defaultValue,
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        iconSelect,
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'link', label: 'Lien (ex. /priere)', type: 'text' },
      ],
    },
    { name: 'text', label: 'Texte', type: 'textarea', admin: { rows: 2 } },
  ],
})

export const PageEglise = pageGlobal('page-eglise', 'Église', '/eglise', [
  hero({
    eyebrow: 'Notre église',
    title: 'Une maison\n*pour tous.*',
    text: 'Une communauté vivante où nous adorons Dieu ensemble, grandissons dans sa Parole, vivons la communion fraternelle et servons notre génération.',
    primary: 'Planifier ma visite',
    secondary: 'Découvrir MKMI',
  }),
  features([
    { icon: 'users', title: 'Une communauté multiculturelle', text: 'Des personnes de tous horizons unies par une même foi.' },
    { icon: 'book', title: 'Centrée sur la Parole', text: 'Un enseignement biblique pertinent et pratique.' },
    { icon: 'heart', title: 'Une église pour les familles', text: 'Un lieu où chaque génération a sa place.' },
    { icon: 'globe', title: 'Tournée vers notre génération', text: 'Vivre une foi qui impacte notre ville et au-delà.' },
  ]),
  section('welcome', 'À quoi s’attendre', {
    eyebrow: 'À quoi s’attendre ?',
    title: 'Venez comme vous êtes, vous êtes les bienvenus.',
    text: 'Que ce soit votre première visite ou que vous cherchiez une nouvelle église locale, nous vous accueillons avec joie. Découvrez à quoi vous attendre lors d’un de nos cultes et comment vous pouvez vous impliquer.',
    button: 'Découvrir à quoi s’attendre',
    image: 'Photo',
  }),
  section(
    'services',
    'Nos cultes',
    {
      eyebrow: 'Nos cultes',
      title: 'Rejoignez-nous ce dimanche',
      text: 'Un temps de louange, de prière et d’enseignement pour toute la famille.',
    },
    [
      text('serviceLabel', 'Libellé sous l’heure', 'Culte principal', {
        description: 'Le jour, l’heure et l’adresse se modifient dans Paramètres › Informations de l’église.',
      }),
      { type: 'row', fields: [button('primary', 'Bouton principal', 'Planifier ma visite'), button('secondary', 'Bouton secondaire', 'Nous contacter')] },
    ],
  ),
  section('groups', 'Pour chaque génération', { eyebrow: 'Pour chaque génération', title: 'Une place pour chacun.' }, [
    {
      name: 'cards',
      label: 'Cartes',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true },
      defaultValue: [
        { icon: 'users-round', title: 'Adultes', text: 'Un temps d’adoration, d’enseignement et de communion fraternelle.' },
        { icon: 'baby', title: 'Enfants', text: 'Un environnement sécuritaire et stimulant pour la prochaine génération.' },
        { icon: 'sparkles', title: 'Jeunesse', text: 'Une génération engagée pour impacter notre monde avec l’Évangile.' },
        { icon: 'book', title: 'Groupes', text: 'Grandir ensemble à travers des groupes et des études bibliques.' },
      ],
      fields: [
        { type: 'row', fields: [iconSelect, { name: 'title', label: 'Titre', type: 'text', required: true }] },
        { name: 'text', label: 'Texte', type: 'textarea', admin: { rows: 2 } },
        image('image', 'Photo (sinon, celle du ministère du même nom)'),
      ],
    },
  ]),
  section(
    'membership',
    'Devenir membre',
    {
      eyebrow: 'Devenir membre',
      title: 'Une famille engagée pour aller plus loin.',
      text: 'Explorez ce que signifie devenir membre, les engagements et les prochaines étapes.',
      button: 'En savoir plus sur la membership',
      image: 'Photo de fond',
    },
    [
      items(
        'steps',
        'Étapes',
        [
          { icon: 'users', title: 'Grandir dans la foi' },
          { icon: 'sprout', title: 'Servir avec ses dons' },
          { icon: 'heart', title: 'Faire partie de la famille' },
        ],
        { withText: false, maxRows: 4 },
      ),
    ],
  ),
  section(
    'faq',
    'Questions fréquentes',
    {
      eyebrow: 'Questions fréquentes',
      title: 'Tout ce que vous devez savoir avant votre première visite.',
      text: 'Nous avons rassemblé les réponses aux questions les plus courantes pour vous aider à planifier votre visite en toute confiance.',
      button: 'Poser une autre question',
    },
    [faqField()],
  ),
  cta({
    eyebrow: 'Une église dans sa ville',
    title: 'Ensemble pour un plus grand impact.',
    text: 'Nous croyons qu’une église locale doit être une lumière dans sa ville, au service des gens et engagée dans sa communauté.',
    primary: 'Découvrir nos initiatives',
  }),
])

export const PageDecouvrir = pageGlobal('page-decouvrir', 'Découvrir', '/decouvrir', [
  hero({
    eyebrow: 'Découvrir MKMI Québec',
    title: 'Une histoire\n*plus grande*\nque nous.',
    text: 'Une communauté chrétienne passionnée par Jésus, engagée à voir des vies transformées, des familles restaurées et notre génération impactée.',
    primary: 'Notre vision',
    secondary: 'Notre église',
  }),
  section(
    'about',
    'Qui sommes-nous',
    {
      eyebrow: 'Qui sommes-nous ?',
      title: 'Une famille pour tous les peuples.',
      text: 'MKMI Québec fait partie du réseau international Messianic Kingdom Miracles International. Nous sommes une église locale, multiculturelle et intergénérationnelle, unie par la foi en Jésus-Christ et animée par la mission d’annoncer l’Évangile, de former des disciples et de servir notre communauté.',
      image: 'Photo',
    },
    [
      items(
        'highlights',
        'Points forts',
        [
          { icon: 'users', title: 'Une communauté multiculturelle' },
          { icon: 'heart', title: 'Centrée sur Christ' },
          { icon: 'globe', title: 'Engagée pour notre ville et au-delà' },
        ],
        { withText: false, maxRows: 3 },
      ),
      ...quote('Ici, nous avons trouvé une famille, des amis et un lieu où notre foi grandit.', 'Membre de MKMI Québec'),
    ],
  ),
  {
    name: 'pillars',
    label: 'Mission, vision, valeurs',
    fields: [
      items('items', 'Cartes', [
        { icon: 'megaphone', title: 'Notre mission', text: 'Annoncer l’Évangile, faire des disciples et impacter notre génération.' },
        { icon: 'compass', title: 'Notre vision', text: 'Voir des vies transformées, des familles restaurées et des communautés impactées.' },
        { icon: 'gem', title: 'Nos valeurs', text: 'Amour, excellence, intégrité, service et unité.' },
        { icon: 'sparkles', title: 'Notre ADN', text: 'Évangéliser, enseigner, vivre la communion et servir avec excellence.' },
      ], { maxRows: 4 }),
    ],
  },
  section(
    'story',
    'Notre histoire',
    {
      eyebrow: 'Notre histoire',
      title: 'Un appel qui porte du fruit.',
      text: 'Depuis ses débuts, MKMI est animé par une vision simple : voir le Royaume de Dieu se manifester par des vies transformées à travers le monde. Aujourd’hui, MKMI Québec poursuit cette vision dans notre ville, en lien avec la famille internationale.',
    },
    [
      {
        name: 'timeline',
        label: 'Étapes',
        type: 'array',
        admin: { initCollapsed: true },
        defaultValue: [
          { label: 'Les débuts', title: 'Fondation de MKMI', text: 'Date à confirmer' },
          { label: 'Au fil des années', title: 'Expansion', text: 'Dans plusieurs pays et villes' },
          { label: 'Aujourd’hui', title: 'MKMI Québec', text: 'Au service de notre communauté' },
          { label: 'Demain', title: 'Toujours plus loin', text: 'Pour la gloire de Dieu' },
        ],
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'label', label: 'Repère (année, période)', type: 'text', required: true },
              { name: 'title', label: 'Titre', type: 'text', required: true },
            ],
          },
          { name: 'text', label: 'Texte', type: 'text' },
        ],
      },
    ],
  ),
  section(
    'vision',
    'Notre vision',
    {
      eyebrow: 'Notre vision',
      title: 'Bâtir des vies qui font la différence.',
      text: 'Nous croyons qu’une église est plus qu’un bâtiment. C’est une famille qui grandit ensemble, qui vit l’amour de Dieu et qui impacte son environnement.',
      button: 'Découvrir notre église',
    },
    quote('Une génération transformée pour transformer son monde.', 'Vision de MKMI'),
  ),
  section(
    'team',
    'Notre équipe',
    {
      eyebrow: 'Notre leadership',
      title: 'Une équipe au service de la vision.',
      text: 'Nos pasteurs et leaders servent avec un cœur passionné pour Dieu et pour les personnes. Ils accompagnent notre communauté dans la croissance spirituelle et dans la réalisation de la mission de MKMI Québec.',
    },
    [
      {
        name: 'leaders',
        label: 'Membres de l’équipe',
        type: 'array',
        admin: { initCollapsed: true },
        defaultValue: [
          { name: 'Nom à confirmer', role: 'Pasteur principal' },
          { name: 'Nom à confirmer', role: 'Pasteure associée' },
          { name: 'Nom à confirmer', role: 'Leader pastoral' },
          { name: 'Nom à confirmer', role: 'Responsable des ministères' },
        ],
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'name', label: 'Nom', type: 'text', required: true },
              { name: 'role', label: 'Rôle', type: 'text', required: true },
            ],
          },
          image('photo', 'Photo'),
        ],
      },
    ],
  ),
  section('faith', 'Notre foi', {
    eyebrow: 'Notre foi',
    title: 'Une foi enracinée dans la Parole.',
    text: 'Nous croyons en la Bible comme la Parole inspirée de Dieu, en Jésus-Christ comme Seigneur et Sauveur, en l’œuvre du Saint-Esprit et en la puissance de la prière. Notre foi se traduit par une vie transformée et un service actif.',
    button: 'Découvrir la foi',
    image: 'Photo',
  }),
  section('network', 'Réseau international', {
    eyebrow: 'Notre famille internationale',
    title: 'Un réseau, une même mission.',
    text: 'MKMI est présent dans plusieurs pays à travers le monde. Ensemble, nous partageons la même vision : voir le Royaume de Dieu se manifester et impacter les nations.',
    button: 'Découvrir nos missions',
  }),
  cta({
    eyebrow: 'Vous avez des questions ?',
    title: 'Nous sommes là pour vous.',
    text: 'Contactez-nous ou venez nous rencontrer lors de notre prochain culte.',
    primary: 'Planifier ma visite',
    secondary: 'Nous contacter',
  }),
])

export const PageMinisteres = pageGlobal('page-ministeres', 'Ministères', '/ministeres', [
  hero({
    eyebrow: 'Ministères',
    title: 'Des talents au service\n*du Royaume.*',
    text: 'Nos ministères sont des espaces où chacun peut grandir, servir et faire une différence. Découvrez comment vous pouvez vous impliquer et utiliser vos dons pour l’édification de notre communauté et l’avancement de l’Évangile.',
    primary: 'Découvrir nos ministères',
    secondary: 'Commencer à servir',
    quote: [
      'Chacun selon le don qu’il a reçu, mettez-le au service des autres, comme de bons gestionnaires de la grâce de Dieu.',
      '1 Pierre 4:10',
    ],
  }),
  features([
    { icon: 'users', title: 'Une diversité de dons', text: 'Chaque personne a une place et un rôle à jouer.' },
    { icon: 'heart', title: 'Un même objectif', text: 'Servir Dieu, servir les gens et impacter notre communauté.' },
    { icon: 'sprout', title: 'Une formation continue', text: 'Nous accompagnons et formons les serviteurs.' },
    { icon: 'handshake', title: 'Une communauté engagée', text: 'Grandir ensemble pour un plus grand impact.' },
  ]),
  section('list', 'Liste des ministères', {
    eyebrow: 'Nos ministères',
    title: 'Découvrez nos ministères.',
    text: 'Cliquez sur un ministère pour en savoir plus et découvrir comment vous impliquer.',
  }, [
    {
      name: 'listHelp',
      type: 'ui',
      admin: { components: { Field: { path: '@/components/admin/HelpText#HelpText', clientProps: { text: 'Chaque ministère (nom, photo, description) se modifie dans Contenu › Ministères.' } } } },
    },
  ]),
  section(
    'serve',
    'S’impliquer',
    {
      eyebrow: 'S’impliquer',
      title: 'Vous avez un don. Il y a une place pour vous.',
      text: 'Quel que soit votre âge, votre expérience ou vos talents, vous pouvez vous impliquer dans l’un de nos ministères et contribuer à l’œuvre de Dieu.',
      button: 'Commencer à servir',
      image: 'Photo de fond',
    },
    [
      items(
        'steps',
        'Étapes',
        [
          { icon: 'heart', title: 'Découvrez vos dons' },
          { icon: 'users-round', title: 'Trouvez votre place' },
          { icon: 'sprout', title: 'Grandissez dans le service' },
          { icon: 'target', title: 'Faites une différence' },
        ],
        { withText: false, maxRows: 4 },
      ),
    ],
  ),
  section('spotlight', 'À la une', { eyebrow: 'À la une', button: 'En savoir plus' }, [
    text('ministryName', 'Nom du ministère mis en avant', 'Jeunesse', { description: 'Doit correspondre au nom d’un ministère.' }),
    text('activitiesTitle', 'Titre de la liste d’activités', 'Prochaines activités'),
  ]),
  cta({
    eyebrow: 'Ensemble pour un plus grand impact',
    title: 'Rejoignez un ministère aujourd’hui.',
    text: 'Servir, c’est faire partie de quelque chose de plus grand.',
    primary: 'M’impliquer maintenant',
  }),
])

export const PageMessages = pageGlobal('page-messages', 'Messages', '/messages', [
  hero({
    eyebrow: 'Messages',
    title: 'Des enseignements pour *aujourd’hui* et pour *demain.*',
    text: 'Découvrez nos prédications, études bibliques et enseignements qui vous encouragent à grandir dans la foi et à vivre la Parole au quotidien.',
    primary: 'Regarder le dernier message',
    secondary: 'Écouter le balado',
    quote: ['Ta Parole est une lampe à mes pieds et une lumière sur mon sentier.', 'Psaume 119:105'],
  }),
  section('featured', 'Message de la semaine', { eyebrow: 'Message de la semaine' }, [
    {
      type: 'collapsible',
      label: 'Où choisir le message ?',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'help',
          type: 'ui',
          admin: { components: { Field: { path: '@/components/admin/HelpText#HelpText', clientProps: { text: 'Cochez « Message de la semaine » dans Contenu › Messages. Sinon, le plus récent est affiché.' } } } },
        },
      ],
    },
  ]),
  section('library', 'Tous les messages', { title: 'Tous les messages' }),
  section(
    'podcast',
    'Balado',
    {
      eyebrow: 'Balado',
      title: 'Emportez la Parole avec vous.',
      text: 'Écoutez nos messages partout : en voiture, au travail ou à la maison.',
    },
    [
      text('spotifyUrl', 'Lien Spotify'),
      text('applePodcastsUrl', 'Lien Apple Podcasts'),
      text('youtubeChannelUrl', 'Lien de la chaîne YouTube'),
    ],
  ),
  section('newsletter', 'Infolettre', {
    eyebrow: 'Restez informé',
    title: 'Recevez nos nouveaux messages',
    text: 'Inscrivez-vous pour être informé lorsqu’un nouveau message est publié.',
  }),
])

export const PageEvenements = pageGlobal('page-evenements', 'Événements', '/evenements', [
  hero({
    eyebrow: 'Événements',
    title: 'Des rencontres\nqui *transforment.*',
    text: 'Rejoignez-nous pour des moments de louange, d’enseignement, de prière et de communion. Nos événements sont des occasions de grandir dans la foi, de développer des relations et d’impacter notre communauté.',
    primary: 'Voir les prochains événements',
    secondary: 'Planifier ma visite',
    quote: ['Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux.', 'Matthieu 18:20'],
  }),
  features([
    { icon: 'calendar', title: 'Des événements variés', text: 'Louange, enseignement, prière, conférences, ateliers et plus.' },
    { icon: 'users', title: 'Une communauté accueillante', text: 'Des moments pour toute la famille et pour tous les âges.' },
    { icon: 'heart', title: 'Des vies transformées', text: 'Des rencontres où Dieu agit et change des vies.' },
    { icon: 'map-pin', title: 'À Québec et en ligne', text: 'Participez sur place ou à distance, où que vous soyez.' },
  ]),
  section('featured', 'À la une', { eyebrow: 'Événement à la une' }),
  section('list', 'Tous les événements', { title: 'Tous les événements' }),
  section('newsletter', 'Infolettre', {
    eyebrow: 'Restez informé',
    title: 'Ne manquez aucun événement.',
    text: 'Inscrivez-vous pour recevoir nos prochains événements, infos et rappels directement dans votre boîte courriel.',
    image: 'Photo de fond',
  }),
])

export const PageMissions = pageGlobal('page-missions', 'Missions', '/missions', [
  hero({
    eyebrow: 'Missions',
    title: 'L’Évangile\n*sans frontières.*',
    text: 'Nous croyons qu’une église locale fait partie d’une vision plus grande. Ensemble, nous soutenons des initiatives qui transforment des vies au Québec, au Canada et dans le monde.',
    primary: 'Découvrir nos missions',
    secondary: 'M’impliquer',
  }),
  features([
    { icon: 'globe', title: 'Partager l’Évangile', text: 'Annoncer la bonne nouvelle dans des contextes variés.' },
    { icon: 'users', title: 'Former et équiper', text: 'Développer des leaders et des disciples.' },
    { icon: 'heart', title: 'Soutenir les communautés', text: 'Apporter une aide concrète et durable.' },
    { icon: 'sprout', title: 'Impacter notre génération', text: 'Bâtir un avenir d’espérance par des actions concrètes.' },
  ]),
  section(
    'vision',
    'Notre vision',
    {
      eyebrow: 'Notre vision',
      title: 'Une Église en mouvement pour un monde transformé.',
      text: 'MKMI Québec s’inscrit dans le réseau international MKMI et soutient des initiatives missionnaires locales et internationales. Nous croyons que l’Évangile transforme les individus, les familles, les communautés et les nations.',
      image: 'Photo',
    },
    quote('Allez par tout le monde et prêchez la bonne nouvelle à toute la création.', 'Marc 16:15'),
  ),
  section('fields', 'Champs d’action', { eyebrow: 'Nos champs d’action', title: 'Des missions ici et ailleurs.' }, [
    {
      name: 'fieldsHelp',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: '@/components/admin/HelpText#HelpText',
            clientProps: { text: 'Les projets se modifient dans Contenu › Missions. Tant qu’aucun projet n’est publié, les zones de la page d’accueil sont affichées.' },
          },
        },
      },
    },
  ]),
  section('presence', 'Notre empreinte', {
    eyebrow: 'Notre empreinte',
    title: 'Une présence qui fait la différence.',
    text: 'À travers nos partenaires et nos initiatives, nous contribuons à l’avancement de l’Évangile dans plusieurs régions du monde.',
  }),
  section(
    'involve',
    'Comment s’impliquer',
    {
      eyebrow: 'Comment vous impliquer ?',
      title: 'Faites partie de la mission.',
      text: 'Il existe plusieurs façons de contribuer et de faire une différence dans l’avancement de l’Évangile.',
    },
    [
      linkedItems('ways', 'Façons de s’impliquer', [
        { icon: 'hand-heart', title: 'Prier', text: 'Soutenez nos missions dans la prière.', link: '/priere' },
        { icon: 'gift', title: 'Donner', text: 'Contribuez aux projets en cours.', link: '/donner' },
        { icon: 'users', title: 'Servir', text: 'Impliquez-vous selon vos dons.', link: '/servir' },
        { icon: 'plane', title: 'Aller', text: 'Participez à un voyage missionnaire.', link: '/contact' },
      ]),
    ],
  ),
  section('testimonials', 'Témoignages', { eyebrow: 'Témoignages', title: 'Des vies transformées.' }),
  cta({
    eyebrow: 'Ensemble pour plus d’impact',
    title: 'Soutenons la mission.',
    text: 'Votre générosité et votre engagement permettent de transformer des vies et d’étendre l’Évangile plus loin.',
    primary: 'Faire un don',
    secondary: 'En savoir plus',
  }),
])

export const PagePriere = pageGlobal('page-priere', 'Prière', '/priere', [
  hero({
    eyebrow: 'Prière',
    title: 'Vous n’êtes pas seul. *Nous prions avec vous.*',
    text: 'Peu importe ce que vous traversez, notre équipe et notre communauté sont là pour vous soutenir dans la prière. Dieu écoute et il agit aujourd’hui.',
    primary: 'Envoyer une demande de prière',
    secondary: 'Comment ça fonctionne',
    quote: [
      'Invoque-moi, et je te répondrai ; je te ferai connaître de grandes choses, des choses cachées que tu ne connais pas.',
      'Jérémie 33:3',
    ],
  }),
  features([
    { icon: 'hand-heart', title: 'Une équipe dédiée', text: 'Une équipe de prière est là pour vous accompagner.' },
    { icon: 'users', title: 'Une communauté qui prie', text: 'Nous croyons en la puissance de la prière collective.' },
    { icon: 'lock', title: 'Confidentialité et respect', text: 'Vos demandes sont traitées avec soin et discrétion.' },
    { icon: 'heart', title: 'Un Dieu qui répond', text: 'Nous croyons que la prière donne des réponses.' },
  ]),
  section(
    'request',
    'Demande de prière',
    {
      eyebrow: 'Demande de prière',
      title: 'Nous voulons prier avec vous.',
      text: 'Remplissez le formulaire et notre équipe priera pour votre situation. Vous pouvez nous partager votre sujet de prière en toute confiance.',
      image: 'Photo à côté du formulaire',
    },
    [
      text('formTitle', 'Titre du formulaire', 'Envoyez votre demande de prière'),
      ...quote('Là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux.', 'Matthieu 18:20'),
    ],
  ),
  section('others', 'Autres façons de prier', { title: 'Autres façons de prier avec nous' }),
  section('process', 'Comment ça fonctionne', { eyebrow: 'Notre processus', title: 'Comment ça fonctionne ?' }, [
    items(
      'steps',
      'Étapes',
      [
        { title: 'Vous partagez', text: 'Remplissez le formulaire ou contactez notre équipe.' },
        { title: 'Nous recevons', text: 'Votre demande est transmise à notre équipe de prière.' },
        { title: 'Nous prions', text: 'Notre équipe et la communauté prient pour vous.' },
        { title: 'Dieu agit', text: 'Nous croyons que Dieu répond et nous restons disponibles pour vous accompagner.' },
      ],
      { withIcon: false, maxRows: 4 },
    ),
  ]),
  section('testimonials', 'Témoignages', {
    eyebrow: 'Témoignages',
    title: 'Des vies transformées par la prière.',
    text: 'Découvrez comment Dieu répond encore aujourd’hui aux prières de son peuple.',
    button: 'Partager votre témoignage',
  }),
  cta({
    eyebrow: 'Ne cessez de prier',
    title: 'Une communauté qui tient devant Dieu ensemble.',
    text: 'Joignez-vous à nos temps de prière et expérimentez la puissance d’une foi unie.',
    primary: 'Voir nos temps de prière',
  }),
])

export const PageDon = pageGlobal('page-don', 'Donner', '/donner', [
  hero({
    eyebrow: 'Donner',
    title: 'Donner *avec joie.*',
    text: 'Chaque don, petit ou grand, permet à MKMI Québec d’accueillir, d’enseigner, d’aider les familles et de porter l’Évangile plus loin. Merci de faire partie de cette mission.',
    primary: 'Faire un don en ligne',
    secondary: 'À quoi sert votre don',
    quote: [
      'Que chacun donne comme il l’a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie.',
      '2 Corinthiens 9:7',
    ],
  }),
  features([
    { icon: 'church', title: 'L’église locale', text: 'Faire vivre nos cultes et notre accueil à Québec.' },
    { icon: 'globe', title: 'La mission', text: 'Porter l’Évangile ici et dans le monde.' },
    { icon: 'users', title: 'Les familles', text: 'Soutenir concrètement celles et ceux qui en ont besoin.' },
    { icon: 'shield', title: 'La confiance', text: 'Des dons gérés avec intégrité et transparence.' },
  ]),
  section(
    'ways',
    'Façons de donner',
    {
      eyebrow: 'Façons de donner',
      title: 'Choisissez la façon qui vous convient.',
      text: 'Simple, rapide et sécurisé : donnez là où vous êtes.',
    },
    [
      {
        name: 'paymentHelp',
        type: 'ui',
        admin: {
          components: {
            Field: {
              path: '@/components/admin/HelpText#HelpText',
              clientProps: {
                text: 'Aucune information de paiement n’est inventée : tant qu’un champ est vide, la façon de donner correspondante n’est pas affichée. Le lien de don en ligne se règle dans Paramètres › Informations de l’église › Contact.',
              },
            },
          },
        },
      },
      text('onlineText', 'Don en ligne : texte', 'Par carte, en quelques clics, depuis votre téléphone ou votre ordinateur.', { long: true }),
      { name: 'interacEmail', label: 'Courriel pour les virements Interac', type: 'email' },
      text('interacNote', 'Précision Interac (ex. question de sécurité)'),
      text('mailingAddress', 'Adresse pour les chèques (libellés à l’ordre de…)', undefined, { long: true }),
      text('inPersonNote', 'Don sur place : texte', 'Pendant le culte, lors du temps des offrandes.'),
    ],
  ),
  section(
    'impact',
    'À quoi sert votre don',
    {
      eyebrow: 'Votre don fait la différence',
      title: 'À quoi sert votre générosité.',
      text: 'Vos dons sont investis là où ils portent du fruit, pour notre ville et au-delà.',
      image: 'Photo de fond',
    },
    [
      items('uses', 'Utilisations', [
        { icon: 'church', title: 'La vie de l’église', text: 'Les cultes, l’accueil, les locaux et tout ce qui rend nos rencontres possibles.' },
        { icon: 'globe', title: 'Les missions', text: 'Les initiatives soutenues ici et ailleurs pour partager l’Évangile.' },
        { icon: 'hand-heart', title: 'L’entraide', text: 'Un soutien concret aux personnes et aux familles dans le besoin.' },
        { icon: 'sprout', title: 'Jeunesse et familles', text: 'Des activités pour faire grandir la prochaine génération dans la foi.' },
      ], { maxRows: 4 }),
    ],
  ),
  section(
    'trust',
    'Confiance et reçus',
    { eyebrow: 'Questions fréquentes', title: 'Donner en toute confiance.', text: 'Vos dons sont reçus avec reconnaissance et gérés avec intégrité.' },
    [
      {
        type: 'row',
        fields: [
          { name: 'charityNumber', label: 'Numéro d’organisme de bienfaisance (ARC)', type: 'text' },
          {
            name: 'taxReceipts',
            label: 'Reçus fiscaux délivrés',
            type: 'checkbox',
            defaultValue: false,
            admin: { description: 'Cocher seulement si MKMI Québec est un organisme de bienfaisance enregistré.' },
          },
        ],
      },
    ],
  ),
  cta({
    eyebrow: 'Merci',
    title: 'Ensemble, nous allons plus loin.',
    text: 'Votre générosité rend possible chaque rencontre, chaque projet et chaque vie touchée.',
    primary: 'Faire un don',
    secondary: 'Nous contacter',
  }),
])

export const PageContact = pageGlobal('page-contact', 'Nous contacter', '/contact', [
  hero({
    eyebrow: 'Nous contacter',
    title: 'Nous serions heureux\nde *vous rencontrer.*',
    text: 'Que vous ayez une question, un besoin de prière ou désiriez en savoir plus sur notre église, notre équipe est là pour vous.',
    primary: 'Nous écrire',
    secondary: 'Planifier ma visite',
  }),
  {
    name: 'info',
    label: 'Coordonnées',
    description: 'L’adresse, le téléphone et le courriel se modifient dans Paramètres › Informations de l’église.',
    fields: [text('officeHours', 'Heures d’ouverture', 'Heures à confirmer')],
  },
  section('visit', 'Visitez-nous', {
    eyebrow: 'Visitez-nous',
    title: 'Nous avons hâte de vous accueillir.',
    text: 'Venez vivre un temps de louange, de prière et d’enseignement dans une atmosphère chaleureuse et familiale.',
    button: 'Planifier ma première visite',
    image: 'Photo',
  }),
  section('form', 'Formulaire', {
    eyebrow: 'Écrivez-nous',
    title: 'Une question ? Un besoin de prière ?',
    text: 'Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.',
  }),
  section('others', 'Autres moyens', { eyebrow: 'Autres moyens de nous joindre', title: 'Restons en contact.' }),
  section(
    'faq',
    'Questions fréquentes',
    {
      eyebrow: 'Questions fréquentes',
      title: 'Vous avez une question ?',
      text: 'Voici les réponses aux questions les plus courantes. Si vous ne trouvez pas l’information recherchée, n’hésitez pas à nous écrire.',
    },
    [faqField()],
  ),
  cta({
    eyebrow: 'Une église proche de vous',
    title: 'Vous n’êtes pas seul.',
    text: 'Nous sommes là pour vous écouter, vous accompagner et marcher avec vous.',
    primary: 'Demander une prière',
    secondary: 'Nous écrire',
  }),
])

export const PageVisite = pageGlobal('page-visite', 'Planifier ma visite', '/planifier-ma-visite', [
  hero({
    eyebrow: 'Planifier ma visite',
    title: 'Planifier ma *visite*',
    text: 'Nous sommes ravis de vous accueillir ! Choisissez le jour de votre visite : une personne de l’équipe d’accueil sera là pour vous recevoir, vous faire découvrir notre communauté et répondre à vos questions.',
    primary: 'Planifier ma visite',
    secondary: 'À quoi s’attendre',
  }),
  features([
    { icon: 'users', title: 'Un accueil chaleureux', text: 'Une équipe sera là pour vous guider.' },
    { icon: 'book', title: 'Une expérience inspirante', text: 'Louez, apprenez et grandissez.' },
    { icon: 'heart', title: 'Une communauté accueillante', text: 'Vous n’êtes pas seul(e).' },
  ]),
  {
    name: 'services',
    label: 'Services proposés',
    description: 'Les rencontres que les visiteurs peuvent choisir. Les dates proposées sont calculées à partir du jour de la semaine.',
    fields: [
      {
        name: 'list',
        label: 'Services',
        type: 'array',
        minRows: 1,
        maxRows: 6,
        admin: { initCollapsed: true },
        defaultValue: [
          {
            name: 'Culte dominical',
            badge: 'Culte principal',
            weekday: '0',
            time: 'Heure à confirmer',
            text: 'Un temps de louange, de prédication et de communion fraternelle.',
          },
        ],
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'name', label: 'Nom', type: 'text', required: true },
              { name: 'badge', label: 'Étiquette (ex. Culte principal)', type: 'text' },
            ],
          },
          {
            type: 'row',
            fields: [
              {
                name: 'weekday',
                label: 'Jour',
                type: 'select',
                required: true,
                defaultValue: '0',
                options: [
                  { label: 'Dimanche', value: '0' },
                  { label: 'Lundi', value: '1' },
                  { label: 'Mardi', value: '2' },
                  { label: 'Mercredi', value: '3' },
                  { label: 'Jeudi', value: '4' },
                  { label: 'Vendredi', value: '5' },
                  { label: 'Samedi', value: '6' },
                ],
              },
              { name: 'time', label: 'Heure (ex. 10 h 00 – 12 h 00)', type: 'text', defaultValue: 'Heure à confirmer' },
            ],
          },
          { name: 'text', label: 'Description', type: 'textarea', admin: { rows: 2 } },
          image('image', 'Photo'),
        ],
      },
    ],
  },
  section(
    'expect',
    'À quoi s’attendre',
    {
      eyebrow: 'À quoi s’attendre ?',
      title: 'Le déroulement d’un culte.',
      text: 'Nos cultes sont chaleureux, vivants et centrés sur Jésus. Voici comment se passe une rencontre, pour que vous sachiez à quoi vous attendre avant d’arriver.',
      image: 'Photo',
    },
    [
      items(
        'steps',
        'Étapes du culte',
        [
          { icon: 'handshake', title: 'Arrivée et accueil', text: 'L’équipe d’accueil vous reçoit, vous oriente et vous présente quelques personnes.' },
          { icon: 'music', title: 'Louange et prière', text: 'Un temps de chants et de prière pour adorer Dieu ensemble.' },
          { icon: 'book', title: 'Prédication', text: 'Un message tiré de la Bible, appliqué à la vie de tous les jours.' },
          { icon: 'users', title: 'Moment fraternel', text: 'Après le culte, prenez le temps de faire connaissance et de poser vos questions.' },
        ],
        { maxRows: 6 },
      ),
    ],
  ),
  section(
    'plan',
    'Formulaire de visite',
    {
      eyebrow: 'Planifier ma visite',
      title: 'Dites-nous quand vous venez.',
      text: 'Remplissez ce court formulaire : nous vous attendrons et nous vous écrirons si nous avons des précisions à vous donner avant votre visite.',
    },
    [
      text('formTitle', 'Titre du formulaire', 'Je planifie ma visite'),
      text('parking', 'Stationnement', 'Les informations sur le stationnement seront publiées prochainement.', { long: true }),
      text('kids', 'Pour les enfants', 'Les familles sont les bienvenues. Écrivez-nous pour savoir ce qui est prévu pour les enfants.', { long: true }),
      text('transit', 'Transport en commun', 'Informations sur les autobus (RTC) à venir.', { long: true }),
      text('access', 'Accessibilité', 'Informations sur l’accessibilité des lieux à venir.', { long: true }),
    ],
  ),
  section(
    'faq',
    'Questions fréquentes',
    {
      eyebrow: 'Questions fréquentes',
      title: 'Avant de venir',
      text: 'Les réponses aux questions que l’on nous pose le plus souvent avant une première visite.',
    },
    [faqField()],
  ),
  cta({
    eyebrow: 'Au plaisir de vous rencontrer',
    title: 'Une place vous attend.',
    text: 'Vous avez une question avant de venir ? Notre équipe est là pour vous répondre.',
    primary: 'Nous écrire',
    secondary: 'Découvrir MKMI',
  }),
])

export const PageTemoignages = pageGlobal('page-temoignages', 'Témoignages', '/temoignages', [
  hero({
    eyebrow: 'Témoignages',
    title: 'Des vies transformées\npar la *puissance de Dieu.*',
    text: 'Découvrez comment Dieu agit encore aujourd’hui dans la vie des hommes et des femmes de notre communauté, à travers des témoignages vrais et inspirants.',
    primary: 'Partager mon témoignage',
    secondary: 'Voir les témoignages',
  }),
  features([
    { icon: 'book', title: 'Encourager votre foi', text: 'Des histoires vraies qui édifient.' },
    { icon: 'heart', title: 'Voir l’œuvre de Dieu', text: 'Des vies transformées.' },
    { icon: 'users', title: 'Une communauté vivante', text: 'Témoignons ensemble de sa fidélité.' },
  ]),
  section(
    'share',
    'Partager un témoignage',
    {
      eyebrow: 'Partagez votre témoignage',
      title: 'Dieu a fait quelque chose dans votre vie ?',
      text: 'Votre histoire peut encourager d’autres personnes. Écrivez-la ici : notre équipe la relira avec vous avant toute publication, et rien n’est publié sans votre accord.',
    },
    [text('formTitle', 'Titre du formulaire', 'Soumettre un témoignage écrit')],
  ),
  section('newsletter', 'Infolettre', {
    eyebrow: 'Restez connecté',
    title: 'Recevez nos nouveaux témoignages',
    text: 'Abonnez-vous pour être informé des nouveaux témoignages, prédications et événements de notre église.',
  }),
])

const themeCards = (defaultValue: { theme: string }[]): Field => ({
  name: 'cards',
  label: 'Cartes de thèmes',
  type: 'array',
  maxRows: 8,
  defaultValue,
  admin: { initCollapsed: true, description: 'Le nombre de ressources de chaque thème est calculé automatiquement.' },
  fields: [
    {
      name: 'theme',
      label: 'Thème',
      type: 'select',
      required: true,
      options: [
        { label: 'Qui est Dieu ?', value: 'dieu' },
        { label: 'Qui est Jésus ?', value: 'jesus' },
        { label: 'Lire la Bible', value: 'bible' },
        { label: 'La prière', value: 'priere' },
        { label: 'La vie chrétienne', value: 'vie' },
        { label: 'La croissance spirituelle', value: 'croissance' },
        { label: 'La famille', value: 'famille' },
        { label: 'Autres', value: 'autres' },
      ],
    },
    image('image', 'Photo'),
  ],
})

export const PageFoi = pageGlobal('page-foi', 'Découvrir la foi', '/decouvrir/foi', [
  hero({
    eyebrow: 'Découvrir la foi',
    title: 'Un chemin de foi\npour *aujourd’hui.*',
    text: 'Explorez des ressources simples et pratiques pour connaître Dieu, comprendre la Bible, grandir dans la foi et vivre une relation authentique avec Jésus-Christ.',
    primary: 'Commencer mon parcours',
    secondary: 'Explorer par thème',
    quote: ['Cherchez l’Éternel pendant qu’il se trouve ; invoquez-le, tandis qu’il est près.', 'Ésaïe 55:6'],
  }),
  {
    name: 'shortcuts',
    label: 'Raccourcis',
    description: 'La rangée d’icônes sous le haut de page.',
    fields: [
      items(
        'items',
        'Raccourcis',
        [
          { icon: 'book', title: 'Qui est Dieu ?', text: 'Découvrez son amour' },
          { icon: 'users', title: 'Qui est Jésus ?', text: 'Sa vie, sa mission' },
          { icon: 'church', title: 'Lire la Bible', text: 'Comprendre sa Parole' },
          { icon: 'sprout', title: 'Grandir dans la foi', text: 'Des pas concrets' },
          { icon: 'hands', title: 'Prier', text: 'Parlez à Dieu' },
          { icon: 'heart', title: 'Vivre en communauté', text: 'Une famille pour vous' },
        ],
        { maxRows: 6 },
      ),
    ],
  },
  section('themes', 'Explorer par thème', { title: 'Explorer par thème' }, [
    themeCards([{ theme: 'bible' }, { theme: 'jesus' }, { theme: 'priere' }, { theme: 'croissance' }, { theme: 'vie' }]),
  ]),
  section('start', 'Par où commencer ?', { title: 'Par où commencer ?', button: 'Suivre le parcours complet' }, [
    {
      name: 'steps',
      label: 'Étapes',
      type: 'array',
      maxRows: 8,
      defaultValue: [
        { title: 'Connaître Dieu', link: '/decouvrir/foi?theme=dieu' },
        { title: 'Découvrir Jésus-Christ', link: '/decouvrir/foi?theme=jesus' },
        { title: 'Lire la Bible', link: '/decouvrir/foi?theme=bible' },
        { title: 'Apprendre à prier', link: '/decouvrir/foi?theme=priere' },
        { title: 'Vivre la foi au quotidien', link: '/decouvrir/foi?theme=vie' },
      ],
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Étape', type: 'text', required: true },
            { name: 'link', label: 'Lien (ex. /decouvrir/foi?theme=bible)', type: 'text' },
          ],
        },
      ],
    },
    { name: 'buttonLink', label: 'Lien du bouton', type: 'text', defaultValue: '/decouvrir/foi?type=parcours' },
  ]),
  section('verses', 'Versets du jour', { title: 'Versets du jour' }, [
    {
      name: 'list',
      label: 'Versets',
      type: 'array',
      admin: { initCollapsed: true, description: 'Un verset différent est affiché chaque jour, à tour de rôle.' },
      defaultValue: [
        {
          text: 'Car je connais les projets que j’ai formés sur vous, dit l’Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l’espérance.',
          reference: 'Jérémie 29:11',
        },
        { text: 'Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.', reference: 'Psaume 119:105' },
        { text: 'Approchez-vous de Dieu, et il s’approchera de vous.', reference: 'Jacques 4:8' },
      ],
      fields: [
        { name: 'text', label: 'Verset', type: 'textarea', required: true },
        { name: 'reference', label: 'Référence', type: 'text', required: true },
      ],
    },
    image('image', 'Photo de fond'),
  ]),
  cta({
    eyebrow: 'Besoin d’en parler ?',
    title: 'Vous avez des questions sur la foi ?',
    text: 'Nous sommes là pour vous accompagner dans votre parcours.',
    primary: 'Nous contacter',
  }),
])

export const PageRecherche = pageGlobal('page-recherche', 'Recherche', '/recherche', [
  section(
    'hero',
    'Haut de page',
    {
      eyebrow: 'Recherche',
      title: 'Résultats de *recherche*',
      text: 'Trouvez des prédications, des ressources pour grandir dans la foi, des témoignages, des événements et des ministères.',
    },
    [image('image', 'Photo de fond')],
  ),
  section('newsletter', 'Infolettre', {
    eyebrow: 'Restez connecté',
    title: 'Recevez nos nouveaux messages',
    text: 'Abonnez-vous pour être informé de nos dernières prédications, études bibliques et enseignements.',
  }),
])

export const PageServir = pageGlobal('page-servir', 'Servir', '/servir', [
  hero({
    eyebrow: 'Servir',
    title: 'Vos dons peuvent\n*faire la différence.*',
    text: 'Accueil, louange, enfants, jeunesse, technique, prière, entraide : il y a une place pour chacun. Servir, c’est grandir dans la foi en mettant ses talents au service des autres.',
    primary: 'Je veux m’impliquer',
    secondary: 'Où servir',
  }),
  features([
    { icon: 'heart', title: 'Servir avec joie', text: 'Mettre ses talents au service de Dieu et des autres.' },
    { icon: 'users', title: 'En équipe', text: 'Des équipes accueillantes pour vous accompagner.' },
    { icon: 'sprout', title: 'Grandir', text: 'Servir fait grandir dans la foi et la confiance.' },
    { icon: 'calendar', title: 'À votre rythme', text: 'Selon vos disponibilités, ponctuellement ou chaque semaine.' },
  ]),
  section('where', 'Où servir', {
    eyebrow: 'Où servir ?',
    title: 'Trouvez l’équipe qui vous ressemble.',
    text: 'Chaque ministère de l’église a besoin de bénévoles. Découvrez-les et dites-nous ce qui vous intéresse.',
  }),
  section('process', 'Comment ça fonctionne', { eyebrow: 'Les étapes', title: 'Comment commencer ?' }, [
    items(
      'steps',
      'Étapes',
      [
        { title: 'Vous nous écrivez', text: 'Remplissez le formulaire en indiquant ce qui vous intéresse.' },
        { title: 'Nous faisons connaissance', text: 'Un responsable vous contacte pour échanger avec vous.' },
        { title: 'Vous découvrez l’équipe', text: 'Vous participez à une première rencontre, sans engagement.' },
        { title: 'Vous servez', text: 'Vous trouvez votre place et grandissez avec l’équipe.' },
      ],
      { withIcon: false, maxRows: 4 },
    ),
  ]),
  section('form', 'Formulaire', {
    eyebrow: 'Je veux m’impliquer',
    title: 'Dites-nous où vous aimeriez servir.',
    text: 'Un responsable de l’équipe vous répondra rapidement pour vous présenter les prochaines étapes.',
  }),
  cta({
    eyebrow: 'Ensemble',
    title: 'Chacun a une place dans la famille.',
    text: 'Vous avez une question avant de vous lancer ? Écrivez-nous, nous serons heureux d’en parler avec vous.',
    primary: 'Nous contacter',
    secondary: 'Voir les ministères',
  }),
])

const legalSections = (defaultValue: { heading: string; body: string }[]): Field => ({
  name: 'sections',
  label: 'Sections',
  type: 'array',
  defaultValue,
  admin: { initCollapsed: true },
  fields: [
    { name: 'heading', label: 'Titre de la section', type: 'text', required: true },
    { name: 'body', label: 'Texte', type: 'textarea', required: true, admin: { rows: 6, description: 'Une ligne vide sépare les paragraphes. Une ligne commençant par « - » devient une puce.' } },
  ],
})

const legalTab = (name: string, label: string, title: string, intro: string, sections: { heading: string; body: string }[]): Tab => ({
  name,
  label,
  fields: [
    text('title', 'Titre', title),
    text('intro', 'Introduction', intro, { long: true }),
    { name: 'updated', label: 'Date de mise à jour', type: 'date', defaultValue: '2026-09-30T12:00:00.000Z' },
    legalSections(sections),
  ],
})

export const PageLegal = pageGlobal('page-legal', 'Pages légales', '/confidentialite', [
  {
    name: 'officer',
    label: 'Responsable',
    description: 'Loi 25 : le nom et le titre de la personne responsable de la protection des renseignements personnels doivent être publiés.',
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'name', label: 'Nom du responsable', type: 'text', defaultValue: 'Nom à confirmer' },
          { name: 'role', label: 'Fonction', type: 'text', defaultValue: 'Responsable de la protection des renseignements personnels' },
        ],
      },
      { name: 'email', label: 'Courriel pour les demandes', type: 'email' },
    ],
  },
  legalTab(
    'privacy',
    'Confidentialité',
    'Politique de confidentialité',
    'MKMI Québec respecte votre vie privée. Cette politique explique quels renseignements nous recueillons sur ce site, pourquoi, et comment exercer vos droits, conformément à la Loi sur la protection des renseignements personnels dans le secteur privé du Québec (Loi 25).',
    [
      {
        heading: 'Renseignements recueillis',
        body: 'Nous recueillons uniquement les renseignements que vous nous transmettez volontairement par nos formulaires :\n- demande de prière : nom, courriel, téléphone (facultatif), sujet et message ;\n- contact et bénévolat : nom, courriel, téléphone (facultatif), sujet et message ;\n- planification de visite : nom, courriel, téléphone (facultatif), date, nombre de personnes et besoins particuliers ;\n- inscription à un événement : nom, courriel et nombre de places ;\n- témoignage : nom affiché, courriel, titre et texte ;\n- infolettre : adresse courriel.',
      },
      {
        heading: 'Pourquoi nous les utilisons',
        body: 'Ces renseignements servent uniquement à répondre à votre demande : prier pour vous, vous répondre, préparer votre accueil, gérer votre inscription, relire votre témoignage avant publication ou vous envoyer nos nouvelles. Ils ne sont jamais vendus, loués ni partagés à des fins commerciales.',
      },
      {
        heading: 'Qui peut y accéder',
        body: 'Seuls les membres autorisés de l’équipe de l’église y ont accès, selon leur rôle. Les demandes de prière, les messages, les visites et les renseignements des membres sont réservés à l’équipe pastorale et aux administrateurs. Aucun de ces renseignements n’est publié sur le site.',
      },
      {
        heading: 'Statistiques de visite',
        body: 'Le site compte les pages consultées de façon anonyme : aucun cookie, aucune adresse IP ni aucun identifiant n’est enregistré. Nous n’utilisons pas d’outil publicitaire ni de suivi par des tiers.',
      },
      {
        heading: 'Conservation',
        body: 'Les renseignements sont conservés le temps nécessaire au suivi de votre demande, puis supprimés ou rendus anonymes. La durée exacte de conservation sera précisée par l’église.',
      },
      {
        heading: 'Vos droits',
        body: 'Vous pouvez en tout temps demander à consulter ou corriger vos renseignements, retirer votre consentement, vous désabonner de l’infolettre ou demander la suppression de vos données. Écrivez à la personne responsable indiquée sur cette page ; nous répondrons dans un délai de 30 jours.',
      },
      {
        heading: 'Hébergement et sécurité',
        body: 'Les renseignements sont stockés de façon sécurisée : accès protégé par mot de passe, rôles distincts pour l’équipe et blocage des comptes après plusieurs tentatives de connexion échouées.',
      },
    ],
  ),
  legalTab(
    'terms',
    'Conditions',
    'Conditions d’utilisation',
    'En utilisant ce site, vous acceptez les conditions suivantes.',
    [
      { heading: 'Contenu du site', body: 'Les textes, prédications, photos et vidéos publiés sur ce site appartiennent à MKMI Québec ou à leurs auteurs. Vous pouvez les partager à des fins personnelles et non commerciales, en citant la source.' },
      { heading: 'Témoignages et messages', body: 'Les témoignages ne sont publiés qu’avec le consentement de leur auteur, après relecture. Nous nous réservons le droit de ne pas publier un contenu inapproprié.' },
      { heading: 'Liens externes', body: 'Le site peut contenir des liens vers d’autres sites (YouTube, réseaux sociaux, cartes). MKMI Québec n’est pas responsable de leur contenu ni de leurs pratiques de confidentialité.' },
      { heading: 'Responsabilité', body: 'Nous faisons de notre mieux pour que les informations publiées (horaires, événements) soient exactes. En cas de doute, n’hésitez pas à nous contacter.' },
    ],
  ),
  legalTab(
    'cookies',
    'Cookies',
    'Cookies',
    'Ce site est conçu pour respecter votre vie privée : il n’utilise aucun cookie publicitaire ni de mesure d’audience.',
    [
      { heading: 'Visiteurs du site', body: 'Aucun cookie n’est déposé lorsque vous consultez le site. Les statistiques de visite sont anonymes et ne reposent sur aucun cookie.' },
      { heading: 'Équipe de l’église', body: 'Seuls les membres de l’équipe qui se connectent à l’administration reçoivent un cookie de session, strictement nécessaire à leur connexion. Il est supprimé à la déconnexion ou à son expiration.' },
      { heading: 'Contenus externes', body: 'Les vidéos YouTube sont intégrées en mode « confidentialité renforcée » (youtube-nocookie.com). Si vous ouvrez un lien vers YouTube, Google Maps ou un réseau social, ces services appliquent leurs propres règles.' },
    ],
  ),
])

export const pageGlobals = [
  PageEglise,
  PageDecouvrir,
  PageMinisteres,
  PageMessages,
  PageEvenements,
  PageMissions,
  PagePriere,
  PageDon,
  PageContact,
  PageVisite,
  PageTemoignages,
  PageFoi,
  PageRecherche,
  PageServir,
  PageLegal,
]

/** Chemin public de chaque fiche (pour les liens « Modifier » du site). */
export const pagePaths: Record<string, string> = {
  'page-eglise': '/eglise',
  'page-decouvrir': '/decouvrir',
  'page-ministeres': '/ministeres',
  'page-messages': '/messages',
  'page-evenements': '/evenements',
  'page-missions': '/missions',
  'page-priere': '/priere',
  'page-don': '/donner',
  'page-contact': '/contact',
  'page-visite': '/planifier-ma-visite',
  'page-temoignages': '/temoignages',
  'page-foi': '/decouvrir/foi',
  'page-recherche': '/recherche',
  'page-servir': '/servir',
  'page-legal': '/confidentialite',
}
