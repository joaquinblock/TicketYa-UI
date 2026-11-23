import { useState } from 'react'
import { MIN_QUANTITY } from '../constants/seats.constants'
import type { QuantityStepper } from '../types/purchase.types'

/** Cuántas entradas lleva el cliente en el sector no numerado abierto. */
export function useSectorQuantity(): QuantityStepper {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)
  return {
    quantity,
    canDecrease: quantity > MIN_QUANTITY,
    increase: () => setQuantity((current) => current + 1),
    decrease: () => setQuantity((current) => current - 1),
  }
}
