import { useState } from 'react'

/** Cuántas entradas lleva el cliente en el sector no numerado abierto. */
export function useSectorQuantity() {
  const [quantity] = useState(1)
  return { quantity }
}
