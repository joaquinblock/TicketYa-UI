const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

const relativeTime = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' })

/** "hace 5 minutos", "hace 2 horas", "anteayer": cuándo llegó el aviso, contado desde `now`. */
export function formatNotificationTime(createdAt: string, now: Date = new Date()): string {
  const elapsedMs = now.getTime() - new Date(createdAt).getTime()
  if (elapsedMs < HOUR_MS) {
    return relativeTime.format(-Math.max(1, Math.round(elapsedMs / MINUTE_MS)), 'minute')
  }
  if (elapsedMs < DAY_MS) return relativeTime.format(-Math.round(elapsedMs / HOUR_MS), 'hour')
  return relativeTime.format(-Math.round(elapsedMs / DAY_MS), 'day')
}
