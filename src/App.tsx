import { useState } from 'react'
import DemoBackground from '@/components/ui/demo'
import { Component as SpotlightCursor } from '@/components/ui/spotlight-cursor'
import ThemeToggle from '@/components/theme-toggle'
import Presence from '@/components/presence'
import Info from '@/components/info'
import Work from '@/components/work'
import Contact from '@/components/contact'
import Recommendations from '@/components/recommendations'

const LINKS = ['info', 'work', 'contact', 'recommendations'] as const

export default function App() {
  const [active, setActive] = useState<string>('info')

  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-white dark:bg-black">
      <DemoBackground />

      <header className="relative z-50 px-6 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-black dark:text-white">
            mario
          </span>
          <ThemeToggle />
        </div>
        <Presence />
        <nav className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] leading-none">
          {LINKS.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => setActive(link)}
              aria-current={active === link ? 'page' : undefined}
              className={
                'cursor-pointer ' +
                (active === link
                  ? 'text-black underline underline-offset-4 dark:text-white'
                  : 'text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300')
              }
            >
              {link}
            </button>
          ))}
        </nav>
        <div key={active} className="section-in">
          {active === 'work' ? (
            <Work />
          ) : active === 'contact' ? (
            <Contact />
          ) : active === 'recommendations' ? (
            <Recommendations />
          ) : (
            <Info />
          )}
        </div>
      </header>

      <SpotlightCursor />

    </div>
  )
}
