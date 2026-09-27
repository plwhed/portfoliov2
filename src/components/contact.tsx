type Channel = {
  label: string
  value: string
  href: string
  suffix?: string
  note: string
}

const CHANNELS: Channel[] = [
  {
    label: 'email',
    value: 'stanculiee@hotmail.com',
    href: 'mailto:stanculiee@hotmail.com',
    note: 'best for business inquiries and partnerships',
  },
  {
    label: 'github',
    value: 'github.com/plwhed',
    href: 'https://github.com/plwhed',
    note: 'check out my code and projects',
  },
]

export default function Contact() {
  return (
    <div
      id="contact"
      className="mt-5 flex w-full max-w-3xl flex-col gap-4 text-[12.5px] leading-[1.5] text-neutral-700 dark:text-neutral-300"
    >
      <p>
        always interested in talking about projects or product ideas.
         feel free to reach out through any of
        these platforms. if you&rsquo;re running a community or building
        something at scale, i&rsquo;d love to hear about it.
      </p>

      <div className="flex flex-col gap-4">
        {CHANNELS.map((channel) => (
          <div key={channel.label} className="flex flex-col gap-1.5">
            <p className="text-[10px] leading-none text-neutral-500 dark:text-neutral-500">
              {channel.label}
            </p>
            <p className="leading-none">
              <a
                href={channel.href}
                target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className="font-medium text-black hover:underline dark:text-white"
              >
                {channel.value}
              </a>
              {channel.suffix ? (
                <span className="text-neutral-500 dark:text-neutral-500">
                  {' '}
                  {channel.suffix}
                </span>
              ) : null}
            </p>
            <p className="text-[10.5px] leading-none text-neutral-500 dark:text-neutral-500">
              {channel.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
