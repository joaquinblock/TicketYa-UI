import type { EventType } from '@/shared/types/event.types'
import type { StatusTone } from './returnRequests.constants'
import type {
  AdminEvent,
  AdminEventAction,
  AdminEventStatus,
  AdminEventStatusFilter,
} from '../types/adminEvent.types'

/** Los estados del diseño (`StatusBadge` de `ticketya-backoffice.tsx`). */
export const ADMIN_EVENT_STATUS_META = {
  PUBLISHED: { label: 'Publicado', tone: 'green' },
  SOLD_OUT: { label: 'Agotado', tone: 'amber' },
  SUSPENDED: { label: 'Suspendido', tone: 'orange' },
  CANCELLED: { label: 'Cancelado', tone: 'red' },
  FINISHED: { label: 'Finalizado', tone: 'gray' },
} as const satisfies Record<AdminEventStatus, { label: string; tone: StatusTone }>

export const ADMIN_EVENT_STATUS_FILTERS = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'SOLD_OUT', label: 'Agotado' },
  { value: 'SUSPENDED', label: 'Suspendido' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'FINISHED', label: 'Finalizado' },
] as const satisfies readonly { value: AdminEventStatusFilter; label: string }[]

type ActionMeta = {
  label: string
  title: string
  message: (event: AdminEvent) => string
  result: (event: AdminEvent) => string
  allowedFrom: readonly AdminEventStatus[]
  isDestructive: boolean
}

/** Los textos del modal del diseño (`askAction`). */
export const ADMIN_EVENT_ACTION_META = {
  suspend: {
    label: 'Suspender',
    title: 'Suspender evento',
    message: (event) =>
      `Se frena la venta de “${event.name}”. Las entradas vendidas siguen siendo válidas.`,
    result: (event) => `${event.name}: suspendido`,
    allowedFrom: ['PUBLISHED', 'SOLD_OUT'],
    isDestructive: false,
  },
  resume: {
    label: 'Reanudar',
    title: 'Reanudar evento',
    message: (event) => `“${event.name}” vuelve a estar a la venta con su fecha actual.`,
    result: (event) => `${event.name}: publicado`,
    allowedFrom: ['SUSPENDED'],
    isDestructive: false,
  },
  cancel: {
    label: 'Cancelar',
    title: 'Cancelar evento',
    message: (event) =>
      `Se cancela “${event.name}”. Se reintegran las entradas vendidas y se avisa a cada comprador. Esta acción es definitiva.`,
    result: (event) => `${event.name}: cancelado`,
    allowedFrom: ['PUBLISHED', 'SOLD_OUT', 'SUSPENDED'],
    isDestructive: true,
  },
} as const satisfies Record<AdminEventAction, ActionMeta>

export const ADMIN_EVENT_ACTIONS = [
  'suspend',
  'resume',
  'cancel',
] as const satisfies readonly AdminEventAction[]

export const ADMIN_EVENT_TYPE_LABEL = {
  CONCERT: 'Recital',
  FESTIVAL: 'Festival',
  THEATER: 'Teatro',
  SPORTS: 'Deporte',
  CONFERENCE: 'Conferencia',
} as const satisfies Record<EventType, string>
