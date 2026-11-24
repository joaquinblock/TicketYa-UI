import { RECENT_SCANS_LIMIT } from '../constants/access.constants'
import type { RecentScan } from '../types/access.types'

const RECENT_SCANS_KEY = 'ticketya.access.recentScans'

/**
 * Los últimos escaneos de este dispositivo. Es una ayuda para el personal, no un registro: el
 * ingreso real queda en el ticket-service. Si el navegador no deja guardar, la lista queda vacía.
 */
export function readRecentScans(): RecentScan[] {
  try {
    const stored = localStorage.getItem(RECENT_SCANS_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? (parsed as RecentScan[]) : []
  } catch {
    return []
  }
}

export function saveRecentScan(scan: RecentScan) {
  try {
    const scans = [scan, ...readRecentScans()].slice(0, RECENT_SCANS_LIMIT)
    localStorage.setItem(RECENT_SCANS_KEY, JSON.stringify(scans))
  } catch {
    // Sin almacenamiento, el escaneo igual quedó validado en el backend.
  }
}
