import type { Ticket } from '../types/tickets.types'

const TICKET_CODE_PREFIX = 'TY-'
const TICKET_CODE_DIGITS = 5

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
