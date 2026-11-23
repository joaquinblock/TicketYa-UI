import type { QuantityChange } from '../types/purchase.types'

type QuantityAdjustmentInput = { quantity: number; availablePlaces: number }
type QuantityAdjustment = { quantity: number; change: QuantityChange }

/** Un refresco puede traer menos lugares libres que la cantidad elegida. */
export function adjustQuantityToAvailable({
  quantity,
  availablePlaces,
}: QuantityAdjustmentInput): QuantityAdjustment {
  if (availablePlaces >= quantity) return { quantity, change: 'NONE' }
  if (availablePlaces === 0) return { quantity: 0, change: 'SOLD_OUT' }
  return { quantity: availablePlaces, change: 'LOWERED' }
}
