import { useEffect, useState } from 'react'
import { getRemainingSeconds } from '../utils/paymentFormat'

const TICK_INTERVAL_MS = 1000

/** Cuenta regresiva en segundos hasta `expiresAt` mientras `active` sea true. */
export function useCountdown(expiresAt: string | undefined, active: boolean) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    expiresAt ? getRemainingSeconds(expiresAt) : 0,
  )

  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(0)
      return
    }
    const update = () => setSecondsLeft(getRemainingSeconds(expiresAt))
    update()
    if (!active) return

    const timer = window.setInterval(update, TICK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [expiresAt, active])

  return secondsLeft
}
