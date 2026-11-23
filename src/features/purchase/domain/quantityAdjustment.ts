import type { QuantityChange } from '../types/purchase.types'

type QuantityAdjustmentInput = { quantity: number; availablePlaces: number }
type QuantityAdjustment = { quantity: number; change: QuantityChange }

/** Un refresco puede traer menos lugares libres que la cantidad elegida. */
export function adjustQuantityToAvailable({
  quantity,
}: QuantityAdjustmentInput): QuantityAdjustment {
  return { quantity, change: 'NONE' }
}
