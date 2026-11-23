import { useId } from 'react'
import type { EventDetail } from '@/shared/types/event.types'
import { formatPrice } from '@/shared/utils/eventFormat'
import type { SelectionSummary as Summary } from '../types/purchase.types'
import { formatSelectionCount } from '../utils/seatFormat'

type SelectionSummaryProps = Pick<EventDetail, 'maxTicketsPerCustomer'> & { summary: Summary }

/** "Tu selección": lo elegido con su precio, el total y el contador contra el límite por persona. */
export function SelectionSummary({ summary, maxTicketsPerCustomer }: SelectionSummaryProps) {
  const titleId = useId()

  return (
    <aside
      aria-labelledby={titleId}
      className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5 rounded-2xl border border-line bg-surface p-5"
    >
      <div className="flex items-baseline justify-between border-b border-line pb-3.5">
        <h2 id={titleId} className="text-lg">
          Tu selección
        </h2>
        <span className="font-mono text-label text-subtle">
          {formatSelectionCount({ count: summary.count, maxTicketsPerCustomer })}
        </span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {summary.lines.map((line) => (
          <li
            key={line.key}
            className="flex justify-between gap-2 border-b border-line pb-2.5 text-sm"
          >
            <span>{line.label}</span>
            <strong>{formatPrice(line.price)}</strong>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <span>Total</span>
        <strong className="font-mono text-2xl font-medium">{formatPrice(summary.total)}</strong>
      </div>
    </aside>
  )
}
