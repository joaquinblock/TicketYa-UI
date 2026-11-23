import { MONTH_ABBREVIATIONS } from '../constants/catalog.constants'

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** `$18.000`: sin espacio entre el signo y el número, como en el mockup. */
export function formatPrice(amount: number) {
  return priceFormatter.format(amount).replace(/\s/g, '')
}

/**
 * El backend manda la hora local del evento sin zona (`2026-12-02T22:00:00`). Se lee del texto
 * para no correrla con la zona horaria del navegador.
 */
export function getEventDateParts(dateTime: string) {
  const [date, time] = dateTime.split('T')
  const [year, month, day] = date.split('-')
  return {
    year,
    day,
    month: MONTH_ABBREVIATIONS[Number(month) - 1],
    time: time.slice(0, 5),
  }
}

/** `13 dic 2026 · 21:00 hs`: el mismo formato corto para la fecha del evento y la apertura de la venta. */
export function formatEventDateTime(dateTime: string) {
  const { day, month, year, time } = getEventDateParts(dateTime)
  return `${Number(day)} ${month.toLowerCase()} ${year} · ${time} hs`
}
