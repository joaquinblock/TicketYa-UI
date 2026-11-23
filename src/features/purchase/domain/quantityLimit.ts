import type { EventDetail, SectorAvailability } from '@/shared/types/event.types'

type QuantityLimitInput = Pick<SectorAvailability, 'availablePlaces'> &
  Pick<EventDetail, 'maxTicketsPerCustomer'>

/** Lo más que se puede llevar: lo que queda libre, sin pasar el límite por persona si lo hay. */
export function getQuantityLimit({ availablePlaces, maxTicketsPerCustomer }: QuantityLimitInput) {
  return Math.min(availablePlaces, maxTicketsPerCustomer ?? availablePlaces)
}
