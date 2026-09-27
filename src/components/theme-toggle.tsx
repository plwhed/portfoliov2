import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="flex h-9 w-9 items-center justify-center rounded-full  bg-white text-black transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
