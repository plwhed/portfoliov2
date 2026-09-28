import { useEffect, useState } from 'react'

const VISIT_KEY = 'portfolio_visited_today'
const VISIT_COUNT_KEY = 'portfolio_visit_count'
const VISIT_DATE_KEY = 'portfolio_visit_date'

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

export default function VisitorCounter() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const today = getTodayString()
    const fallbackCount = parseInt(window.localStorage.getItem(VISIT_COUNT_KEY) || '0', 10)

    if (window.localStorage.getItem(VISIT_DATE_KEY) !== today) {
      window.localStorage.setItem(VISIT_DATE_KEY, today)
      window.localStorage.setItem(VISIT_KEY, 'false')
    }
    const alreadyCounted = window.localStorage.getItem(VISIT_KEY) === 'true'

    async function load() {
      try {
        if (!alreadyCounted) {
          const r = await fetch('/api/visits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: today }),
          })
          if (!r.ok) throw new Error(`visits POST ${r.status}`)
          const data = await r.json()
          if (!cancelled && typeof data.count === 'number') {
            setCount(data.count)
            window.localStorage.setItem(VISIT_COUNT_KEY, String(data.count))
          }
          window.localStorage.setItem(VISIT_KEY, 'true')
        } else {
          const r = await fetch(`/api/visits?date=${today}`, { cache: 'no-store' })
          if (!r.ok) throw new Error(`visits GET ${r.status}`)
          const data = await r.json()
          if (!cancelled && typeof data.count === 'number') {
            setCount(data.count)
            window.localStorage.setItem(VISIT_COUNT_KEY, String(data.count))
          }
        }
      } catch {
        // Offline or API not available: fall back to the local once-per-day count.
        if (!cancelled) {
          if (!alreadyCounted) {
            const newCount = fallbackCount + 1
            window.localStorage.setItem(VISIT_COUNT_KEY, String(newCount))
            window.localStorage.setItem(VISIT_KEY, 'true')
            setCount(newCount)
          } else {
            setCount(fallbackCount)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return null

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 px-6 py-3 sm:px-6 sm:py-3">
      <p className=" text-[11px] leading-none text-neutral-500 dark:text-neutral-500">
        today we got ~{count} visitor{count !== 1 ? 's' : ''}
      </p>
    </footer>
  )
}