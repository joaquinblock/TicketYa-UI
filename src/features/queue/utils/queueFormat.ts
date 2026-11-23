import { QUEUE_BATCH_SECONDS, QUEUE_BATCH_SIZE } from '../constants/queue.constants'

const SECONDS_PER_MINUTE = 60

/** Estima la espera en texto legible según `100 personas cada 30 segundos`. */
export function formatEstimatedWait(position: number): string {
  if (position <= 0) return 'menos de 1 min'
  const batches = Math.ceil(position / QUEUE_BATCH_SIZE)
  const totalSeconds = batches * QUEUE_BATCH_SECONDS
  if (totalSeconds < SECONDS_PER_MINUTE) return 'menos de 1 min'
  const minutes = Math.ceil(totalSeconds / SECONDS_PER_MINUTE)
  return `${minutes} min`
}

/** Calcula el porcentaje de avance de la barra entre la posición inicial y la actual. */
export function getQueueProgressPercent(initialPosition: number, currentPosition: number): number {
  if (initialPosition <= 0) return 100
  const advanced = Math.max(0, initialPosition - currentPosition)
  return Math.min(100, Math.round((advanced / initialPosition) * 100))
}

/** Formatea `enabledUntil` (ISO Instant) como `HH:MM` en hora local del navegador. */
export function formatEnabledUntilTime(enabledUntil: string): string {
  const date = new Date(enabledUntil)
  if (Number.isNaN(date.getTime())) return '--:--'
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/** Indica si la ventana de turno (`enabledUntil`) ya venció respecto de `nowMs`. */
export function isTurnExpired(enabledUntil: string | null, nowMs: number = Date.now()): boolean {
  if (!enabledUntil) return false
  const expiresMs = Date.parse(enabledUntil)
  return !Number.isNaN(expiresMs) && expiresMs <= nowMs
}
