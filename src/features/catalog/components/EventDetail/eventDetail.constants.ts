import type { ComponentProps } from 'react'
import type { Badge } from '@/shared/components/atoms/Badge'
import type { OffSaleStatus } from '../../types/catalog.types'

type BadgeTone = NonNullable<ComponentProps<typeof Badge>['tone']>
type StatusBadge = { label: string; tone: BadgeTone }

/** El estado en palabras del usuario, nunca el código del backend. */
export const STATUS_BADGE = {
  SOLD_OUT: { label: 'Agotado', tone: 'neutral' },
  SUSPENDED: { label: 'Suspendido', tone: 'warning' },
  CANCELLED: { label: 'Cancelado', tone: 'error' },
  FINISHED: { label: 'Finalizado', tone: 'neutral' },
} as const satisfies Record<OffSaleStatus, StatusBadge>
