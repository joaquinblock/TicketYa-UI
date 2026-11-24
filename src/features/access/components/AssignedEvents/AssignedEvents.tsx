import { ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'
import type { EventDetail } from '@/shared/types/event.types'
import { getEventDateParts } from '@/shared/utils/eventFormat'
import { AccessStatusBadge } from '../AccessStatusBadge'
import { useAssignedEventsSection } from './useAssignedEventsSection'

/** `StaffHome` del diseño: el próximo evento para empezar a escanear y los que vienen. */
export function AssignedEvents() {
  const { featured, others, hasEvents, isLoading, loadError, retry } = useAssignedEventsSection()

  if (isLoading) return <p className="m-0 text-sm text-[#5f5c55]">Cargando tus eventos…</p>

  if (loadError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 text-sm">
        <span className="font-medium text-error-ink">{loadError}</span>
        <button
          type="button"
          onClick={retry}
          className="min-h-11 cursor-pointer rounded-[7px] border border-[#dedbd3] bg-white px-4 text-sm font-semibold"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!hasEvents) {
    return (
      <section className="rounded-[10px] border border-[#e7e4dc] bg-white p-5 text-center">
        <CalendarDays aria-hidden className="mx-auto mb-2 size-7 text-[#9a968c]" />
        <h2 className="m-0 mb-1 font-display text-base font-bold">
          Todavía no tenés eventos asignados
        </h2>
        <p className="m-0 text-sm text-[#747168]">Pedile al organizador que te asigne a uno.</p>
      </section>
    )
  }

  return (
    <>
      {featured && <FeaturedEvent event={featured} />}
      {others.length > 0 && (
        <section className="mt-6.25">
          <h2 className="m-0 mb-2.5 font-display text-[15px] font-bold">
            {featured ? 'Próximamente' : 'Tus eventos'}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {others.map((event) => (
              <OtherEvent key={event.id} event={event} />
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

function FeaturedEvent({ event }: { event: EventDetail }) {
  const { day, month, time } = getEventDateParts(event.dateTime)

  return (
    <>
      <p className="m-0 mb-2.5 flex items-center gap-1.75 text-[11px] font-bold tracking-[0.65px] text-[#78746b]">
        <CalendarDays aria-hidden className="size-4" />
        PRÓXIMO · {Number(day)} {month.toUpperCase()}
      </p>
      <Link
        to={ROUTES.access.scanEvent(event.id)}
        className="block rounded-[10px] border border-[#e7e4dc] bg-white p-4 text-ink no-underline shadow-[0_2px_5px_#24201408] hover:border-[#d9c48a] hover:text-ink"
      >
        <AccessStatusBadge status={event.status} />
        <h2 className="mt-3.25 mb-1.75 font-display text-xl font-bold">{event.name}</h2>
        <p className="m-0 flex flex-wrap items-center gap-1.5 text-xs text-[#747168]">
          <Clock3 aria-hidden className="size-4" />
          {time}
          <span aria-hidden className="text-[#bbb7ae]">
            ·
          </span>
          <MapPin aria-hidden className="size-4" />
          {event.venue.name} · {event.venue.city}
        </p>
        <span className="mt-3.25 flex min-h-11 items-center justify-between border-t border-[#f0eee8] pt-3 text-sm font-bold text-[#806412]">
          Empezar a escanear <ArrowRight aria-hidden className="size-4.5" />
        </span>
      </Link>
    </>
  )
}

function OtherEvent({ event }: { event: EventDetail }) {
  const { day, month, time } = getEventDateParts(event.dateTime)

  return (
    <li>
      <Link
        to={ROUTES.access.scanEvent(event.id)}
        className="flex min-h-16 items-center gap-2.75 rounded-[8px] border border-[#e9e6df] bg-white p-3 text-ink no-underline hover:text-ink"
      >
        <span className="flex h-10.5 w-9.25 shrink-0 flex-col items-center justify-center rounded-[5px] bg-[#fff6da] font-display text-[17px] font-bold text-[#594817]">
          {Number(day)}
          <small className="font-sans text-[9px] font-bold">{month.toUpperCase()}</small>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <b className="truncate text-[13px]">{event.name}</b>
          <span className="flex items-center gap-1 truncate text-[11px] text-[#747168]">
            <Clock3 aria-hidden className="size-3.5 shrink-0" />
            {time} · {event.venue.name} · {event.venue.city}
          </span>
        </span>
        <AccessStatusBadge status={event.status} />
      </Link>
    </li>
  )
}
