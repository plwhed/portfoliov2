import { ArrowUpRight } from 'lucide-react'

type Entry = {
  title: string
  href: string
  meta: string
  body: string
}

const ENTRIES: Entry[] = [
  {
    title: 'lethal',
    href: 'https://lethal.wtf',
    meta: 'collaboration • developer',
    body: 'lethal.wtf is a bio-link platform for creators to showcase their content and connect with their audience. i work on the backend and infrastructure that powers the platform, ensuring it is reliable and scalable.',
  },
  {
    title: 'fearswap',
    href: 'https://fearswap.com',
    meta: 'friend',
    body: 'fearswap is a decentralized exchange (dex) for swapping tokens on the ethereum blockchain. i have known the founder for years and we have collaborated on various projects together.',
  }
]

export default function Recommendations() {
  return (
    <div
      id="recommendations"
      className="mt-5 flex w-full max-w-3xl flex-col gap-5 text-[12.5px] leading-[1.5] text-neutral-700 dark:text-neutral-300"
    >
      <p>
        people and sites i work with, learn from, or simply think are worth your
        time.
      </p>

      {ENTRIES.map((entry) => (
        <article key={entry.title} className="flex flex-col gap-1.5">
          <h3 className="leading-none">
            <a
              href={entry.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-black hover:underline dark:text-white"
            >
              {entry.title}
              <ArrowUpRight
                aria-hidden="true"
                className="h-3 w-3 text-neutral-500"
                strokeWidth={2}
              />
            </a>
          </h3>

          <p className="text-[10px] leading-none text-neutral-500 dark:text-neutral-500">
            {entry.meta}
          </p>

          <p>{entry.body}</p>

        
        </article>
      ))}
    </div>
  )
}
