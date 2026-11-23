import { CreditCard, Wallet } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { PAYMENT_METHOD_META } from '../constants/payment.constants'
import { PAYMENT_METHODS, type PaymentMethod } from '../types/payment.types'

type PaymentMethodSelectorProps = {
  selected: PaymentMethod
  onSelect: (method: PaymentMethod) => void
  disabled?: boolean
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <fieldset disabled={disabled} className="m-0 flex flex-col gap-2.5 border-0 p-0">
      <legend className="sr-only">Medio de pago</legend>
      {PAYMENT_METHODS.map((method) => {
        const meta = PAYMENT_METHOD_META[method]
        const isSelected = selected === method
        return (
          <label
            key={method}
            className={cn(
              'relative flex min-h-16 cursor-pointer items-center gap-3.5 rounded-xl border border-line bg-surface px-4 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-link',
              isSelected && 'border-ink bg-tab-open shadow-[inset_0_0_0_1px_#141414]',
              disabled && 'cursor-not-allowed opacity-70',
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={isSelected}
              onChange={() => onSelect(method)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                'size-4.5 flex-none rounded-full border-[1.5px] border-subtle transition-all',
                isSelected && 'border-[6px] border-ink',
              )}
            />
            <span
              aria-hidden
              className={cn(
                'inline-flex h-6.5 min-w-10 items-center justify-center rounded-[5px] border border-line bg-surface px-1.5',
                meta.kind === 'wallet' && 'border-accent bg-accent',
              )}
            >
              {meta.kind === 'wallet' ? (
                <Wallet className="size-4.5 text-ink" strokeWidth={2} />
              ) : (
                <CreditCard className="size-4.5 text-ink" strokeWidth={1.8} />
              )}
            </span>
            <strong className="flex-1 text-control">{meta.label}</strong>
            {meta.kind === 'card' && (
              <span aria-hidden className="hidden items-center gap-1.5 text-xs text-subtle md:flex">
                <span className="inline-flex h-6.5 min-w-10 items-center justify-center rounded-[5px] border border-line bg-surface px-1.5 font-sans text-[11px] font-black text-[#1a1f71] italic">
                  VISA
                </span>
                <span className="inline-flex h-6.5 min-w-10 items-center justify-center rounded-[5px] border border-line bg-surface px-1.5 text-[11px] font-bold text-ink">
                  MC
                </span>
              </span>
            )}
          </label>
        )
      })}
    </fieldset>
  )
}
