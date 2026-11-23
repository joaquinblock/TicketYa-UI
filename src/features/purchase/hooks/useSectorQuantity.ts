import { useState } from 'react'
import { MIN_QUANTITY } from '../constants/seats.constants'
import { adjustQuantityToAvailable } from '../domain/quantityAdjustment'
import { getQuantityLimit } from '../domain/quantityLimit'
import type { QuantityChange, QuantityStepper, UnnumberedSector } from '../types/purchase.types'

/**
 * Cuántas entradas lleva el cliente en el sector no numerado abierto. Cuando un refresco trae menos
 * lugares libres que la cantidad, la baja y deja en `change` qué pasó para el aviso.
 */
export function useSectorQuantity(sector: UnnumberedSector | undefined) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY)
  const [change, setChange] = useState<QuantityChange>('NONE')
  const [previousSector, setPreviousSector] = useState(sector)

  // Como en useSeatSelection, se ajusta durante el render. Solo cuenta un refresco del mismo
  // sector: al cambiar de pestaña la cantidad vuelve a empezar con `reset`.
  const isSameSector = sector?.eventSectorId === previousSector?.eventSectorId
  if (!isSameSector || sector?.availablePlaces !== previousSector?.availablePlaces) {
    setPreviousSector(sector)
    if (sector && isSameSector) {
      const adjustment = adjustQuantityToAvailable({
        quantity,
        availablePlaces: sector.availablePlaces,
      })
      if (adjustment.change !== 'NONE') {
        setQuantity(adjustment.quantity)
        setChange(adjustment.change)
      }
    }
  }

  const limit = sector ? getQuantityLimit(sector) : MIN_QUANTITY
  const chooseQuantity = (next: (current: number) => number) => {
    setQuantity(next)
    setChange('NONE')
  }

  const stepper: QuantityStepper = {
    quantity,
    canDecrease: quantity > MIN_QUANTITY,
    canIncrease: quantity < limit,
    increase: () => chooseQuantity((current) => Math.min(current + 1, limit)),
    decrease: () => chooseQuantity((current) => Math.max(current - 1, MIN_QUANTITY)),
  }

  return { stepper, change, reset: () => chooseQuantity(() => MIN_QUANTITY) }
}
