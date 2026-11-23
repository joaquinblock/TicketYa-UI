import { useState } from 'react'
import { MIN_QUANTITY } from '../constants/seats.constants'
import { getQuantityLimit } from '../domain/quantityLimit'
import type { QuantityStepper, UnnumberedSector } from '../types/purchase.types'

type SectorQuantityLimits = Pick<UnnumberedSector, 'availablePlaces' | 'maxTicketsPerCustomer'>

/** Cuántas entradas lleva el cliente en el sector no numerado abierto. */
export function useSectorQuantity(limits: SectorQuantityLimits): QuantityStepper {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)
  const limit = getQuantityLimit(limits)

  return {
    quantity,
    canDecrease: quantity > MIN_QUANTITY,
    canIncrease: quantity < limit,
    increase: () => setQuantity((current) => Math.min(current + 1, limit)),
    decrease: () => setQuantity((current) => Math.max(current - 1, MIN_QUANTITY)),
  }
}
