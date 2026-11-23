import { Check } from 'lucide-react'
import { formatCountdown } from '../utils/paymentFormat'

type ReservationTimerBannerProps = {
  secondsLeft: number
}

export function ReservationTimerBanner({ secondsLeft }: ReservationTimerBannerProps) {
  return (
    <div className="flex min-h-17 items-center gap-3 rounded-xl bg-success px-4.5 py-3 text-success-ink">
      <Check aria-hidden className="size-5 flex-none" strokeWidth={2.5} />
      <div className="flex flex-1 flex-col gap-0.5">
        <strong className="text-control">Tus lugares están reservados</strong>
        <span className="text-label">El tiempo corre, completá el pago antes de que venza.</span>
      </div>
      <strong
        role="timer"
        aria-label="Tiempo restante de la reserva"
        className="font-mono text-[22px] font-medium"
      >
        {formatCountdown(secondsLeft)}
      </strong>
    </div>
  )
}
