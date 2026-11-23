import type { SeatAvailability, SectorAvailability } from '@/shared/types/event.types'
import { formatPrice } from '@/shared/utils/eventFormat'
import { SOLD_OUT_TAB_LABEL } from '../constants/seats.constants'

type SectorTabInput = Pick<SectorAvailability, 'price' | 'availablePlaces'>
type SeatLabelInput = Pick<SeatAvailability, 'row' | 'number'>

const seatListFormatter = new Intl.ListFormat('es', { type: 'conjunction' })

export function formatSectorTabLabel({ price, availablePlaces }: SectorTabInput) {
  return availablePlaces === 0 ? SOLD_OUT_TAB_LABEL : formatPrice(price)
}

/** El aviso va en dos partes: la primera oración se destaca. */
export function formatTakenSeatsMessage(seats: SeatLabelInput[]) {
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
