import type { ReturnRequestFilter, ReturnRequestStatus } from '../types/returnRequest.types'

/** Las pestañas del diseño, en su orden. */
export const RETURN_REQUEST_TABS = [
  { filter: 'PENDING', label: 'Pendientes' },
  { filter: 'APPROVED', label: 'Aprobadas' },
  { filter: 'REJECTED', label: 'Rechazadas' },
  { filter: 'CANCELLED', label: 'Canceladas' },
  { filter: 'ALL', label: 'Todas' },
] as const satisfies readonly { filter: ReturnRequestFilter; label: string }[]

export const DEFAULT_RETURN_REQUEST_FILTER = 'PENDING' satisfies ReturnRequestFilter

type StatusTone = 'amber' | 'green' | 'red' | 'gray'

export const RETURN_REQUEST_STATUS_META = {
  PENDING: { label: 'Pendiente', tone: 'amber' },
  APPROVED: { label: 'Aprobada', tone: 'green' },
  REJECTED: { label: 'Rechazada', tone: 'red' },
  CANCELLED: { label: 'Cancelada', tone: 'gray' },
} as const satisfies Record<ReturnRequestStatus, { label: string; tone: StatusTone }>

/** Colores de `.bo-status` del diseño. */
export const STATUS_TONE_CLASS = {
  amber: 'bg-[#fff5d9] text-[#987117]',
  green: 'bg-[#e8f5eb] text-[#27834c]',
  red: 'bg-[#ffedeb] text-[#b93e32]',
  gray: 'bg-[#f0efec] text-[#73716b]',
} as const satisfies Record<StatusTone, string>

export const RESOLUTION_META = {
  approve: {
    confirmLabel: 'Aprobar reintegro',
    question: '¿Aprobar el reintegro?',
    result:
      'Reintegro aprobado: se devuelve el dinero al medio de pago original y se libera el lugar.',
  },
  reject: {
    confirmLabel: 'Rechazar',
    question: '¿Rechazar la solicitud?',
    result: 'Solicitud rechazada. La entrada sigue vigente.',
  },
} as const
