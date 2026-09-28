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
    const today = getTodayString()
    const lastVisitDate = window.localStorage.getItem(VISIT_DATE_KEY)
    const storedCount = parseInt(window.localStorage.getItem(VISIT_COUNT_KEY) || '0', 10)
    const hasVisitedToday = window.localStorage.getItem(VISIT_KEY) === 'true'

    if (lastVisitDate !== today) {
      window.localStorage.setItem(VISIT_DATE_KEY, today)
      window.localStorage.setItem(VISIT_KEY, 'false')
    }

    if (!hasVisitedToday) {
      const newCount = storedCount + 1
      window.localStorage.setItem(VISIT_COUNT_KEY, newCount.toString())
      window.localStorage.setItem(VISIT_KEY, 'true')
      setCount(newCount)
    } else {
      setCount(storedCount)
    }
    setLoading(false)
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