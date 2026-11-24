import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { EVENTS_PAGE_SIZE } from '../constants/catalog.constants'
import { formatFeaturedCountdown, pickFeaturedEvent } from '../domain/featuredEvent'
import { catalogKeys } from '../lib/catalog.queryKeys'
import { searchEvents } from '../services/events.service'

const TICK_INTERVAL_MS = 1000

/** Obtiene el evento destacado para el hero de Inicio y actualiza su cuenta regresiva. */
export function useFeaturedEvent() {
  const [nowMs, setNowMs] = useState(() => Date.now())

  const query = useQuery({
    queryKey: catalogKeys.events({ sort: 'DATE', page: 1 }),
    queryFn: () => searchEvents({ sort: 'DATE', page: 1 }, EVENTS_PAGE_SIZE),
    staleTime: 30_000,
  })

  const event = query.data ? pickFeaturedEvent(query.data.content, nowMs) : undefined
  const countdown = event ? formatFeaturedCountdown(event.saleStart, nowMs) : null

  useEffect(() => {
    if (!countdown) return
    const timer = window.setInterval(() => setNowMs(Date.now()), TICK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [countdown])

  return { event, countdown }
}
