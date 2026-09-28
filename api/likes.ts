import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clientIp, getSql, throttled } from './_lib'

const LIKE_KEY = 'likes'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  try {
    const sql = getSql()

    if (req.method === 'GET') {
      const rows = await sql`select value from counters where key = ${LIKE_KEY}`
      res.status(200).json({ count: Number(rows[0]?.value ?? 0) })
      return
    }

    if (req.method === 'POST') {
      if (throttled(`likes:${clientIp(req)}`, 20, 60_000)) {
        res.status(429).json({ error: 'Too many requests' })
        return
      }
      const op = typeof req.body?.op === 'string' ? req.body.op : 'like'
      const delta = op === 'unlike' ? -1 : 1
      const rows = await sql`
        insert into counters(key, value) values (${LIKE_KEY}, ${delta > 0 ? 1 : 0})
        on conflict (key) do update set value = greatest(0, counters.value + ${delta})
        returning value
      `
      res.status(200).json({ count: Number(rows[0].value) })
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('likes api error', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
