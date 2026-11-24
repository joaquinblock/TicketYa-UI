import { CheckCircle2, Filter, MapPin, Search } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import {
  ADMIN_EVENT_ACTION_META,
  ADMIN_EVENT_ACTIONS,
  ADMIN_EVENT_STATUS_FILTERS,
  ADMIN_EVENT_STATUS_META,
  ADMIN_EVENT_TYPE_LABEL,
} from '../../constants/adminEvents.constants'
import type {
  AdminEvent,
  AdminEventAction,
  AdminEventStatusFilter,
} from '../../types/adminEvent.types'
import { BackofficeStatusBadge } from '../BackofficeStatusBadge'
import { EventActionDialog } from '../EventActionDialog'
import { useAdminEventsSection } from './useAdminEventsSection'

const TABLE_HEADERS = ['EVENTO', 'FECHA Y LUGAR', 'ORGANIZACIÓN', 'ESTADO', '']

/** `.bo-events-card` del diseño, para el administrador: todos los eventos y sus acciones. */
export function AdminEventsSection() {
  const section = useAdminEventsSection()
  const { events } = section

  return (
    <>
      <section className="overflow-hidden rounded-[9px] border border-backoffice-line bg-surface">
        <div className="px-4.5 pt-4.25 pb-3.75">
          <h2 className="m-0 mb-1.25 font-sans text-[13px] font-bold tracking-[-0.1px]">
            Eventos de la plataforma
          </h2>
          <p className="m-0 text-[10px] text-[#858178]">Actividad de todas las organizaciones</p>
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
                section.setStatusFilter(event.target.value as AdminEventStatusFilter)
              }
              className="cursor-pointer border-0 bg-transparent text-[11px] outline-none"
            >
              {ADMIN_EVENT_STATUS_FILTERS.map(({ value, label }) => (
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
          <p role="alert" className="m-0 px-4.5 py-6 text-[11px] font-medium text-error-ink">
            {section.loadError}
          </p>
        )}

        {section.isLoading && <p className="m-0 px-4.5 py-6 text-[11px]">Cargando eventos…</p>}

        {!section.isLoading && !section.loadError && events.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-1.75 px-3.75 py-9.5 text-[#9a968c]">
            <CheckCircle2 aria-hidden className="size-6" />
            <b className="text-xs text-[#44413a]">No hay eventos con estos filtros</b>
          </div>
        )}

        {events.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-230 border-collapse whitespace-nowrap">
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
                  <AdminEventRow
                    key={event.id}
                    event={event}
                    organizationName={section.organizationNames.get(event.organizationId)}
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

      {section.pendingAction && (
        <EventActionDialog
          eventName={section.pendingAction.event.name}
          title={ADMIN_EVENT_ACTION_META[section.pendingAction.action].title}
          message={ADMIN_EVENT_ACTION_META[section.pendingAction.action].message(
            section.pendingAction.event,
          )}
          confirmLabel={ADMIN_EVENT_ACTION_META[section.pendingAction.action].label}
          isDestructive={ADMIN_EVENT_ACTION_META[section.pendingAction.action].isDestructive}
          requiresNameConfirmation={section.pendingAction.action === 'cancel'}
          nameConfirmation={section.cancelConfirmation}
          onNameConfirmationChange={section.setCancelConfirmation}
          canConfirm={section.canConfirmAction}
          isRunning={section.isRunningAction}
          error={section.actionError}
          onConfirm={section.confirmAction}
          onClose={section.closeAction}
        />
      )}
    </>
  )
}

type AdminEventRowProps = {
  event: AdminEvent
  organizationName: string | undefined
  onAction: (event: AdminEvent, action: AdminEventAction) => void
}

function AdminEventRow({ event, organizationName, onAction }: AdminEventRowProps) {
  const cellClassName =
    'border-b border-[#f0eee8] px-2 py-2.5 align-middle text-[10px] text-[#5f5c55]'
  const availableActions = ADMIN_EVENT_ACTIONS.filter((action) =>
    (ADMIN_EVENT_ACTION_META[action].allowedFrom as readonly string[]).includes(event.status),
  )

  return (
    <tr className="last:[&>td]:border-b-0">
      <td className={cn(cellClassName, 'pl-4.5')}>
        <div className="flex flex-col gap-1">
          <b className="text-[11px] text-[#34322c]">{event.name}</b>
          <small className="text-[9px] text-[#858178]">{ADMIN_EVENT_TYPE_LABEL[event.type]}</small>
        </div>
      </td>
      <td className={cellClassName}>
        <div className="flex flex-col gap-1">
          <span>{formatEventDateTime(event.dateTime)}</span>
          <small className="flex items-center gap-1 text-[9px] text-[#858178]">
            <MapPin aria-hidden className="size-3" />
            {event.venueName} · {event.city}
          </small>
        </div>
      </td>
      <td className={cellClassName}>
        {organizationName ?? `Organización #${event.organizationId}`}
      </td>
      <td className={cellClassName}>
        <BackofficeStatusBadge {...ADMIN_EVENT_STATUS_META[event.status]} />
      </td>
      <td className={cellClassName}>
        <div className="flex justify-end gap-1.5">
          {availableActions.map((action) => (
            <button
              key={action}
              type="button"
              aria-label={`${ADMIN_EVENT_ACTION_META[action].label} ${event.name}`}
              onClick={() => onAction(event, action)}
              className={cn(
                'min-h-8 cursor-pointer rounded-[5px] border border-[#e6e2d8] bg-surface px-2.25 text-[9px] hover:bg-[#fff7df]',
                ADMIN_EVENT_ACTION_META[action].isDestructive && 'border-[#e4b4aa] text-[#a43a2b]',
              )}
            >
              {ADMIN_EVENT_ACTION_META[action].label}
            </button>
          ))}
        </div>
      </td>
    </tr>
  )
}
