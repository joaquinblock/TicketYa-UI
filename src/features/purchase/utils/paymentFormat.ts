import type { OrderTicket, OrderTicketLine } from '../types/payment.types'

const SECONDS_PER_MINUTE = 60
const MS_PER_SECOND = 1000

/**
 * Parsea un `LocalDateTime` sin zona (`2026-11-23T17:09:42`) en hora local del navegador
 * y devuelve cuántos segundos faltan hasta ese instante (0 si ya venció).
 */
export function getRemainingSeconds(expiresAt: string, nowMs: number = Date.now()): number {
  const [date, time = '00:00:00'] = expiresAt.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour = 0, minute = 0, second = 0] = time.split(':').map(Number)
  const expiresMs = new Date(year, month - 1, day, hour, minute, second).getTime()
  return Math.max(0, Math.floor((expiresMs - nowMs) / MS_PER_SECOND))
}

/** Formatea segundos restantes como `MM:SS` con dos dígitos en cada parte. */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / SECONDS_PER_MINUTE)
  const seconds = safe % SECONDS_PER_MINUTE
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function joinSeatNumbers(numbers: number[]): string {
  const sorted = [...numbers].sort((a, b) => a - b)
  if (sorted.length === 1) return `asiento ${sorted[0]}`
  const head = sorted.slice(0, -1).join(', ')
  return `asientos ${head} y ${sorted[sorted.length - 1]}`
}

/** Agrupa las entradas de una orden para el resumen lateral tipo ticket. */
export function summarizeOrderTickets(tickets: OrderTicket[]): OrderTicketLine[] {
  const groups = new Map<
    string,
    { sectorName: string; row: string | null; numbers: number[]; count: number; subtotal: number }
  >()

  for (const ticket of tickets) {
    const isNumbered = ticket.row != null && ticket.number != null
    const key = isNumbered
      ? `${ticket.eventSectorId}-${ticket.row}`
      : `${ticket.eventSectorId}-general`
    const existing = groups.get(key)
    if (existing) {
      if (isNumbered && ticket.number != null) existing.numbers.push(ticket.number)
      existing.count += 1
      existing.subtotal += ticket.price
    } else {
      groups.set(key, {
        sectorName: ticket.sectorName,
        row: isNumbered ? ticket.row : null,
        numbers: isNumbered && ticket.number != null ? [ticket.number] : [],
        count: 1,
        subtotal: ticket.price,
      })
    }
  }

  return Array.from(groups.entries()).map(([key, group]) => ({
    key,
    label:
      group.row != null
        ? `${group.sectorName} · Fila ${group.row}, ${joinSeatNumbers(group.numbers)}`
        : `${group.sectorName} × ${group.count}`,
    subtotal: group.subtotal,
  }))
}
