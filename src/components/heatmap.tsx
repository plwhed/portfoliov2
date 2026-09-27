import { useEffect, useState } from 'react'

const GITHUB_USER = 'plwhed'
const API_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}`
const PROFILE_URL = `https://github.com/${GITHUB_USER}`

type Contribution = { date: string; count: number; level: number }

type Cell = { date: string; count: number; level: number }

const SCALE = [
  'bg-neutral-200 dark:bg-neutral-900',
  'bg-neutral-300 dark:bg-neutral-800',
  'bg-neutral-500 dark:bg-neutral-600',
  'bg-neutral-700 dark:bg-neutral-400',
  'bg-neutral-900 dark:bg-neutral-200',
]

function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function buildGrid(contributions: Contribution[]) {
  const levels = new Map(contributions.map((c) => [c.date, c]))

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = new Date(today)
  start.setDate(start.getDate() - 364)
  start.setDate(start.getDate() - start.getDay())

  const weeks: Cell[][] = []
  let week: Cell[] = []
  let total = 0

  for (const cursor = new Date(start); cursor <= today; cursor.setDate(cursor.getDate() + 1)) {
    const key = dateKey(cursor)
    const entry = levels.get(key)
    const cell: Cell = {
      date: key,
      count: entry?.count ?? 0,
      level: entry?.level ?? 0,
    }
    total += cell.count
    week.push(cell)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) weeks.push(week)

  return { weeks, total }
}

export default function Heatmap() {
  const [contributions, setContributions] = useState<Contribution[]>([])

  useEffect(() => {
    let active = true

    fetch(API_URL, { cache: 'force-cache' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('request failed'))))
      .then((json) => {
        if (active && Array.isArray(json?.contributions)) {
          setContributions(json.contributions as Contribution[])
        }
      })
      .catch(() => {
        // leave the grid empty
      })

    return () => {
      active = false
    }
  }, [])

  const { weeks, total } = buildGrid(contributions)

  return (
    <div className="flex flex-col gap-2">
      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noreferrer"
        className="w-fit text-[10.5px] leading-none text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        {total} contribution{total === 1 ? '' : 's'} in the last year on github
      </a>

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex w-max gap-[3px]">
          {weeks.map((days, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {days.map((cell) => (
                <span
                  key={cell.date}
                  title={`${cell.count} contribution${cell.count === 1 ? '' : 's'} on ${cell.date}`}
                  className={`h-2.5 w-2.5 rounded-[2px] ${SCALE[cell.level] ?? SCALE[0]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
