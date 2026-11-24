import { CheckCircle2, CircleAlert } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { EventDetail } from '@/shared/types/event.types'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import { RESOLUTION_META, RETURN_REQUEST_TABS } from '../../constants/returnRequests.constants'
import type { ReturnRequest, ReturnRequestResolution } from '../../types/returnRequest.types'
import { formatRequestedAt } from '../../utils/backofficeFormat'
import { BackofficeStatusBadge } from '../BackofficeStatusBadge'
import { useRefundsSection } from './useRefundsSection'

const TABLE_HEADERS = ['SOLICITUD', 'ENTRADA Y EVENTO', 'CLIENTE', 'PEDIDO', 'ESTADO', '']

/** `.bo-refunds-card` del diseño: pestañas por estado, la tabla y aprobar o rechazar cada pedido. */
export function RefundsSection() {
  const refunds = useRefundsSection()
  const { requests, pendingResolution } = refunds

  return (
    <section className="overflow-hidden rounded-[9px] border border-backoffice-line bg-surface">
      <div
        role="tablist"
        aria-label="Filtrar devoluciones"
        className="flex items-center gap-5 overflow-x-auto border-b border-backoffice-line px-4.5"
      >
        {RETURN_REQUEST_TABS.map(({ filter, label }) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={refunds.filter === filter}
            onClick={() => refunds.selectFilter(filter)}
            className={cn(
              'flex h-11.25 cursor-pointer items-center gap-1.75 border-0 border-b-2 border-transparent bg-transparent text-[10px] whitespace-nowrap text-[#77746d]',
              refunds.filter === filter && 'border-b-[#e3ad22] font-bold text-[#2c2a25]',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-b border-[#f1e8ce] bg-[#fffbef] px-4.25 py-2.75 text-[9px] text-[#766d53]">
        <CircleAlert aria-hidden className="size-4 flex-none text-[#a57b11]" />
        <span>
          Las solicitudes más antiguas aparecen primero. Si el evento se cancela, el reintegro se
          procesa automáticamente.
        </span>
      </div>

      {refunds.resultMessage && (
        <p
          role="status"
          className="m-0 flex items-center gap-2 border-b border-backoffice-line bg-[#e8f5eb] px-4.25 py-2.75 text-[10px] font-semibold text-[#27834c]"
        >
          <CheckCircle2 aria-hidden className="size-4" />
          {refunds.resultMessage}
        </p>
      )}

      {pendingResolution && (
        <ResolutionConfirm
          requestId={pendingResolution.id}
          resolution={pendingResolution.resolution}
          isResolving={refunds.isResolving}
          error={refunds.resolveError}
          onConfirm={refunds.confirmResolution}
          onCancel={refunds.cancelResolution}
        />
      )}

      {refunds.loadError && (
        <p role="alert" className="m-0 px-4.5 py-6 text-[11px] font-medium text-error-ink">
          {refunds.loadError}
        </p>
      )}

      {refunds.isLoading && <p className="m-0 px-4.5 py-6 text-[11px]">Cargando solicitudes…</p>}

      {!refunds.isLoading && !refunds.loadError && requests.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-1.75 px-3.75 py-9.5 text-[#9a968c]">
          <CheckCircle2 aria-hidden className="size-6" />
          <b className="text-xs text-[#44413a]">No hay solicitudes en este estado</b>
        </div>
      )}

      {requests.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-217.5 border-collapse whitespace-nowrap">
            <thead className="bg-[#faf9f6]">
              <tr>
                {TABLE_HEADERS.map((header) => (
                  <th
                    key={header}
                    className="h-9 border-y border-[#f0eee8] px-2 text-left text-[8px] font-[650] tracking-[0.55px] text-[#89867d] first:pl-4.5"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <RefundRow
                  key={request.id}
                  request={request}
                  event={refunds.eventsById.get(request.eventId)}
                  onResolve={refunds.askResolution}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[#f0eee8] px-4.25 py-2.5 text-[9px] text-[#89867e]">
        <span>
          Mostrando {requests.length} de {refunds.totalElements} solicitudes
        </span>
        <div className="flex items-center gap-1.25">
          <PageButton
            disabled={refunds.page === 0}
            onClick={() => refunds.goToPage(refunds.page - 1)}
          >
            Anterior
          </PageButton>
          <b className="grid h-6.25 min-w-6.5 place-items-center rounded-[5px] border border-[#f3dfa6] bg-[#fff4d4] px-1.75 text-[#735a17]">
            {refunds.page + 1}
          </b>
          <PageButton
            disabled={refunds.page + 1 >= refunds.totalPages}
            onClick={() => refunds.goToPage(refunds.page + 1)}
          >
            Siguiente
          </PageButton>
        </div>
      </div>
    </section>
  )
}

type RefundRowProps = {
  request: ReturnRequest
  event: EventDetail | undefined
  onResolve: (id: number, resolution: ReturnRequestResolution) => void
}

function RefundRow({ request, event, onResolve }: RefundRowProps) {
  const cellClassName =
    'border-b border-[#f0eee8] px-2 py-2.5 align-middle text-[10px] text-[#5f5c55]'

  return (
    <tr className="last:[&>td]:border-b-0">
      <td className={cn(cellClassName, 'pl-4.5 font-[650] text-[#313029]')}>#{request.id}</td>
      <td className={cellClassName}>
        <div className="flex flex-col gap-1">
          <b className="text-[10px] text-[#34322c]">
            Entrada #{request.ticketId} · {event?.name ?? `Evento #${request.eventId}`}
          </b>
          {event && (
            <small className="text-[9px] text-[#858178]">
              {formatEventDateTime(event.dateTime)}
            </small>
          )}
        </div>
      </td>
      <td className={cellClassName}>Cliente #{request.requestedBy}</td>
      <td className={cellClassName}>{formatRequestedAt(request.requestedAt)}</td>
      <td className={cellClassName}>
        <BackofficeStatusBadge status={request.status} />
      </td>
      <td className={cellClassName}>
        {request.status === 'PENDING' && (
          <div className="flex justify-end gap-1.5">
            <MiniAction tone="danger" onClick={() => onResolve(request.id, 'reject')}>
              Rechazar
            </MiniAction>
            <MiniAction onClick={() => onResolve(request.id, 'approve')}>Aprobar</MiniAction>
          </div>
        )}
      </td>
    </tr>
  )
}

type ResolutionConfirmProps = {
  requestId: number
  resolution: ReturnRequestResolution
  isResolving: boolean
  error: string | undefined
  onConfirm: () => void
  onCancel: () => void
}

/** Aprobar reintegra dinero y no se deshace: se confirma antes (Nielsen 5). */
function ResolutionConfirm({
  requestId,
  resolution,
  isResolving,
  error,
  onConfirm,
  onCancel,
}: ResolutionConfirmProps) {
  const { question, confirmLabel } = RESOLUTION_META[resolution]

  return (
    <div
      role="alertdialog"
      aria-labelledby="refund-confirm-title"
      className="flex flex-wrap items-center gap-3 border-b border-backoffice-line bg-[#faf9f6] px-4.5 py-3"
    >
      <b id="refund-confirm-title" className="text-[11px]">
        {question} (solicitud #{requestId})
      </b>
      {error && (
        <span role="alert" className="text-[10px] font-medium text-error-ink">
          {error}
        </span>
      )}
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isResolving}
          className="inline-flex min-h-9 cursor-pointer items-center rounded-[7px] border border-[#dedbd3] bg-surface px-3.25 text-[11px] font-semibold hover:bg-[#f7f6f2]"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isResolving}
          className={cn(
            'inline-flex min-h-9 cursor-pointer items-center rounded-[7px] border px-3.25 text-[11px] font-semibold',
            resolution === 'approve'
              ? 'border-accent bg-accent text-[#171717] hover:bg-[#f0b714]'
              : 'border-[#b83224] bg-[#b83224] text-white',
          )}
        >
          {isResolving ? 'Resolviendo…' : confirmLabel}
        </button>
      </div>
    </div>
  )
}

type MiniActionProps = {
  tone?: 'danger'
  onClick: () => void
  children: string
}

function MiniAction({ tone, onClick, children }: MiniActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-8 cursor-pointer rounded-[5px] border border-[#e6e2d8] bg-surface px-2.25 text-[9px] hover:bg-[#fff7df]',
        tone === 'danger' && 'border-[#e4b4aa] text-[#a43a2b]',
      )}
    >
      {children}
    </button>
  )
}

type PageButtonProps = {
  disabled: boolean
  onClick: () => void
  children: string
}

function PageButton({ disabled, onClick, children }: PageButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="grid h-6.25 min-w-6.5 cursor-pointer place-items-center rounded-[5px] border border-[#e9e7e0] bg-surface px-1.75 text-[9px] text-[#6c6962] disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
    </button>
  )
}
