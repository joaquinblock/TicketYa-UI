import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/lib/http/apiClient'
import { saveQueueTurn } from '@/shared/lib/queueToken'
import type { Order } from '../types/payment.types'
import { createReservation } from './reservations.service'

const ORDER_STUB = { id: 99, eventId: 1 } as Order

describe('createReservation', () => {
  afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('envía X-Queue-Token cuando hay un turno vigente guardado para el evento', async () => {
    saveQueueTurn(1, {
      queueToken: 'jwt-fila-1',
      enabledUntil: new Date(Date.now() + 5 * 60_000).toISOString(),
    })
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce(ORDER_STUB)
    const payload = { eventId: 1, idempotencyKey: 'k-1', seatIds: [10] }

    await createReservation(payload)

    expect(postSpy).toHaveBeenCalledWith('/api/orders', payload, {
      headers: { 'X-Queue-Token': 'jwt-fila-1' },
    })
  })

  it('no envía X-Queue-Token si no hay turno vigente para el evento', async () => {
    saveQueueTurn(2, {
      queueToken: 'jwt-otro-evento',
      enabledUntil: new Date(Date.now() + 5 * 60_000).toISOString(),
    })
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce(ORDER_STUB)
    const payload = { eventId: 1, idempotencyKey: 'k-2', seatIds: [10] }

    await createReservation(payload)

    expect(postSpy).toHaveBeenCalledWith('/api/orders', payload, undefined)
  })
})
