import type { SectorAvailability } from '@/shared/types/event.types'
import { formatPrice } from '@/shared/utils/eventFormat'
import { SOLD_OUT_TAB_LABEL } from '../constants/seats.constants'

type SectorTabInput = Pick<SectorAvailability, 'price' | 'availablePlaces'>

export function formatSectorTabLabel({ price, availablePlaces }: SectorTabInput) {
  return availablePlaces === 0 ? SOLD_OUT_TAB_LABEL : formatPrice(price)
}
