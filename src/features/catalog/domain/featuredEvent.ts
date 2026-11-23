import type { EventSummary } from '../types/catalog.types'

export type FeaturedCountdown = {
  hh: string
  mm: string
  ss: string
}

const MS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600

/**
 * Elige el evento destacado del hero: primero un publicado de alta demanda cuya venta aún no abrió;
 * si no hay, un publicado de alta demanda o el próximo publicado.
 */
export function pickFeaturedEvent(
  events: EventSummary[],
  nowMs: number = Date.now(),
): EventSummary | undefined {
  const published = events.filter((event) => event.status === 'PUBLISHED')
  if (published.length === 0) return undefined

  const upcomingHighDemand = published.find(
    (event) => event.highDemand && isFutureDate(event.saleStart, nowMs),
  )
  if (upcomingHighDemand) return upcomingHighDemand

  return published.find((event) => event.highDemand) ?? published[0]
}

/** Calcula `HH:MM:SS` hasta `saleStart`, o `null` si ya pasó o es inválido. */
export function formatFeaturedCountdown(
  saleStart: string | null,
  nowMs: number = Date.now(),
): FeaturedCountdown | null {
  if (!saleStart) return null
  const targetMs = Date.parse(saleStart)
  if (Number.isNaN(targetMs) || targetMs <= nowMs) return null

  const totalSeconds = Math.floor((targetMs - nowMs) / MS_PER_SECOND)
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR)
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const seconds = totalSeconds % SECONDS_PER_MINUTE

  return {
    hh: String(hours).padStart(2, '0'),
    mm: String(minutes).padStart(2, '0'),
    ss: String(seconds).padStart(2, '0'),
  }
}

function isFutureDate(isoDate: string | null, nowMs: number): boolean {
  if (!isoDate) return false
  const parsed = Date.parse(isoDate)
  return !Number.isNaN(parsed) && parsed > nowMs
}
