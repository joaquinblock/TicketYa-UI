import type { StatusTone } from './returnRequests.constants'
import type {
  OrganizerEvent,
  OrganizerEventAction,
  OrganizerEventStatus,
  OrganizerEventStatusFilter,
} from '../types/organizerEvent.types'

/** Los estados del diseño (`StatusBadge` de `ticketya-backoffice.tsx`). */
export const ORGANIZER_EVENT_STATUS_META = {
  DRAFT: { label: 'Borrador', tone: 'gray' },
  PUBLISHED: { label: 'Publicado', tone: 'green' },
  SOLD_OUT: { label: 'Agotado', tone: 'amber' },
  SUSPENDED: { label: 'Suspendido', tone: 'orange' },
  CANCELLED: { label: 'Cancelado', tone: 'red' },
  FINISHED: { label: 'Finalizado', tone: 'gray' },
} as const satisfies Record<OrganizerEventStatus, { label: string; tone: StatusTone }>

export const ORGANIZER_EVENT_STATUS_FILTERS = [
  { value: 'ALL', label: 'Todos los estados' },
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'SOLD_OUT', label: 'Agotado' },
  { value: 'SUSPENDED', label: 'Suspendido' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'FINISHED', label: 'Finalizado' },
] as const satisfies readonly { value: OrganizerEventStatusFilter; label: string }[]

/** El motivo del diseño cuando el evento lo creó otro organizador de la organización. */
export const ONLY_CREATOR_REASON =
  'Solo quien creó el evento, o un administrador, puede suspenderlo, reanudarlo o cancelarlo'

type ActionMeta = {
  label: string
  title: string
  message: (event: OrganizerEvent) => string
  result: (event: OrganizerEvent) => string
  allowedFrom: readonly OrganizerEventStatus[]
  isDestructive: boolean
  /** Lo definitivo se confirma escribiendo el nombre del evento. */
  requiresNameConfirmation: boolean
  /** Suspender, reanudar y cancelar: solo el organizador que creó el evento. */
  onlyCreator: boolean
}

/** Las acciones de cada fila del diseño (`bo-row-menu`), en el orden en que se muestran. */
export const ORGANIZER_EVENT_ACTION_META = {
  publish: {
    label: 'Publicar',
    title: 'Publicar evento',
    message: (event) =>
      `“${event.name}” sale a la venta y aparece en la cartelera. Después ya no se puede editar.`,
    result: (event) => `${event.name}: publicado`,
    allowedFrom: ['DRAFT'],
    isDestructive: false,
    requiresNameConfirmation: false,
    onlyCreator: false,
  },
  delete: {
    label: 'Borrar',
    title: 'Borrar borrador',
    message: (event) =>
      `Se borra “${event.name}” con sus sectores y participantes. Esta acción es definitiva.`,
    result: (event) => `${event.name}: borrado`,
    allowedFrom: ['DRAFT'],
    isDestructive: true,
    requiresNameConfirmation: true,
    onlyCreator: false,
  },
  suspend: {
    label: 'Suspender',
    title: 'Suspender evento',
    message: (event) =>
      `Se frena la venta de “${event.name}”. Las entradas vendidas siguen siendo válidas.`,
    result: (event) => `${event.name}: suspendido`,
    allowedFrom: ['PUBLISHED', 'SOLD_OUT'],
    isDestructive: false,
    requiresNameConfirmation: false,
    onlyCreator: true,
  },
  resume: {
    label: 'Reanudar',
    title: 'Reanudar evento',
    message: (event) => `“${event.name}” vuelve a estar a la venta con su fecha actual.`,
    result: (event) => `${event.name}: reanudado`,
    allowedFrom: ['SUSPENDED'],
    isDestructive: false,
    requiresNameConfirmation: false,
    onlyCreator: true,
  },
  cancel: {
    label: 'Cancelar',
    title: 'Cancelar evento',
    message: (event) =>
      `Se cancela “${event.name}”. Se reintegran las entradas vendidas y se avisa a cada comprador. Esta acción es definitiva.`,
    result: (event) => `${event.name}: cancelado`,
    allowedFrom: ['PUBLISHED', 'SOLD_OUT', 'SUSPENDED'],
    isDestructive: true,
    requiresNameConfirmation: true,
    onlyCreator: true,
  },
} as const satisfies Record<OrganizerEventAction, ActionMeta>

export const ORGANIZER_EVENT_ACTIONS = [
  'publish',
  'delete',
  'suspend',
  'resume',
  'cancel',
] as const satisfies readonly OrganizerEventAction[]
