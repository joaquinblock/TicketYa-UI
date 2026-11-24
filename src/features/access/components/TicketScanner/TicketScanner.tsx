import { ArrowRight, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/lib/routes'
import { SCAN_OUTCOME_META } from '../../constants/access.constants'
import type { ScanResult } from '../../types/access.types'
import { useTicketScanner } from './useTicketScanner'

/**
 * `ScannerView` del diseño, con el ingreso manual del código (la cámara queda para después). El
 * resultado ocupa la pantalla con un color por caso, para leerlo de un vistazo con poca luz.
 */
export function TicketScanner() {
  const { codeInputRef, ...scanner } = useTicketScanner()
  const { selectedEvent, result } = scanner

  if (scanner.isLoading) return <p className="m-0 text-sm text-[#5f5c55]">Cargando tus eventos…</p>

  if (scanner.loadError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 text-sm">
        <span className="font-medium text-error-ink">{scanner.loadError}</span>
        <button
          type="button"
          onClick={scanner.retry}
          className="min-h-11 cursor-pointer rounded-[7px] border border-[#dedbd3] bg-white px-4 text-sm font-semibold"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!selectedEvent) {
    return (
      <section className="rounded-[10px] border border-[#e7e4dc] bg-white p-5 text-center">
        <h1 className="m-0 mb-1 font-display text-base font-bold">No tenés eventos asignados</h1>
        <p className="m-0 mb-2 text-sm text-[#747168]">
          Pedile al organizador que te asigne a uno.
        </p>
        <Link to={ROUTES.access.home} className="text-sm font-semibold text-ink">
          Volver a tus eventos
        </Link>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-3.5">
      <h1 className="sr-only">Escanear entradas</h1>
      <label className="flex flex-col gap-1.25 text-[11px] font-bold tracking-[0.7px] text-[#77736b]">
        EVENTO
        <select
          value={selectedEvent.id}
          onChange={(changeEvent) => scanner.selectEvent(Number(changeEvent.target.value))}
          className="min-h-11 rounded-[6px] border border-[#e2dfd7] bg-white px-2.5 text-sm font-normal tracking-normal text-[#2c2a24]"
        >
          {scanner.events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </label>

      {result ? (
        <ScanResultView result={result} onScanAgain={scanner.scanAgain} />
      ) : (
        <form
          onSubmit={scanner.submit}
          className="rounded-[9px] border border-[#e7e4dc] bg-white p-3.5"
        >
          <label htmlFor="ticket-code" className="mb-2 block text-sm font-bold">
            Ingresá el código de la entrada
          </label>
          <div className="flex gap-2">
            <input
              id="ticket-code"
              ref={codeInputRef}
              value={scanner.code}
              onChange={(changeEvent) => scanner.setCode(changeEvent.target.value)}
              placeholder="Código del QR"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              autoFocus
              className="min-h-12 min-w-0 flex-1 rounded-[6px] border border-[#dfdcd4] px-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={!scanner.canSubmit}
              className="inline-flex min-h-12 cursor-pointer items-center gap-1.5 rounded-[7px] border border-accent bg-accent px-4 text-sm font-bold text-[#171717] hover:bg-[#f0b714] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {scanner.isScanning ? 'Validando…' : 'Validar'}
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
          <small className="mt-1.75 block text-xs leading-normal text-[#8b877f]">
            Es el código largo que el cliente ve debajo del QR, en Mis entradas.
          </small>
        </form>
      )}
    </div>
  )
}

type ScanResultViewProps = { result: ScanResult; onScanAgain: () => void }

function ScanResultView({ result, onScanAgain }: ScanResultViewProps) {
  const meta = SCAN_OUTCOME_META[result.outcome]
  const Icon = meta.icon

  return (
    <section
      aria-live="assertive"
      className={cn(
        'flex min-h-110 flex-col items-center justify-center rounded-xl px-5 py-8 text-center text-white',
        meta.toneClass,
      )}
    >
      <span className="mb-5 grid size-22.75 place-items-center rounded-full border-3 border-[#ffffffb0]">
        <Icon aria-hidden className="size-12" />
      </span>
      <p className="m-0 text-xs font-bold tracking-[0.7px] text-[#ffffffbf] uppercase">
        {meta.kicker}
      </p>
      <h2 className="my-2.5 font-display text-[clamp(29px,8vw,40px)] leading-[1.1] font-extrabold">
        {meta.title}
      </h2>
      <p className="m-0 max-w-85 text-[15px] leading-normal text-[#ffffffda]">{result.detail}</p>
      <button
        type="button"
        onClick={onScanAgain}
        className="mt-4.25 flex min-h-12 cursor-pointer items-center gap-2.25 rounded-[7px] border-0 bg-white px-4.5 text-sm font-bold text-[#25241f]"
      >
        <QrCode aria-hidden className="size-5" />
        Escanear otra entrada
      </button>
    </section>
  )
}
