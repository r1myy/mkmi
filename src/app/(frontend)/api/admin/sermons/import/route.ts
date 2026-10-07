import config from '@payload-config'
import { getPayload } from 'payload'

const BACK = '/admin/collections/sermons'
const MAX_BYTES = 1024 * 1024
const MAX_ROWS = 500

const back = (req: Request, params: Record<string, string>) =>
  Response.redirect(new URL(`${BACK}?${new URLSearchParams(params)}`, req.url), 303)

/** Découpe un CSV (séparateur ; ou ,) en tenant compte des guillemets. */
function parseCsv(text: string): string[][] {
  const first = text.split(/\r?\n/, 1)[0] ?? ''
  const sep = (first.match(/;/g)?.length ?? 0) >= (first.match(/,/g)?.length ?? 0) ? ';' : ','
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  const endRow = () => {
    row.push(field)
    rows.push(row)
    row = []
    field = ''
  }
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === sep) {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      endRow()
    } else field += c
  }
  if (field || row.length) endRow()
  return rows.filter((r) => r.some((v) => v.trim()))
}

const key = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '')
const aliases: Record<string, string> = {
  titre: 'title', title: 'title',
  predicateur: 'preacher', preacher: 'preacher',
  date: 'date',
  serie: 'series', series: 'series',
  categorie: 'category', category: 'category',
  duree: 'duration', duration: 'duration',
  youtube: 'youtubeUrl', lienyoutube: 'youtubeUrl', video: 'youtubeUrl',
  balado: 'podcastUrl', podcast: 'podcastUrl',
}

/** Importe des messages depuis un fichier CSV : chaque ligne devient un brouillon à relire. */
export async function POST(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  const role = (user as { role?: string } | null)?.role
  if (!user || (role !== 'admin' && role !== 'editor')) return new Response('Accès refusé', { status: 403 })

  const file = (await req.formData().catch(() => null))?.get('fichier')
  if (!(file instanceof File) || file.size === 0) return back(req, { import: 'vide' })
  if (file.size > MAX_BYTES) return back(req, { import: 'trop-gros' })

  const [header, ...lines] = parseCsv((await file.text()).replace(/^﻿/, ''))
  const cols = (header ?? []).map((h) => aliases[key(h)])
  if (!cols.includes('title') || !cols.includes('date')) return back(req, { import: 'colonnes' })

  let created = 0
  let skipped = 0
  for (const line of lines.slice(0, MAX_ROWS)) {
    const data: Record<string, string> = {}
    cols.forEach((c, i) => {
      if (c && line[i]?.trim()) data[c] = line[i].trim()
    })
    const date = data.date && !Number.isNaN(Date.parse(data.date)) ? new Date(`${data.date.slice(0, 10)}T12:00:00Z`) : null
    if (!data.title || !date || Number.isNaN(date.getTime())) {
      skipped++
      continue
    }
    try {
      await payload.create({
        collection: 'sermons',
        draft: true,
        data: { ...data, title: data.title.slice(0, 200), duration: data.duration?.slice(0, 10), date: date.toISOString(), _status: 'draft' },
        user,
        overrideAccess: false,
      })
      created++
    } catch {
      skipped++
    }
  }
  skipped += Math.max(0, lines.length - MAX_ROWS)
  return back(req, { import: 'ok', crees: String(created), ignores: String(skipped) })
}
