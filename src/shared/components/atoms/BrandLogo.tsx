import { Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/routes'

type BrandLogoProps = { hasRegisteredMark?: boolean }

export function BrandLogo({ hasRegisteredMark = false }: BrandLogoProps) {
  return (
    <Link
      to={ROUTES.home}
      aria-label="TicketYa, inicio"
      className="inline-flex items-center gap-2 font-display text-brand font-extrabold tracking-tight text-ink no-underline hover:text-ink"
    >
      <span className="grid size-9 place-items-center rounded-control bg-accent">
        <Ticket aria-hidden className="size-5" />
      </span>
      TicketYa
      {hasRegisteredMark && <sup className="text-xs font-semibold">®</sup>}
    </Link>
  )
}
