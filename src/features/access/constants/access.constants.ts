import { Ban, CheckCircle2, CircleAlert, LockKeyhole, type LucideIcon, X } from 'lucide-react'
import type { EventStatus } from '@/shared/types/event.types'
import type { ScanOutcome } from '../types/access.types'

export const ACCESS_STAFF_ROLE = 'ACCESS_STAFF'

/** Cuántos escaneos guarda el dispositivo y cuántos muestra el inicio. */
export const RECENT_SCANS_LIMIT = 20
export const RECENT_SCANS_ON_HOME = 3

type OutcomeMeta = {
  kicker: string
  title: string
  icon: LucideIcon
  /** Fondo de `.bo-scan-result` del diseño. */
  toneClass: string
  /** Para "Últimos escaneos": verde si pasó, naranja si no. */
  isAccepted: boolean
}

/** Los textos y colores de `resultMap` del diseño. */
export const SCAN_OUTCOME_META = {
  valid: {
    kicker: 'Entrada válida',
    title: 'Puede pasar',
    icon: CheckCircle2,
    toneClass: 'bg-[#176b3f]',
    isAccepted: true,
  },
  used: {
    kicker: 'No se puede usar dos veces',
    title: 'Esta entrada ya ingresó',
    icon: CircleAlert,
    toneClass: 'bg-[#962f28]',
    isAccepted: false,
  },
  invalid: {
    kicker: 'No existe, es de otro evento, fue anulada o reintegrada',
    title: 'Entrada inválida',
    icon: X,
    toneClass: 'bg-[#962f28]',
    isAccepted: false,
  },
  unassigned: {
    kicker: 'No podés validar entradas en este evento',
    title: 'No estás asignado',
    icon: LockKeyhole,
    toneClass: 'bg-[#962f28]',
    isAccepted: false,
  },
  forbidden: {
    kicker: 'Esta cuenta no es personal de acceso',
    title: 'Acceso no habilitado',
    icon: LockKeyhole,
    toneClass: 'bg-[#962f28]',
    isAccepted: false,
  },
  offline: {
    kicker: 'No pudimos validar la entrada',
    title: 'Sin conexión',
    icon: Ban,
    toneClass: 'bg-[#7a5d12]',
    isAccepted: false,
  },
} as const satisfies Record<ScanOutcome, OutcomeMeta>

/** Lo que se le dice al personal en cada rechazo: qué hacer, no el código del error. */
export const SCAN_OUTCOME_DETAIL = {
  invalid: 'No dejes pasar sin una entrada válida.',
  unassigned: 'Pedile al organizador que te asigne.',
  forbidden: 'Ingresá con tu cuenta de personal de acceso.',
  offline: 'Reintentá. No dejes pasar a nadie sin validar.',
} as const satisfies Partial<Record<ScanOutcome, string>>

/** Los estados que se muestran en la puerta, con el mismo badge que el resto del producto. */
export const ACCESS_EVENT_STATUS_META = {
  PUBLISHED: { label: 'Publicado', className: 'bg-[#e8f5eb] text-[#27834c]' },
  SOLD_OUT: { label: 'Agotado', className: 'bg-[#fff4d6] text-[#94650b]' },
  SUSPENDED: { label: 'Suspendido', className: 'bg-[#fff0e7] text-[#b2582c]' },
  CANCELLED: { label: 'Cancelado', className: 'bg-[#ffedeb] text-[#b93e32]' },
  FINISHED: { label: 'Finalizado', className: 'bg-[#f0eee8] text-[#6f6b62]' },
} as const satisfies Record<EventStatus, { label: string; className: string }>
