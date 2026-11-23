import { ArrowUpRight } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { ApiError } from '@/shared/lib/http/ApiError'
import { parseEventId } from '@/shared/utils/eventId'
import { formatPrice } from '@/shared/utils/eventFormat'
import { OrderSummaryTicket } from '../../components/OrderSummaryTicket'
import { PaymentEndedView } from '../../components/PaymentEndedView'
import { PaymentMethodSelector } from '../../components/PaymentMethodSelector'
import { PaymentSkeleton } from '../../components/PaymentSkeleton'
import { PaymentSuccessView } from '../../components/PaymentSuccessView'
import { ReservationTimerBanner } from '../../components/ReservationTimerBanner'
import { MAX_PAYMENT_ATTEMPTS, PAYMENT_END_COPY } from '../../constants/payment.constants'
import { usePaymentPageController } from './usePaymentPageController'

function parseOrderId(raw: string | null): number | undefined {
  if (!raw) return undefined
  const parsed = Number(raw)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

export function PaymentPage() {
  const { eventId: eventIdParam = '' } = useParams()
  const [searchParams] = useSearchParams()
  const eventId = parseEventId(eventIdParam)
  const orderId = parseOrderId(searchParams.get('orderId'))

  const {
    order,
    photoUrl,
    isLoading,
    isLoadError,
    loadError,
    retryLoad,
    isPaid,
    endReason,
    secondsLeft,
    selectedMethod,
    setSelectedMethod,
    rejection,
    noAnswer,
    actionError,
    isPaying,
    isCancelling,
    handlePay,
    handleAbandon,
  } = usePaymentPageController(eventId, orderId)

  const payLabel = isPaying
    ? 'Procesando el pago…'
    : noAnswer
      ? 'Reintentar el pago'
      : order
        ? `Pagar ${formatPrice(order.total)}`
        : 'Pagar'

  const isNotFound =
    isLoadError && loadError instanceof ApiError && loadError.code === 'order_not_found'

  return (
    <PurchaseLayout step={PURCHASE_STEP.PAYMENT} eventId={eventIdParam} completed={isPaid}>
      {isLoading && <PaymentSkeleton />}

      {!isLoading && (isNotFound || (!isLoadError && !order)) && (
        <PaymentEndedView
          eventId={eventIdParam}
          title="No encontramos una reserva activa"
          description="Elegí tus lugares en el evento para iniciar una reserva nueva."
        />
      )}

      {!isLoading && isLoadError && !isNotFound && (
        <section className="mx-auto my-6 flex max-w-160 flex-col items-start gap-3.5 rounded-2xl border border-line bg-surface p-6 md:p-9">
          <h1 className="text-[28px] md:text-[32px]">No pudimos cargar tu reserva</h1>
          <p className="m-0 text-base text-muted">
            Ocurrió un problema al consultar tu orden. Intentá nuevamente.
          </p>
          <button
            type="button"
            onClick={retryLoad}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-accent px-6 text-control font-bold text-ink hover:bg-accent-hover"
          >
            Reintentar
          </button>
        </section>
      )}

      {!isLoading && order && isPaid && <PaymentSuccessView order={order} />}

      {!isLoading && order && !isPaid && endReason && (
        <PaymentEndedView
          orderId={order.id}
          eventId={eventIdParam}
          title={PAYMENT_END_COPY[endReason].title}
          description={PAYMENT_END_COPY[endReason].description}
        />
      )}

      {!isLoading && order && !isPaid && !endReason && (
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
            <ReservationTimerBanner secondsLeft={secondsLeft} />

            <section
              aria-labelledby="medio-de-pago"
              className="flex flex-col gap-4.5 rounded-2xl border border-line bg-surface p-5 md:p-6.5"
            >
              <div className="flex flex-col gap-1.5">
                <span className="text-micro font-bold tracking-[0.14em] text-subtle uppercase">
                  Paso final
                </span>
                <h1 id="medio-de-pago" className="text-[clamp(28px,3.4vw,36px)] tracking-[-0.03em]">
                  ¿Cómo querés pagar?
                </h1>
              </div>

              <PaymentMethodSelector
                selected={selectedMethod}
                onSelect={setSelectedMethod}
                disabled={isPaying || isCancelling}
              />

              {rejection && (
                <div
                  role="alert"
                  className="flex flex-col gap-1 rounded-xl bg-error px-4 py-3.5 text-sm text-error-ink"
                >
                  <strong>El pago fue rechazado: {rejection.reason}</strong>
                  <span>
                    Intento {rejection.attempts} de {MAX_PAYMENT_ATTEMPTS}. Probá con otro medio de
                    pago; tus lugares siguen reservados.
                  </span>
                </div>
              )}

              {noAnswer && (
                <div
                  role="alert"
                  className="flex flex-col gap-1 rounded-xl bg-warning px-4 py-3.5 text-sm text-warning-ink"
                >
                  <strong>No pudimos confirmar el pago</strong>
                  <span>
                    Reintentá con el mismo botón: si ya se había cobrado, no te cobramos dos veces.
                  </span>
                </div>
              )}

              {actionError && (
                <div
                  role="alert"
                  className="flex flex-col gap-1 rounded-xl bg-error px-4 py-3.5 text-sm text-error-ink"
                >
                  <strong>{actionError}</strong>
                </div>
              )}

              <button
                type="button"
                disabled={isPaying || isCancelling}
                onClick={handlePay}
                className="flex min-h-13.5 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-0 bg-accent text-base font-bold text-ink transition-colors hover:bg-accent-hover disabled:cursor-progress disabled:bg-[#ffe7a3] disabled:text-[#7a6a3e]"
              >
                {payLabel}
                <ArrowUpRight aria-hidden className="size-4.5" />
              </button>

              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={isPaying || isCancelling}
                  onClick={handleAbandon}
                  className="min-h-9 cursor-pointer border-0 bg-transparent text-label font-medium text-muted underline hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCancelling ? 'Abandonando la reserva…' : 'Abandonar la reserva'}
                </button>
              </div>

              <p className="m-0 text-center text-xs text-subtle">
                En la pasarela simulada, la tarjeta de débito siempre se rechaza para probar los
                reintentos.
              </p>
            </section>
          </div>

          <OrderSummaryTicket order={order} photoUrl={photoUrl} />
        </div>
      )}
    </PurchaseLayout>
  )
}
