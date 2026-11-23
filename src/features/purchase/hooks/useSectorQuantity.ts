import { useState } from 'react'
import type { QuantityStepper } from '../types/purchase.types'

/** Cuántas entradas lleva el cliente en el sector no numerado abierto. */
export function useSectorQuantity(): QuantityStepper {
  const [quantity, setQuantity] = useState(1)
  return {
    quantity,
    increase: () => setQuantity((current) => current + 1),
    decrease: () => setQuantity((current) => current - 1),
  }
}
