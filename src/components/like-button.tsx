import { Star } from 'lucide-react'
import { useEffect, useState, type CSSProperties } from 'react'

const LIKE_KEY = 'portfolio_liked'
const COUNT_KEY = 'portfolio_like_count'

const PARTICLES = [
  { tx: '20px', ty: '-8px', size: 8, delay: '0s' },
  { tx: '14px', ty: '-18px', size: 6, delay: '0.03s' },
  { tx: '-2px', ty: '-22px', size: 7, delay: '0.06s' },
  { tx: '-16px', ty: '-14px', size: 6, delay: '0.02s' },
  { tx: '-20px', ty: '4px', size: 8, delay: '0.05s' },
  { tx: '-10px', ty: '18px', size: 6, delay: '0.01s' },
  { tx: '8px', ty: '20px', size: 7, delay: '0.04s' },
  { tx: '22px', ty: '10px', size: 6, delay: '0.07s' },
]

export default function LikeButton() {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [popKey, setPopKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [bursting, setBursting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fallbackCount = parseInt(window.localStorage.getItem(COUNT_KEY) || '0', 10)

    async function load() {
      try {
        const r = await fetch('/api/likes', { cache: 'no-store' })
        if (!r.ok) throw new Error(`likes GET ${r.status}`)
        const data = await r.json()
        if (!cancelled && typeof data.count === 'number') {
          setCount(data.count)
          window.localStorage.setItem(COUNT_KEY, String(data.count))
        }
      } catch {
        // Offline or API not available (e.g. local `vite dev`): use last known count.
        if (!cancelled) setCount(fallbackCount)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    setLiked(window.localStorage.getItem(LIKE_KEY) === 'true')
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (burstKey === 0) return
    setBursting(true)
    const t = setTimeout(() => setBursting(false), 750)
    return () => clearTimeout(t)
  }, [burstKey])

  const handleClick = async () => {
    if (loading) return
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1)
    setLiked(newLiked)
    setCount(newCount)
    setPopKey((k) => k + 1)
    if (newLiked) setBurstKey((k) => k + 1)
    window.localStorage.setItem(LIKE_KEY, newLiked.toString())
    try {
      const r = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ op: newLiked ? 'like' : 'unlike' }),
      })
      if (!r.ok) throw new Error(`likes POST ${r.status}`)
      const data = await r.json()
      if (typeof data.count === 'number') {
        setCount(data.count)
        window.localStorage.setItem(COUNT_KEY, String(data.count))
      }
    } catch {
      // API unreachable: keep the optimistic count locally.
      window.localStorage.setItem(COUNT_KEY, newCount.toString())
    }
  }

  if (loading) {
    return (
      <button
        type="button"
        aria-label="Like"
        disabled
        className="flex h-7 items-center gap-1 rounded-lg bg-[#1e1e1e] px-2 text-white"
      >
        <Star className="h-3 w-3 fill-amber-400 text-amber-400 opacity-50" />
        <span className="text-[12px] font-semibold tabular-nums leading-none">
          0
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={liked ? 'Unlike' : 'Like'}
      aria-pressed={liked}
      onClick={handleClick}
      className="group flex h-7 cursor-pointer items-center gap-1 rounded-lg bg-[#1e1e1e] px-2 text-white transition-colors hover:bg-[#2a2a2a] active:scale-95"
    >
      <span className={`relative grid place-items-center ${liked ? 'like-star-idle' : ''}`}>
        <Star
          key={popKey}
          className={`h-3 w-3 fill-amber-400 text-amber-400 transition-transform duration-200 group-hover:rotate-[20deg] group-hover:scale-110 ${popKey > 0 ? 'like-star-pop' : ''}`}
        />
        {bursting && (
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
            {PARTICLES.map((p, i) => (
              <Star
                key={`${burstKey}-${i}`}
                className="like-burst-particle absolute fill-amber-300 text-amber-300"
                style={
                  {
                    width: p.size,
                    height: p.size,
                    '--tx': p.tx,
                    '--ty': p.ty,
                    animationDelay: p.delay,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        )}
      </span>
      <span
        key={count}
        className="like-count-bump text-[12px] font-semibold tabular-nums leading-none"
      >
        {count.toLocaleString('en-US')}
      </span>
    </button>
  )
}