import type { EventDetail } from '@/shared/types/event.types'

type SeatPickInput = Pick<EventDetail, 'maxTicketsPerCustomer'> & {
  selectedCount: number
  isSelected: boolean
}

/** Con el límite por persona completo, solo se pueden destildar los elegidos. */
export function isSeatPickable({
  selectedCount,
  isSelected,
  maxTicketsPerCustomer,
}: SeatPickInput) {
  if (isSelected || maxTicketsPerCustomer === null) return true
  return selectedCount < maxTicketsPerCustomer
}
