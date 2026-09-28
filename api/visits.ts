import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clientIp, getSql, throttled } from './_lib'

function isValidDate(d: unknown): d is string {
  if (typeof d !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false
  const t = Date.parse(d)
  return !Number.isNaN(t)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  try {
    const sql = getSql()

    if (req.method === 'GET') {
      const date = req.query.date
      if (!isValidDate(date)) {
        res.status(400).json({ error: 'Missing ?date=YYYY-MM-DD' })
        return
      }
      const key = `visits:${date}`
      const rows = await sql`select value from counters where key = ${key}`
      res.status(200).json({ date, count: Number(rows[0]?.value ?? 0) })
      return
    }

    if (req.method === 'POST') {
      if (throttled(`visits:${clientIp(req)}`, 10, 60_000)) {
        res.status(429).json({ error: 'Too many requests' })
        return
      }
      const date = req.body?.date
      if (!isValidDate(date)) {
        res.status(400).json({ error: 'Missing { date: YYYY-MM-DD }' })
        return
      }
      const key = `visits:${date}`
      const rows = await sql`
        insert into counters(key, value) values (${key}, 1)
        on conflict (key) do update set value = counters.value + 1
        returning value
      `
      res.status(200).json({ date, count: Number(rows[0].value) })
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('visits api error', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
