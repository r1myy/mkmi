// Restaure une sauvegarde créée par export-data.mjs dans une base où le schéma existe déjà
// (lancer d’abord `npx pnpm@10 payload migrate`). Remplace le contenu des tables présentes dans la sauvegarde.
// Usage : node scripts/import-data.mjs sauvegarde.json
import fs from 'fs'
import pg from 'pg'
import 'dotenv/config'

const file = process.argv[2] || 'sauvegarde.json'
const { tables } = JSON.parse(fs.readFileSync(file, 'utf8'))
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rows: existing } = await client.query(
  "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE'",
)
const present = new Set(existing.map((r) => r.table_name))
await client.query('begin')
await client.query("set session_replication_role = 'replica'") // ignore l’ordre des clés étrangères pendant l’import
let count = 0
for (const [table, rows] of Object.entries(tables)) {
  if (!present.has(table) || table === 'payload_migrations') continue
  await client.query(`delete from "${table}"`)
  const { rows: cols } = await client.query(
    'select column_name, data_type from information_schema.columns where table_schema = $1 and table_name = $2',
    ['public', table],
  )
  const types = new Map(cols.map((c) => [c.column_name, c.data_type]))
  for (const row of rows) {
    const keys = Object.keys(row).filter((k) => types.has(k))
    const values = keys.map((k) => (types.get(k) === 'jsonb' || types.get(k) === 'json') && row[k] !== null ? JSON.stringify(row[k]) : row[k])
    await client.query(
      `insert into "${table}" (${keys.map((k) => `"${k}"`).join(', ')}) values (${keys.map((_, i) => `$${i + 1}`).join(', ')})`,
      values,
    )
    count++
  }
}
await client.query("set session_replication_role = 'origin'")
await client.query('commit')
// Remet les compteurs d’identifiants à jour (hors transaction : une table sans compteur n’annule rien)
for (const table of Object.keys(tables)) {
  if (!present.has(table)) continue
  const { rows: seq } = await client.query("select pg_get_serial_sequence($1, 'id') as s", [`"${table}"`]).catch(() => ({ rows: [] }))
  if (seq[0]?.s) await client.query(`select setval($1, coalesce((select max(id) from "${table}"), 1))`, [seq[0].s])
}
await client.end()
console.log(`${count} lignes restaurées depuis ${file}`)
