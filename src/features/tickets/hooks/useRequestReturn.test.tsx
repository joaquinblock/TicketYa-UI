import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/shared/lib/http/ApiError'
import { apiClient } from '@/shared/lib/http/apiClient'
import { ticketsKeys } from '../lib/tickets.queryKeys'
import type { ReturnRequestResponse } from '../types/tickets.types'
import { useRequestReturn } from './useRequestReturn'

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useRequestReturn', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('llama a POST /api/tickets/{id}/return-requests e invalida ticketsKeys.orders() al resolver', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    queryClient.setQueryData(ticketsKeys.orders(), [])

    const response: ReturnRequestResponse = {
      id: 12,
      ticketId: 45,
      status: 'PENDING',
      requestedAt: '2026-11-23T15:00:00',
    }
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce(response)

    const { result } = renderHook(() => useRequestReturn(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await result.current.mutateAsync(45)
    })

    expect(postSpy).toHaveBeenCalledWith('/api/tickets/45/return-requests')
    await waitFor(() => {
      expect(queryClient.getQueryState(ticketsKeys.orders())?.isInvalidated).toBe(true)
    })
  })

  it('expone el ApiError tipado cuando falla el pedido', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    const apiError = new ApiError({
      error: 'refund_not_allowed',
      message: 'La entrada ya no admite devolución',
      status: 409,
    })
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(apiError)

    const { result } = renderHook(() => useRequestReturn(), {
      wrapper: createWrapper(queryClient),
    })

    await act(async () => {
      await expect(result.current.mutateAsync(45)).rejects.toBe(apiError)
    })

    await waitFor(() => {
      expect(result.current.error).toBe(apiError)
    })
  })
})
