import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const LIKE_KEY = 'portfolio_liked'
const COUNT_KEY = 'portfolio_like_count'

export default function LikeButton() {
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedCount = parseInt(window.localStorage.getItem(COUNT_KEY) || '0', 10)
    const storedLiked = window.localStorage.getItem(LIKE_KEY) === 'true'
    setCount(storedCount)
    setLiked(storedLiked)
    setLoading(false)
  }, [])

  const handleClick = () => {
    if (loading) return
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : Math.max(0, count - 1)
    setLiked(newLiked)
    setCount(newCount)
    window.localStorage.setItem(LIKE_KEY, newLiked.toString())
    window.localStorage.setItem(COUNT_KEY, newCount.toString())
  }

  if (loading) {
    return (
      <button
        type="button"
        aria-label="Like"
        disabled
        className="flex h-9 items-center gap-1.5 rounded-[10px] bg-[#1e1e1e] px-3 text-white"
      >
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 opacity-50" />
        <span className="text-[13px] font-semibold tabular-nums leading-none">
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
      className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[10px] bg-[#1e1e1e] px-3 text-white transition-colors hover:bg-[#2a2a2a] active:scale-95"
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-[13px] font-semibold tabular-nums leading-none">
        {count.toLocaleString('en-US')}
      </span>
    </button>
  )
}