/** Una asignación del personal (`GET /api/users/me/access-assignments`). */
export type AccessAssignment = { staffId: number; eventId: number }

/** La entrada que acaba de ingresar (`POST /api/tickets/check-in`). */
export type CheckInResponse = {
  ticketId: number
  sectorName: string
  /** `null` en un sector sin numerar. */
  row: string | null
  number: number | null
  usedAt: string
}

/** Cada resultado de la puerta del diseño (`resultMap` de `ScannerView`). */
export type ScanOutcome = 'valid' | 'used' | 'invalid' | 'unassigned' | 'forbidden' | 'offline'

export type ScanResult = { outcome: ScanOutcome; detail: string }

/** Un escaneo guardado en este dispositivo, para "Últimos escaneos". */
export type RecentScan = {
  scannedAt: string
  code: string
  eventName: string
  outcome: ScanOutcome
  detail: string
}

export type AccessUser = { firstName: string; lastName: string; email: string }
