import 'server-only'

const buckets = new Map<string, { count: number; reset: number }>()

/**
 * Limiteur simple en mémoire (par instance). Suffisant pour freiner les abus ;
 * à remplacer par un stockage partagé (ex. Upstash) si le trafic l’exige.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k)
    }
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}

export function clientKey(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'local'
}
