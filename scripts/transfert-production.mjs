// Copie le contenu du site local (base + photos + documents) vers la production (Supabase).
// À lancer UNE fois, depuis l’ordinateur où le site tourne en local, avant d’annoncer le site.
//
// Prérequis :
//   - .env                   : la base locale (DATABASE_URL) — celle qui contient le contenu à copier
//   - .env.production.local  : les valeurs de production (voir .env.production.example) — jamais publié sur GitHub
//
// Usage : node scripts/transfert-production.mjs
//
// Étapes : 1) exporte la base locale  2) crée les tables en production (migrations)
//          3) y importe le contenu (remplace ce qui s’y trouve)  4) envoie media/ et documents/ dans Supabase Storage
import { spawnSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import readline from 'readline/promises'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (file) => {
  const full = path.join(root, file)
  if (!fs.existsSync(full)) throw new Error(`Fichier manquant : ${file}`)
  return dotenv.parse(fs.readFileSync(full))
}
const local = read('.env')
const prod = read('.env.production.local')

for (const key of ['DATABASE_URL', 'PAYLOAD_SECRET', 'S3_BUCKET', 'S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']) {
  if (!prod[key]) throw new Error(`${key} est vide dans .env.production.local`)
}
if (!local.DATABASE_URL) throw new Error('DATABASE_URL est vide dans .env')
if (local.DATABASE_URL === prod.DATABASE_URL) throw new Error('La base locale et la base de production sont identiques.')

const host = (url) => new URL(url).host
console.log(`Base locale       : ${host(local.DATABASE_URL)}`)
console.log(`Base de production : ${host(prod.DATABASE_URL)}`)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const answer = await rl.question('Le contenu de la production sera remplacé par le contenu local. Continuer ? (oui/non) ')
rl.close()
if (answer.trim().toLowerCase() !== 'oui') process.exit(0)

const run = (label, cmd, args, env) => {
  console.log(`\n▶ ${label}`)
  const result = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env } })
  if (result.status !== 0) throw new Error(`Échec : ${label}`)
}

const dump = path.join(os.tmpdir(), `mkmi-transfert-${Date.now()}.json`)
try {
  run('Export de la base locale', process.execPath, ['scripts/export-data.mjs', dump], { DATABASE_URL: local.DATABASE_URL })
  run('Création des tables en production', 'npx', ['--yes', 'pnpm@10', 'payload', 'migrate'], {
    ...prod,
    NODE_OPTIONS: '--no-deprecation',
  })
  run('Import du contenu en production', process.execPath, ['scripts/import-data.mjs', dump], {
    DATABASE_URL: prod.DATABASE_URL,
  })
} finally {
  fs.rmSync(dump, { force: true }) // la sauvegarde contient des données privées
}

// Les fichiers vont là où Payload les cherche : <collection>/<nom du fichier>
const s3 = new S3Client({
  endpoint: prod.S3_ENDPOINT,
  region: prod.S3_REGION || 'ca-central-1',
  forcePathStyle: true,
  credentials: { accessKeyId: prod.S3_ACCESS_KEY_ID, secretAccessKey: prod.S3_SECRET_ACCESS_KEY },
})
const types = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.avif': 'image/avif', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.txt': 'text/plain', '.csv': 'text/csv',
}
for (const folder of ['media', 'documents']) {
  const dir = path.join(root, folder)
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile() && !f.startsWith('.'))
  console.log(`\n▶ Envoi de ${files.length} fichiers de ${folder}/ vers Supabase Storage`)
  for (const file of files) {
    await s3.send(
      new PutObjectCommand({
        Bucket: prod.S3_BUCKET,
        Key: `${folder}/${file}`,
        Body: fs.readFileSync(path.join(dir, file)),
        ContentType: types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      }),
    )
  }
}
console.log('\nTransfert terminé. Ouvrez le site en ligne et connectez-vous à /admin avec votre compte habituel.')
