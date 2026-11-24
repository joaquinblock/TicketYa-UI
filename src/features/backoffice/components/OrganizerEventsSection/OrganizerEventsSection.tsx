import { CalendarDays, CheckCircle2, Filter, MapPin, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/lib/routes'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import { ADMIN_EVENT_TYPE_LABEL } from '../../constants/adminEvents.constants'
import {
  ONLY_CREATOR_REASON,
  ORGANIZER_EVENT_ACTION_META,
  ORGANIZER_EVENT_ACTIONS,
  ORGANIZER_EVENT_STATUS_FILTERS,
  ORGANIZER_EVENT_STATUS_META,
} from '../../constants/organizerEvents.constants'
import type {
  OrganizerEvent,
  OrganizerEventAction,
  OrganizerEventStatusFilter,
} from '../../types/organizerEvent.types'
import { BackofficeStatusBadge } from '../BackofficeStatusBadge'
import { EventActionDialog } from '../EventActionDialog'
import { useOrganizerEventsSection } from './useOrganizerEventsSection'

const TABLE_HEADERS = ['EVENTO', 'FECHA Y LUGAR', 'ESTADO', '']

const ROW_BUTTON_CLASS =
  'inline-flex min-h-8 cursor-pointer items-center rounded-[5px] border border-[#e6e2d8] bg-surface px-2.25 text-[9px] text-[#34322c] no-underline hover:bg-[#fff7df] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-surface'

/** `.bo-events-card` del diseño, para el organizador: los eventos de su organización. */
export function OrganizerEventsSection() {
  const section = useOrganizerEventsSection()
  const { events, pendingAction } = section
  const pendingMeta = pendingAction && ORGANIZER_EVENT_ACTION_META[pendingAction.action]

  return (
    <>
      <section className="overflow-hidden rounded-[9px] border border-backoffice-line bg-surface">
        <div className="px-4.5 pt-4.25 pb-3.75">
          <h2 className="m-0 mb-1.25 font-sans text-[13px] font-bold tracking-[-0.1px]">
            Tus eventos
          </h2>
          <p className="m-0 text-[10px] text-[#858178]">Seguí de cerca cada fecha y cada venta</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.25 px-4.25 pb-3.5">
          <label className="flex min-h-9 min-w-55 flex-1 items-center gap-2 rounded-[7px] border border-[#e6e3db] px-2.5 has-focus-visible:outline-3 has-focus-visible:outline-link">
            <Search aria-hidden className="size-4 text-[#8a877e]" />
            <span className="sr-only">Buscar eventos</span>
            <input
              value={section.query}
              onChange={(event) => section.setQuery(event.target.value)}
              placeholder="Buscar por evento o lugar"
              className="w-full border-0 bg-transparent text-[11px] outline-none"
            />
          </label>
          <label className="flex min-h-9 items-center gap-2 rounded-[7px] border border-[#e6e3db] px-2.5 has-focus-visible:outline-3 has-focus-visible:outline-link">
            <Filter aria-hidden className="size-3.75 text-[#8a877e]" />
            <span className="sr-only">Estado</span>
            <select
              value={section.statusFilter}
              onChange={(event) =>
                section.setStatusFilter(event.target.value as OrganizerEventStatusFilter)
              }
              className="cursor-pointer border-0 bg-transparent text-[11px] outline-none"
            >
              {ORGANIZER_EVENT_STATUS_FILTERS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {section.resultMessage && (
          <p
            role="status"
            className="m-0 flex items-center gap-2 border-y border-backoffice-line bg-[#e8f5eb] px-4.25 py-2.75 text-[10px] font-semibold text-[#27834c]"
          >
            <CheckCircle2 aria-hidden className="size-4" />
            {section.resultMessage}
          </p>
        )}

        {section.loadError && (
          <div role="alert" className="flex items-center gap-3 px-4.5 py-6 text-[11px]">
            <span className="font-medium text-error-ink">{section.loadError}</span>
            <button type="button" onClick={section.retryLoad} className={ROW_BUTTON_CLASS}>
              Reintentar
            </button>
          </div>
        )}

        {section.isLoading && <p className="m-0 px-4.5 py-6 text-[11px]">Cargando eventos…</p>}

        {!section.isLoading && !section.loadError && events.length === 0 && (
          <EmptyState hasEvents={section.totalEvents > 0} onClearFilters={section.clearFilters} />
        )}

        {events.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-200 border-collapse whitespace-nowrap">
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
                {events.map((event) => (
                  <OrganizerEventRow
                    key={event.id}
                    event={event}
                    creatorName={section.creatorName(event)}
                    isOwn={section.isOwnEvent(event)}
                    onAction={section.askAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-[#f0eee8] px-4.25 py-2.5 text-[9px] text-[#89867e]">
          Mostrando {events.length} eventos
        </div>
      </section>

      {pendingAction && pendingMeta && (
        <EventActionDialog
          eventName={pendingAction.event.name}
          title={pendingMeta.title}
          message={pendingMeta.message(pendingAction.event)}
          confirmLabel={pendingMeta.label}
          isDestructive={pendingMeta.isDestructive}
          requiresNameConfirmation={pendingMeta.requiresNameConfirmation}
          nameConfirmation={section.nameConfirmation}
          onNameConfirmationChange={section.setNameConfirmation}
          canConfirm={section.canConfirmAction}
          isRunning={section.isRunningAction}
          error={section.actionError}
          errorDetails={section.actionProblems}
          onConfirm={section.confirmAction}
          onClose={section.closeAction}
        />
      )}
    </>
  )
}

type EmptyStateProps = { hasEvents: boolean; onClearFilters: () => void }

/** `.bo-empty` del diseño: qué hacer cuando no hay nada para mostrar. */
function EmptyState({ hasEvents, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.75 px-3.75 py-9.5 text-center text-[#9a968c]">
      <CalendarDays aria-hidden className="size-6.5" />
      <b className="text-xs text-[#44413a]">
        {hasEvents
          ? 'No hay eventos con estos filtros'
          : 'Tu organización todavía no tiene eventos'}
      </b>
      <p className="m-0 text-[10px]">
        {hasEvents
          ? 'Probá con otro estado o cambiá tu búsqueda.'
          : 'Creá el primero para empezar a vender.'}
      </p>
      {hasEvents ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="min-h-9 cursor-pointer border-0 bg-transparent text-[10px] font-semibold text-link"
        >
          Limpiar filtros
        </button>
      ) : (
        <Link
          to={ROUTES.backoffice.createEvent}
          className="min-h-9 content-center text-[10px] font-semibold text-link"
        >
          Crear evento
        </Link>
      )}
    </div>
  )
}

type OrganizerEventRowProps = {
  event: OrganizerEvent
  creatorName: string | undefined
  isOwn: boolean
  onAction: (event: OrganizerEvent, action: OrganizerEventAction) => void
}

function OrganizerEventRow({ event, creatorName, isOwn, onAction }: OrganizerEventRowProps) {
  const cellClassName =
    'border-b border-[#f0eee8] px-2 py-2.5 align-middle text-[10px] text-[#5f5c55]'
  const availableActions = ORGANIZER_EVENT_ACTIONS.filter((action) =>
    (ORGANIZER_EVENT_ACTION_META[action].allowedFrom as readonly string[]).includes(event.status),
  )

  return (
    <tr className="last:[&>td]:border-b-0">
      <td className={cn(cellClassName, 'pl-4.5')}>
        <div className="flex items-center gap-2.5">
          {event.photoUrl ? (
            <img
              src={event.photoUrl}
              alt=""
              className="size-9 shrink-0 rounded-[6px] object-cover"
            />
          ) : (
            <span aria-hidden className="size-9 shrink-0 rounded-[6px] bg-[#f0eee8]" />
          )}
          <div className="flex flex-col gap-1">
            <b className="flex items-center gap-1.5 text-[11px] text-[#34322c]">
              {event.name}
              {event.highDemand && (
                <em className="rounded-[4px] bg-[#fff1c7] px-1.25 py-0.5 text-[7px] font-bold tracking-[0.4px] text-[#8a6100] not-italic">
                  ALTA DEMANDA
                </em>
              )}
            </b>
            <small className="text-[9px] text-[#858178]">
              {ADMIN_EVENT_TYPE_LABEL[event.type]}
              {creatorName && ` · Creó ${creatorName}`}
            </small>
          </div>
        </div>
      </td>
      <td className={cellClassName}>
        <div className="flex flex-col gap-1">
          <span>{formatEventDateTime(event.dateTime)}</span>
          <small className="flex items-center gap-1 text-[9px] text-[#858178]">
            <MapPin aria-hidden className="size-3" />
            {event.venue.name} · {event.venue.city}
          </small>
        </div>
      </td>
      <td className={cellClassName}>
        <BackofficeStatusBadge {...ORGANIZER_EVENT_STATUS_META[event.status]} />
      </td>
      <td className={cellClassName}>
        <div className="flex justify-end gap-1.5">
          {event.status !== 'DRAFT' && (
            <Link
              to={`${ROUTES.backoffice.report}?evento=${event.id}`}
              aria-label={`Ver reporte de ${event.name}`}
              className={ROW_BUTTON_CLASS}
            >
              Ver reporte
            </Link>
          )}
          {availableActions.map((action) => {
            const meta = ORGANIZER_EVENT_ACTION_META[action]
            const isBlocked = meta.onlyCreator && !isOwn
            return (
              <button
                key={action}
                type="button"
                aria-label={`${meta.label} ${event.name}`}
                disabled={isBlocked}
                title={isBlocked ? ONLY_CREATOR_REASON : undefined}
                onClick={() => onAction(event, action)}
                className={cn(
                  ROW_BUTTON_CLASS,
                  meta.isDestructive && 'border-[#e4b4aa] text-[#a43a2b]',
                )}
              >
                {meta.label}
                {isBlocked && ' · solo creador'}
              </button>
            )
          })}
        </div>
      </td>
    </tr>
  )
}
