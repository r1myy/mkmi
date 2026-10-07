// Exporte tout le contenu de la base PostgreSQL (toutes les tables) dans un fichier JSON.
// Usage : node scripts/export-data.mjs sauvegarde.json   (lit DATABASE_URL dans .env)
import fs from 'fs'
import pg from 'pg'
import 'dotenv/config'

const out = process.argv[2] || 'sauvegarde.json'
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rows: tables } = await client.query(
  "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name",
)
const data = { exportedAt: new Date().toISOString(), tables: {} }
for (const { table_name } of tables) {
  const { rows } = await client.query(`select * from "${table_name}"`)
  data.tables[table_name] = rows
}
await client.end()
fs.writeFileSync(out, JSON.stringify(data))
console.log(`${Object.keys(data.tables).length} tables exportées dans ${out}`)
