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
  const [, month, day] = date.split('-')
  return {
    day,
    month: MONTH_ABBREVIATIONS[Number(month) - 1],
    time: time.slice(0, 5),
  }
}
