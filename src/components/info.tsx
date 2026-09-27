import Heatmap from '@/components/heatmap'

const SKILLS =
  'typescript, javascript, react, next.js, node.js, express, python, postgresql, neondb,  rest apis, git, vercel, git, github'

const SPECIALIZATIONS =
  'discord bot development, web platform development, high-availability infrastructure, real-time applications, api design, database optimization, user authentication systems'

const INTERESTS =
  'building at scale, community tools, developer experience, system design, reliability engineering, performance optimization, product development, indie software'

const WORK = [
  {
    title: 'co-founder & developer • lethal.wtf',
    meta: '2026 - present',
    body: 'building, updating and managing lethal.wtf (600+ users & 20k+ views). responsible for the backend, api, and database. implementing new features, fixing bugs, and ensuring the platform is reliable and scalable.',
  },
  { 
    title: 'high school student',
    meta: 'ro high school • current',
    body: '',
  },
]

function Label({ children }: { children: string }) {
  return (
    <p className="mb-1.5 text-[10px] leading-none text-neutral-500 dark:text-neutral-500">
      {children}
    </p>
  )
}

export default function Info() {
  return (
    <div
      id="info"
      className="mt-5 flex w-full max-w-3xl flex-col gap-4 text-[12.5px] leading-[1.5] text-neutral-700 dark:text-neutral-300"
    >
      <div className="flex flex-col gap-3.5">
        <p>
          founder and developer at lethal.wtf. i build websites that scale to
          hundreds of users, discord bots, and infrastructure that
          powers communities. focused on creating reliable systems that people
          can trust with their communities and content.
        </p>
        <p>
          i&rsquo;ve been building software for 5 years now but without making them public. my work
          is based on quality and reliability, and i take pride in creating software that is
          well-designed, efficient, and easy to use. i enjoy working on projects that challenge me to learn new things and push the boundaries of what is possible.
        </p>
      </div>

      <div>
        <Label>technical skills</Label>
        <p>{SKILLS}</p>
      </div>

      <div>
        <Label>specializations</Label>
        <p>{SPECIALIZATIONS}</p>
      </div>

      <div>
        <Label>interests</Label>
        <p>{INTERESTS}</p>
      </div>

      <div>
        <Label>current work</Label>
        <div className="flex flex-col gap-4">
          {WORK.map((item) => (
            <div key={item.title} className="flex flex-col gap-1.5">
              <div className="flex flex-col gap-1">
                <h3 className="text-[12.5px] font-semibold leading-none text-black dark:text-white">
                  {item.title}
                </h3>
                <p className="text-[10px] leading-none text-neutral-500 dark:text-neutral-500">
                  {item.meta}
                </p>
              </div>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        {/* <Label>github contributions</Label> */}
        <Heatmap />
      </div>
    </div>
  )
}
