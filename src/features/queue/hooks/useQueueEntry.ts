import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { clearQueueTurn, saveQueueTurn } from '@/shared/lib/queueToken'
import { QUEUE_POLL_INTERVAL_MS } from '../constants/queue.constants'
import { queueKeys } from '../lib/queue.queryKeys'
import { ensureDevClientSession, getQueueStatus, joinQueue } from '../services/queue.service'
import type { QueueEntry } from '../types/queue.types'
import { isTurnExpired } from '../utils/queueFormat'

type QueueQueryData = {
  entry: QueueEntry
  initialPosition: number
}

const EXPIRY_CHECK_INTERVAL_MS = 1000

/**
 * Anota al cliente en la fila virtual (`POST /api/queue/{eventId}/join`),
 * hace polling con `GET /api/queue/{eventId}/me` mientras espera,
 * y sincroniza el `queueToken` en `sessionStorage` al habilitarse o vencer.
 */
export function useQueueEntry(eventId: number | undefined) {
  const queryClient = useQueryClient()
  const joinedEventRef = useRef<number | null>(null)
  const initialPositionRef = useRef<number>(0)
  const [nowMs, setNowMs] = useState(() => Date.now())

  const query = useQuery<QueueQueryData>({
    queryKey: queueKeys.entry(eventId ?? 0),
    enabled: eventId != null,
    retry: false,
    refetchInterval: (q) =>
      q.state.data?.entry.status === 'WAITING' ? QUEUE_POLL_INTERVAL_MS : false,
    queryFn: async () => {
      const id = eventId!
      await ensureDevClientSession()
      const entry = joinedEventRef.current === id ? await getQueueStatus(id) : await joinQueue(id)
      joinedEventRef.current = id
      if (entry.position != null && entry.position > initialPositionRef.current) {
        initialPositionRef.current = entry.position
      }
      return { entry, initialPosition: initialPositionRef.current }
    },
  })

  const rejoinMutation = useMutation<QueueEntry, unknown, number>({
    mutationFn: async (id) => {
      await ensureDevClientSession()
      return joinQueue(id)
    },
    onSuccess: (entry, id) => {
      joinedEventRef.current = id
      initialPositionRef.current = entry.position ?? 0
      queryClient.setQueryData<QueueQueryData>(queueKeys.entry(id), {
        entry,
        initialPosition: initialPositionRef.current,
      })
    },
  })

  const rawEntry = query.data?.entry
  const locallyExpired =
    rawEntry?.status === 'ENABLED' && isTurnExpired(rawEntry.enabledUntil, nowMs)
  const entry = useMemo<QueueEntry | undefined>(
    () => (rawEntry && locallyExpired ? { ...rawEntry, status: 'EXPIRED' } : rawEntry),
    [rawEntry, locallyExpired],
  )

  useEffect(() => {
    if (eventId == null || !entry) return
    if (entry.status === 'ENABLED' && entry.queueToken && entry.enabledUntil) {
      saveQueueTurn(eventId, { queueToken: entry.queueToken, enabledUntil: entry.enabledUntil })
    } else if (entry.status === 'EXPIRED') {
      clearQueueTurn(eventId)
    }
  }, [eventId, entry])

  useEffect(() => {
    if (rawEntry?.status !== 'ENABLED' || !rawEntry.enabledUntil) return
    const timer = window.setInterval(() => setNowMs(Date.now()), EXPIRY_CHECK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [rawEntry?.status, rawEntry?.enabledUntil])

  return {
    entry,
    initialPosition: query.data?.initialPosition ?? 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    retry: () => {
      joinedEventRef.current = null
      void query.refetch()
    },
    rejoin: () => {
      if (eventId == null || rejoinMutation.isPending) return
      clearQueueTurn(eventId)
      rejoinMutation.mutate(eventId)
    },
    isRejoining: rejoinMutation.isPending,
  }
}
