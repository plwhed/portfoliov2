import { useEffect, useState } from 'react'

const DISCORD_ID = '1513959295102746779'
const API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
const WS_URL = 'wss://api.lanyard.rest/socket'
const POLL_INTERVAL = 20000
const MAX_RECONNECT_DELAY = 30000

type Activity = {
  type: number
  name: string
  details?: string | null
  state?: string | null
}

type Presence = {
  discord_user: {
    id: string
    username: string
    global_name?: string | null
    avatar?: string | null
    discriminator?: string
  }
  activities?: Activity[]
  listening_to_spotify?: boolean
  spotify?: {
    track_name?: string
    artist_name?: string
    album_art_url?: string
  } | null
}

type Brand = 'spotify' | 'vscode'

const BRAND_BY_NAME: Record<string, Brand> = {
  Spotify: 'spotify',
  'Visual Studio Code': 'vscode',
}

function BrandIcon({ brand }: { brand: Brand }) {
  if (brand === 'spotify') {
    return (
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label="spotify"
        className="h-3.5 w-3.5 shrink-0"
        fill="#1db954"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="visual studio code"
      className="h-3.5 w-3.5 shrink-0"
      fill="#007acc"
    >
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  )
}

type SocketMessage = {
  op?: number
  t?: string
  d?: Presence & { heartbeat_interval?: number }
}

function avatarUrl(user: Presence['discord_user']) {
  if (user.avatar) {
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=64`
  }
  const index =
    user.discriminator && user.discriminator !== '0'
      ? Number(user.discriminator) % 6
      : Number(BigInt(user.id) >> 22n) % 6
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export default function Presence() {
  const [presence, setPresence] = useState<Presence | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    let socket: WebSocket | null = null
    let heartbeat: number | undefined
    let poll: number | undefined
    let reconnect: number | undefined
    let attempts = 0

    function apply(data: Presence | null | undefined) {
      if (!active || !data) return
      setPresence(data)
      setFailed(false)
    }

    async function load() {
      try {
        const res = await fetch(API_URL, { cache: 'no-store' })
        const json = await res.json()
        if (!active) return
        if (json?.success && json.data) {
          apply(json.data)
        } else {
          setFailed(true)
        }
      } catch {
        if (active) setFailed(true)
      }
    }

    function startPolling() {
      if (poll !== undefined || !active) return
      load()
      poll = window.setInterval(load, POLL_INTERVAL)
    }

    function stopPolling() {
      if (poll === undefined) return
      window.clearInterval(poll)
      poll = undefined
    }

    function closeSocket() {
      if (heartbeat !== undefined) {
        window.clearInterval(heartbeat)
        heartbeat = undefined
      }
      if (!socket) return
      socket.onopen = null
      socket.onmessage = null
      socket.onerror = null
      socket.onclose = null
      try {
        socket.close()
      } catch {
        // noop
      }
      socket = null
    }

    function scheduleReconnect() {
      if (!active || reconnect !== undefined) return
      const delay = Math.min(1000 * 2 ** attempts, MAX_RECONNECT_DELAY)
      attempts += 1
      reconnect = window.setTimeout(() => {
        reconnect = undefined
        connect()
      }, delay)
    }

    function connect() {
      if (!active) return
      stopPolling()
      closeSocket()

      let ws: WebSocket
      try {
        ws = new WebSocket(WS_URL)
      } catch {
        startPolling()
        return
      }
      socket = ws

      ws.onopen = () => {
        attempts = 0
      }

      ws.onmessage = (event) => {
        if (!active) return
        let message: SocketMessage
        try {
          message = JSON.parse(event.data) as SocketMessage
        } catch {
          return
        }

        if (message.op === 1) {
          const interval =
            typeof message.d?.heartbeat_interval === 'number'
              ? message.d.heartbeat_interval
              : 30000
          heartbeat = window.setInterval(() => {
            if (socket?.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }))
            }
          }, interval)
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }))
          return
        }

        if (message.op === 0 && (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE')) {
          apply(message.d)
        }
      }

      ws.onerror = () => {
        // handled by onclose
      }

      ws.onclose = () => {
        if (!active) return
        closeSocket()
        startPolling()
        scheduleReconnect()
      }
    }

    load()
    connect()

    return () => {
      active = false
      stopPolling()
      if (reconnect !== undefined) window.clearTimeout(reconnect)
      closeSocket()
    }
  }, [])

  const user = presence?.discord_user
  const spotify = presence?.spotify ?? null
  const activity = presence?.activities?.find((a) => a.type !== 4)

  const discordText = failed ? 'unavailable' : user ? user.username : 'loading…'

  let listening: {
    primary: string
    secondary?: string
      art?: string
      leading?: Brand
      badge?: Brand
    } | null = null
  if (spotify?.track_name) {
    listening = {
      primary: spotify.track_name,
      secondary: spotify.artist_name,
      art: spotify.album_art_url,
      badge: 'spotify',
    }
  } else if (activity) {
    const brand = BRAND_BY_NAME[activity.name]
    listening = {
      primary: brand ? (activity.details ?? activity.name) : activity.name,
      secondary: activity.state ?? undefined,
      leading: brand === 'vscode' ? 'vscode' : undefined,
      badge: brand === 'spotify' ? 'spotify' : undefined,
    }
  } else if (presence) {
    listening = { primary: 'nothing right now' }
  }

  return (
    <div className="mt-2.5 flex max-w-[calc(100vw-5rem)] items-center gap-x-3 gap-y-1 text-[11px] leading-none">
      <span className="flex min-w-0 items-center gap-1">
        <span className="shrink-0 text-neutral-400 dark:text-neutral-500">discord:</span>
        {user && !failed ? (
          <img
            src={avatarUrl(user)}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden'
            }}
          />
        ) : null}
        <span className="min-w-0 truncate font-medium text-neutral-700 dark:text-neutral-200">
          {discordText}
        </span>
      </span>

      <span className="flex min-w-0 items-center gap-1">
        <span className="shrink-0 text-neutral-400 dark:text-neutral-500">activity:</span>
        {listening ? (
          <>
            {listening.art ? (
              <img
                src={listening.art}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 shrink-0 rounded-[3px] object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            {listening.leading ? <BrandIcon brand={listening.leading} /> : null}
            <span className="min-w-0 truncate text-neutral-700 dark:text-neutral-200">
              {listening.primary}
              {listening.secondary ? (
                <span className="text-neutral-400 dark:text-neutral-500">
                  {' · '}
                  {listening.secondary}
                </span>
              ) : null}
            </span>
            {listening.badge ? <BrandIcon brand={listening.badge} /> : null}
          </>
        ) : (
          <span className="text-neutral-400 dark:text-neutral-500">…</span>
        )}
      </span>
    </div>
  )
}
