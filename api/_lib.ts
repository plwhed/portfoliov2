import type { VercelRequest } from '@vercel/node'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  return neon(url)
}

export function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return raw?.split(',')[0]?.trim() || 'unknown'
}

// Best-effort in-memory throttle (resets when the function instance recycles).
const hits = new Map<string, number[]>()

export function throttled(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > limit
}
