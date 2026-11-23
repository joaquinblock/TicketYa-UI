import { ArrowUpRight, Clock, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { ROUTES } from '@/shared/lib/routes'
import { QueueEnabledBody } from '../../components/QueueEnabledBody'
import { QueueErrorView } from '../../components/QueueErrorView'
import { QueueExpiredBody } from '../../components/QueueExpiredBody'
import { QueueRulesList } from '../../components/QueueRulesList'
import { QueueSkeleton } from '../../components/QueueSkeleton'
import { QueueWaitingBody } from '../../components/QueueWaitingBody'
import { QUEUE_BATCH_SECONDS, QUEUE_BATCH_SIZE } from '../../constants/queue.constants'
import { formatEstimatedWait, getQueueProgressPercent } from '../../utils/queueFormat'
import { useQueuePageController } from './useQueuePageController'

export function QueuePage() {
  const { eventId: eventIdParam = '' } = useParams()
  const { eventName, entry, initialPosition, isLoading, errorInfo, retry, rejoin, isRejoining } =
    useQueuePageController(eventIdParam)

  const isWaiting = entry?.status === 'WAITING'
  const isEnabled = entry?.status === 'ENABLED'
  const isExpired = entry?.status === 'EXPIRED'
  const position = entry?.position ?? 0
  const progressPercent = isWaiting ? getQueueProgressPercent(initialPosition, position) : 100
  const etaLabel = isEnabled ? 'ya' : isWaiting ? formatEstimatedWait(position) : '—'

  return (
    <PurchaseLayout step={PURCHASE_STEP.QUEUE} eventId={eventIdParam}>
      {isLoading && <QueueSkeleton />}

      {!isLoading && errorInfo && (
        <QueueErrorView
          eventId={eventIdParam}
          title={errorInfo.title}
          description={errorInfo.description}
          canRetry={errorInfo.canRetry}
          onRetry={retry}
        />
      )}

      {!isLoading && !errorInfo && entry && (
        <section
          aria-labelledby="fila-titulo"
          className="mx-auto w-full max-w-150 rounded-[18px] border border-line bg-surface px-5 py-7 text-center md:px-10 md:pt-10 md:pb-8"
        >
          <span className="text-micro font-bold tracking-[0.14em] text-subtle uppercase">
            {eventName ? `Fila virtual · ${eventName}` : 'Fila virtual'}
          </span>

          {isWaiting && <QueueWaitingBody position={position} />}
          {isEnabled && <QueueEnabledBody enabledUntil={entry.enabledUntil} />}
          {isExpired && <QueueExpiredBody />}

          <div aria-hidden className="mt-7 mb-3 h-1.75 overflow-hidden rounded-lg bg-[#eeece6]">
            <span
              className="block h-full rounded-lg bg-accent transition-[width] duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap justify-between gap-2 text-label text-muted">
            <span className="flex items-center gap-1.5">
              <Users aria-hidden className="size-4" />
              {QUEUE_BATCH_SIZE} personas cada {QUEUE_BATCH_SECONDS} segundos
            </span>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-4" />
              Espera estimada: {etaLabel}
            </span>
          </div>

          <QueueRulesList />

          {isExpired && (
            <button
              type="button"
              disabled={isRejoining}
              onClick={rejoin}
              className="flex min-h-13.5 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-0 bg-accent text-base font-bold text-ink hover:bg-accent-hover disabled:cursor-progress disabled:opacity-70"
            >
              {isRejoining ? 'Volviendo a la fila…' : 'Volver a hacer la fila'}
            </button>
          )}

          {isEnabled && (
            <Link
              to={ROUTES.seats(eventIdParam)}
              className="flex min-h-13.5 w-full items-center justify-center gap-2.5 rounded-xl bg-accent text-base font-bold text-ink no-underline hover:bg-accent-hover hover:text-ink"
            >
              Ya podés elegir tus lugares
              <ArrowUpRight aria-hidden className="size-4.5" />
            </Link>
          )}

          {isWaiting && (
            <button
              type="button"
              aria-disabled="true"
              disabled
              className="flex min-h-13.5 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border-0 bg-[#ffe7a3] text-base font-bold text-[#7a6a3e]"
            >
              Esperando tu turno…
              <ArrowUpRight aria-hidden className="size-4.5" />
            </button>
          )}
        </section>
      )}
    </PurchaseLayout>
  )
}
