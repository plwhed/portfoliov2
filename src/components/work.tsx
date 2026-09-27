import { ArrowUpRight } from 'lucide-react'

type Project = {
  title: string
  meta: string
  href?: string
  body: string
  tech: string
}

const PROJECTS: Project[] = [
  {
    title: 'lethal.wtf',
    meta: '2026 - present • bio-link platform',
    href: 'https://lethal.wtf',
    body: 'a bio-link platform for creators to showcase their content and connect with their audience.',
    tech: 'html, css, javascript, php, mysql, apache, api, rest apis, webhooks, cloudflare workers',
  },
  {
    title: 'sinister.wtf',
    meta: '2026 - 2026 • bio-link platform',
    href: 'https://sinister.wtf',
    body: 'a bio-link platform for creators to showcase their content and connect with their audience.',
    tech: 'react js, node.js, javascript, postgresql, cloudflare workers, rest apis, webhooks',
  },
  {
    title: 'egirls.lol',
    meta: '2026 - 2026 • bio-link platform',
    href: 'https://github.com/plwhed/egirls.lol',
    body: 'a bio-link platform for creators to showcase their content and connect with their audience.',
    tech: 'react js, node.js, javascript, postgresql, cloudflare workers, rest apis, webhooks',
  },
  {
    title: 'sclavi.online',
    meta: '2026 - 2026 • paste platform',
    href: 'https://sclavi.online',
    body: 'a paste platform for sharing text and images.',
    tech: 'php, html, mysql',
  },
  {
    title: 'astral.rest',
    meta: '2026 - 2026 • portfolio',
    href: 'https://astral.rest',
    body: 'a portfolio website for showcasing my own work.',
    tech: 'react js, node.js, javascript',
  },

]

export default function Work() {
  return (
    <div
      id="work"
      className="mt-5 flex w-full max-w-3xl flex-col gap-5 text-[12.5px] leading-[1.5] text-neutral-700 dark:text-neutral-300"
    >
      {PROJECTS.map((project) => (
        <article key={project.title} className="flex flex-col gap-1.5">
          <h3 className="flex items-center gap-1 text-[12.5px] font-semibold leading-none text-black dark:text-white">
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                {project.title}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3 w-3 text-neutral-500"
                  strokeWidth={2}
                />
              </a>
            ) : (
              project.title
            )}
          </h3>

          <p className="text-[10px] leading-none text-neutral-500 dark:text-neutral-500">
            {project.meta}
          </p>

          <p>{project.body}</p>

          <p className="text-[10.5px] leading-none text-neutral-500 dark:text-neutral-500">
            tech: {project.tech}
          </p>
        </article>
      ))}
    </div>
  )
}
