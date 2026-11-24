import { useMutation } from '@tanstack/react-query'
import { type FormEvent, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApiError } from '@/shared/lib/http/ApiError'
import { SCAN_OUTCOME_DETAIL } from '../../constants/access.constants'
import { useAssignedEvents } from '../../hooks/useAssignedEvents'
import { saveRecentScan } from '../../lib/recentScans'
import { checkIn } from '../../services/access.service'
import type { CheckInResponse, ScanResult } from '../../types/access.types'

const EVENT_PARAM = 'evento'
const CLOSED_STATUSES = ['CANCELLED', 'FINISHED']

function seatDetail({ sectorName, row, number }: CheckInResponse): string {
  if (row === null || number === null) return sectorName
  return `${sectorName} · Fila ${row}, asiento ${number}`
}

/** Traduce el rechazo del ticket-service a lo que el personal tiene que hacer en la puerta. */
function rejectionResult(error: unknown): ScanResult {
  if (!(error instanceof ApiError) || error.status >= 500) {
    return { outcome: 'offline', detail: SCAN_OUTCOME_DETAIL.offline }
  }
  switch (error.code) {
    case 'ticket_already_used':
      return { outcome: 'used', detail: error.message }
    case 'staff_not_assigned':
      return { outcome: 'unassigned', detail: SCAN_OUTCOME_DETAIL.unassigned }
    case 'forbidden':
      return { outcome: 'forbidden', detail: SCAN_OUTCOME_DETAIL.forbidden }
    default:
      return { outcome: 'invalid', detail: SCAN_OUTCOME_DETAIL.invalid }
  }
}

/** Un código para "Últimos escaneos" que no ocupe toda la fila: el QR es un UUID largo. */
function shortCode(code: string): string {
  return code.length > 12 ? `${code.slice(0, 8)}…` : code
}

type ScanRequest = { eventId: number; eventName: string; qrCode: string }

/**
 * Validar entradas de a una: elegir el evento, ingresar el código y ver el resultado a pantalla
 * completa. "Escanear otra entrada" vuelve al campo, con el foco listo para la siguiente.
 */
export function useTicketScanner() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { events, isLoading, loadError, retry } = useAssignedEvents()
  const [code, setCode] = useState('')
  const [result, setResult] = useState<ScanResult>()
  const codeInputRef = useRef<HTMLInputElement>(null)

  const requestedId = Number(searchParams.get(EVENT_PARAM))
  const selectedEvent =
    events.find((event) => event.id === requestedId) ??
    events.find((event) => !CLOSED_STATUSES.includes(event.status)) ??
    events[0]

  const showResult = ({ eventName, qrCode }: ScanRequest, scanResult: ScanResult) => {
    setResult(scanResult)
    saveRecentScan({
      scannedAt: new Date().toISOString(),
      code: shortCode(qrCode),
      eventName,
      ...scanResult,
    })
  }

  const scanMutation = useMutation({
    mutationFn: ({ eventId, qrCode }: ScanRequest) => checkIn(eventId, qrCode),
    meta: { handlesErrorInline: true },
    onSuccess: (ticket, request) =>
      showResult(request, { outcome: 'valid', detail: seatDetail(ticket) }),
    onError: (error, request) => showResult(request, rejectionResult(error)),
  })

  const submit = (formEvent: FormEvent) => {
    formEvent.preventDefault()
    const qrCode = code.trim()
    if (!selectedEvent || !qrCode || scanMutation.isPending) return
    scanMutation.mutate({ eventId: selectedEvent.id, eventName: selectedEvent.name, qrCode })
  }

  const scanAgain = () => {
    setResult(undefined)
    setCode('')
    requestAnimationFrame(() => codeInputRef.current?.focus())
  }

  return {
    events,
    selectedEvent,
    selectEvent: (eventId: number) => {
      setSearchParams({ [EVENT_PARAM]: String(eventId) }, { replace: true })
      scanAgain()
    },
    isLoading,
    loadError,
    retry,
    code,
    setCode,
    codeInputRef,
    canSubmit: Boolean(selectedEvent) && code.trim() !== '' && !scanMutation.isPending,
    isScanning: scanMutation.isPending,
    submit,
    result,
    scanAgain,
  }
}
