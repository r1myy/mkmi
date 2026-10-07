/**
 * Contenu de démonstration pour le développement local (repris de la maquette).
 * À NE PAS exécuter en production : les informations réelles doivent venir de MKMI Québec.
 *
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... pnpm seed
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD
if (email && password) {
  const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } } })
  if (!totalDocs) {
    await payload.create({ collection: 'users', data: { email, password, name: 'Administrateur', role: 'admin' } })
    payload.logger.info(`Administrateur créé : ${email}`)
  }
}

const ministries = [
  ['Enfants', 'baby', 'blue'],
  ['Jeunesse', 'book', 'blue'],
  ['Femmes', 'flower', 'red'],
  ['Hommes', 'users', 'green'],
  ['Couples', 'heart-handshake', 'red'],
  ['Prière', 'hand-heart', 'green'],
  ['Louange', 'music', 'purple'],
  ['Missions', 'globe', 'purple'],
] as const

if ((await payload.count({ collection: 'ministries' })).totalDocs === 0) {
  for (const [i, [name, icon, accent]] of ministries.entries()) {
    await payload.create({
      collection: 'ministries',
      data: { name, icon, accent, order: i, _status: 'published' },
    })
  }
}

if ((await payload.count({ collection: 'events' })).totalDocs === 0) {
  const base = [
    ['Soirée de louange et de prière', 'Un temps spécial pour adorer Dieu ensemble, prier pour notre ville et vivre sa présence.'],
    ['Rencontre jeunesse', 'Un moment pour les jeunes : louange, partage et amitié.'],
    ['Journée des familles', 'Une journée pour se retrouver, partager un repas et célébrer ensemble.'],
    ['Soirée de louange', 'Une soirée consacrée à la louange.'],
  ]
  for (const [i, [title, summary]] of base.entries()) {
    const startsAt = new Date(Date.UTC(2026, 9, 24 + i * 7, 23, 0))
    await payload.create({
      collection: 'events',
      data: { title, summary, startsAt: startsAt.toISOString(), timeToConfirm: true, location: 'Québec, Québec', _status: 'published' },
    })
  }
}

if ((await payload.count({ collection: 'sermons' })).totalDocs === 0) {
  await payload.create({
    collection: 'sermons',
    data: {
      title: 'Marcher par la foi dans un monde incertain',
      preacher: 'Pasteur (Nom à confirmer)',
      series: 'Une foi qui transforme',
      date: new Date().toISOString(),
      featured: true,
      _status: 'published',
    },
  })
}

payload.logger.info('Contenu de démonstration prêt.')
process.exit(0)
