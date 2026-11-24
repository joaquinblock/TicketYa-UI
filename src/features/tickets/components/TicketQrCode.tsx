import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

type TicketQrCodeProps = {
  qrValue: string | null
  code: string
  isActive: boolean
}

const QR_SIZE_PX = 136

export function TicketQrCode({ qrValue, code, isActive }: TicketQrCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const payload = qrValue || code

  useEffect(() => {
    let cancelled = false
    QRCode.toString(payload, {
      type: 'svg',
      margin: 1,
      width: QR_SIZE_PX,
      color: { dark: '#141414', light: '#ffffff' },
    })
      .then((svg) => {
        if (!cancelled) {
          setQrDataUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`)
        }
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })

    return () => {
      cancelled = true
    }
  }, [payload])

  const altText = isActive
    ? `Código QR de la entrada ${code}`
    : `Código QR no vigente de la entrada ${code}`

  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-surface p-3.5">
      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt={altText}
          width={QR_SIZE_PX}
          height={QR_SIZE_PX}
          className={isActive ? 'size-34' : 'size-34 opacity-30 grayscale'}
        />
      ) : (
        <div
          role="img"
          aria-label={altText}
          className="size-34 animate-pulse rounded bg-line motion-reduce:animate-none"
        />
      )}
      <span className="font-mono text-xs font-medium tracking-widest text-ink">{code}</span>
      {qrValue && isActive && (
        <span className="flex max-w-40 flex-col items-center gap-0.5 text-center">
          <span className="text-[10px] text-subtle">Código para la puerta</span>
          <span className="font-mono text-[10px] break-all text-ink select-all">{qrValue}</span>
        </span>
      )}
    </div>
  )
}
