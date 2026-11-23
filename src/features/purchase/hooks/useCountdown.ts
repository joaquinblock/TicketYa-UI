import { useEffect, useState } from 'react'
import { getRemainingSeconds } from '../utils/paymentFormat'

const TICK_INTERVAL_MS = 1000

/** Cuenta regresiva en segundos hasta `expiresAt` mientras `active` sea true. */
export function useCountdown(expiresAt: string | undefined, active: boolean) {
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!expiresAt || !active) return
    const timer = window.setInterval(() => setNowMs(Date.now()), TICK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [expiresAt, active])

  return expiresAt ? getRemainingSeconds(expiresAt, nowMs) : 0
}
