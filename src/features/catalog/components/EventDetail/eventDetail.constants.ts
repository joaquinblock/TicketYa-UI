import type { ComponentProps } from 'react'
import type { Badge } from '@/shared/components/atoms/Badge'
import type { EventNoticeKind, OffSaleStatus } from '../../types/catalog.types'

type BadgeTone = NonNullable<ComponentProps<typeof Badge>['tone']>
type StatusBadge = { label: string; tone: BadgeTone }

/** El estado en palabras del usuario, nunca el código del backend. */
export const STATUS_BADGE = {
  SOLD_OUT: { label: 'Agotado', tone: 'neutral' },
  SUSPENDED: { label: 'Suspendido', tone: 'warning' },
  CANCELLED: { label: 'Cancelado', tone: 'error' },
  FINISHED: { label: 'Finalizado', tone: 'neutral' },
} as const satisfies Record<OffSaleStatus, StatusBadge>

/** Colores del mockup: azul para informar, rojo si ya no hay entradas, amarillo si está en pausa. */
export const NOTICE_TONE_CLASS = {
  HIGH_DEMAND: 'bg-info text-info-ink',
  SALE_NOT_STARTED: 'bg-info text-info-ink',
  SOLD_OUT: 'bg-error text-error-ink',
  CANCELLED: 'bg-error text-error-ink',
  SUSPENDED: 'bg-warning text-warning-ink',
  FINISHED: 'bg-line text-ink',
} as const satisfies Record<EventNoticeKind, string>
