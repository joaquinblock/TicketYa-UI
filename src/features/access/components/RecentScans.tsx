import { Check, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { RECENT_SCANS_ON_HOME, SCAN_OUTCOME_META } from '../constants/access.constants'
import { readRecentScans } from '../lib/recentScans'

const TIME_FORMAT = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })

/** `.bo-staff-recent` del diseño: los últimos escaneos de este dispositivo. */
export function RecentScans() {
  const scans = readRecentScans().slice(0, RECENT_SCANS_ON_HOME)
  if (scans.length === 0) return null

  return (
    <section className="mt-6">
      <h2 className="m-0 mb-1 font-display text-[15px] font-bold">Últimos escaneos</h2>
      <ul className="m-0 list-none p-0">
        {scans.map((scan) => {
          const meta = SCAN_OUTCOME_META[scan.outcome]
          return (
            <li
              key={`${scan.scannedAt}-${scan.code}`}
              className="flex items-center gap-2.25 border-b border-[#e9e6df] py-2.5"
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full',
                  meta.isAccepted ? 'bg-[#e4f3e8] text-[#2d884b]' : 'bg-[#fff0e7] text-[#bb633c]',
                )}
              >
                {meta.isAccepted ? (
                  <Check aria-hidden className="size-3.5" />
                ) : (
                  <X aria-hidden className="size-3.5" />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <b className="truncate text-xs">
                  {meta.title} · {scan.code}
                </b>
                <small className="truncate text-[11px] text-[#817d74]">
                  {scan.eventName} · {scan.detail}
                </small>
              </span>
              <time dateTime={scan.scannedAt} className="text-[11px] text-[#817d74]">
                {TIME_FORMAT.format(new Date(scan.scannedAt))}
              </time>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
