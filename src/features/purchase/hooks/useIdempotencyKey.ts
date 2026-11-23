import { useState } from 'react'
import type { ReservationDraft } from '../types/purchase.types'

/**
 * Una clave por selección: reintentar lo mismo manda la misma, y el backend devuelve la orden que
 * ya creó en vez de una segunda. Si la selección cambia, la clave también: la misma clave con
 * otros datos da 409 `data_conflict`.
 */
export function useIdempotencyKey(draft: ReservationDraft | undefined) {
  const fingerprint = JSON.stringify(draft ?? null)
  const [keyed, setKeyed] = useState(() => ({ fingerprint, key: crypto.randomUUID() }))

  // Se ajusta durante el render, como useSeatSelection: no se manda nunca una clave vieja.
  if (keyed.fingerprint !== fingerprint) {
    const next = { fingerprint, key: crypto.randomUUID() }
    setKeyed(next)
    return next.key
  }
  return keyed.key
}
