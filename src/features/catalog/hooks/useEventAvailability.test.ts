import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { catalogKeys } from '../lib/catalog.queryKeys'
import { useEventAvailability } from './useEventAvailability'

/** Ancla de "Datos de prueba": el evento 1 está a la venta. */
const ON_SALE_EVENT_ID = 1
const REFETCH_INTERVAL_MS = 30_000
/** El mismo `staleTime` que la app: el refresco no tiene que esperar a que venza. */
const APP_STALE_TIME_MS = 5 * 60 * 1000

function renderAvailabilityHook(eventId: number | undefined) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: APP_STALE_TIME_MS } },
  })
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
  const view = renderHook(() => useEventAvailability(eventId), { wrapper })
  const updatedAt = () =>
    queryClient.getQueryState(catalogKeys.availability(ON_SALE_EVENT_ID))?.dataUpdatedAt ?? 0
  return { ...view, updatedAt }
}

describe('useEventAvailability: refresco cada 30 s', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'setTimeout'], shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('a los 30 s con la disponibilidad cargada la vuelve a pedir, y antes no', async () => {
    const { result, updatedAt } = renderAvailabilityHook(ON_SALE_EVENT_ID)
    await waitFor(() => expect(result.current.availability?.eventId).toBe(ON_SALE_EVENT_ID))
    const firstUpdate = updatedAt()

    await act(() => vi.advanceTimersByTimeAsync(REFETCH_INTERVAL_MS - 1_000))
    expect(updatedAt()).toBe(firstUpdate)

    await act(() => vi.advanceTimersByTimeAsync(1_000))
    await waitFor(() => expect(updatedAt()).toBeGreaterThan(firstUpdate))
  })
})

describe('useEventAvailability: al volver a la pestaña', () => {
  afterEach(() => {
    focusManager.setFocused(undefined)
  })

  it('la vuelve a pedir antes de los 30 s, aunque el cache no haya vencido', async () => {
    const { result, updatedAt } = renderAvailabilityHook(ON_SALE_EVENT_ID)
    await waitFor(() => expect(result.current.availability?.eventId).toBe(ON_SALE_EVENT_ID))
    const firstUpdate = updatedAt()

    act(() => focusManager.setFocused(false))
    act(() => focusManager.setFocused(true))

    await waitFor(() => expect(updatedAt()).toBeGreaterThan(firstUpdate))
  })
})
