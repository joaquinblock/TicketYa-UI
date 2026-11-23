import { MONTH_ABBREVIATIONS, WEEKDAY_NAMES } from '../constants/tickets.constants'
import type { Ticket } from '../types/tickets.types'

const TICKET_CODE_PREFIX = 'TY-'
const TICKET_CODE_DIGITS = 5

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** `$18.000`: sin espacio entre el signo y el número, como en el mockup. */
export function formatOrderPrice(amount: number): string {
  return priceFormatter.format(amount).replace(/\s/g, '')
}

/**
 * El backend manda la hora local del evento sin zona (`2026-12-02T22:00:00`). Se lee del texto
 * para no correrla con la zona horaria del navegador.
 */
export function getOrderEventDateParts(dateTime: string) {
  const [date, time] = dateTime.split('T')
  const [year, month, day] = date.split('-')
  const weekdayIndex = new Date(Number(year), Number(month) - 1, Number(day)).getDay()
  return {
    day: String(Number(day)),
    month: MONTH_ABBREVIATIONS[Number(month) - 1],
    weekday: WEEKDAY_NAMES[weekdayIndex],
    time: time.slice(0, 5),
  }
}

/** Formatea la ubicación de una entrada según tenga o no asiento asignado. */
export function formatTicketLocation({
  sectorName,
  row,
  number,
}: Pick<Ticket, 'sectorName' | 'row' | 'number'>): string {
  if (row != null && number != null) {
    return `${sectorName} · Fila ${row}, asiento ${number}`
  }
  return sectorName
}

/** Formatea el id de la entrada como código legible (`TY-00001`). */
export function formatTicketCode(ticketId: number): string {
  return `${TICKET_CODE_PREFIX}${String(ticketId).padStart(TICKET_CODE_DIGITS, '0')}`
}
