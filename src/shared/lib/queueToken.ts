export type QueueTurn = {
  queueToken: string
  enabledUntil: string
}

const KEY_PREFIX = 'ticketya.queueToken.'

function storageKey(eventId: number): string {
  return `${KEY_PREFIX}${eventId}`
}

export function saveQueueTurn(eventId: number, turn: QueueTurn): void {
  try {
    sessionStorage.setItem(storageKey(eventId), JSON.stringify(turn))
  } catch {
    // Si sessionStorage no está disponible, ignoramos sin romper el flujo.
  }
}

export function getQueueTurn(eventId: number, nowMs: number = Date.now()): QueueTurn | null {
  try {
    const raw = sessionStorage.getItem(storageKey(eventId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<QueueTurn>
    if (typeof parsed.queueToken !== 'string' || typeof parsed.enabledUntil !== 'string') {
      return null
    }
    const expiresMs = Date.parse(parsed.enabledUntil)
    if (Number.isNaN(expiresMs) || expiresMs <= nowMs) {
      sessionStorage.removeItem(storageKey(eventId))
      return null
    }
    return { queueToken: parsed.queueToken, enabledUntil: parsed.enabledUntil }
  } catch {
    return null
  }
}

export function clearQueueTurn(eventId: number): void {
  try {
    sessionStorage.removeItem(storageKey(eventId))
  } catch {
    // Sin acción si sessionStorage no está disponible.
  }
}
