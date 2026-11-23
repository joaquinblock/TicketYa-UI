import type { EventSector, SeatAvailability, SectorAvailability } from '@/shared/types/event.types'
import { formatPrice } from '@/shared/utils/eventFormat'
import { SEAT_STATUS_LABEL, SOLD_OUT_TAB_LABEL } from '../constants/seats.constants'
import type { AlertMessage, SeatStatus } from '../types/purchase.types'

type SectorTabInput = Pick<SectorAvailability, 'price' | 'availablePlaces'>
type SeatLabelInput = Pick<SeatAvailability, 'row' | 'number'>
type UnnumberedPlacesInput = Pick<EventSector, 'capacity'> &
  Pick<SectorAvailability, 'availablePlaces'>
type QuantityLoweredInput = Pick<SectorAvailability, 'sectorName'> & { quantity: number }

const seatListFormatter = new Intl.ListFormat('es', { type: 'conjunction' })

export function formatSectorTabLabel({ price, availablePlaces }: SectorTabInput) {
  return availablePlaces === 0 ? SOLD_OUT_TAB_LABEL : formatPrice(price)
}

export function formatTakenSeatsMessage(seats: SeatLabelInput[]): AlertMessage {
  const codes = seatListFormatter.format(seats.map(formatSeatCode))
  if (seats.length === 1) {
    return {
      lead: `El asiento ${codes} lo acaba de reservar otra persona.`,
      hint: 'Lo sacamos de tu elección: elegí otro.',
    }
  }
  return {
    lead: `Los asientos ${codes} los acaba de reservar otra persona.`,
    hint: 'Los sacamos de tu elección: elegí otros.',
  }
}

/** `F7`: la fila y el número, como en la entrada. */
export function formatSeatCode({ row, number }: SeatLabelInput) {
  return `${row}${number}`
}

/** `Fila A, asiento 3, disponible`: el estado también va en el nombre, no solo en el color. */
export function formatSeatAccessibleName({ row, number }: SeatLabelInput, status: SeatStatus) {
  return `Fila ${row}, asiento ${number}, ${SEAT_STATUS_LABEL[status].toLowerCase()}`
}

const placesFormatter = new Intl.NumberFormat('es-AR')

export function formatUnnumberedPlaces({ availablePlaces, capacity }: UnnumberedPlacesInput) {
  const available = placesFormatter.format(availablePlaces)
  return `Sin numerar · ${available} lugares libres de ${placesFormatter.format(capacity)}`
}

export function formatQuantityLoweredMessage({
  sectorName,
  quantity,
}: QuantityLoweredInput): AlertMessage {
  const places = quantity === 1 ? 'Queda 1 lugar' : `Quedan ${quantity} lugares`
  return { lead: `${places} en ${sectorName}:`, hint: `bajamos tu cantidad a ${quantity}` }
}

export function formatSectorSoldOutMessage(sectorName: string): AlertMessage {
  return { lead: `Se agotó ${sectorName}.`, hint: 'Elegí otro sector.' }
}
