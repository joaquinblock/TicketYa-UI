import { ArrowLeft, CalendarDays, LockKeyhole, QrCode } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { LoginRequired } from '@/shared/components/molecules/LoginRequired/LoginRequired'
import { cn } from '@/shared/lib/cn'
import { ROUTES } from '@/shared/lib/routes'
import { useAccessLayout } from './useAccessLayout'

export type AccessOutletContext = { firstName: string | undefined }

/**
 * `.bo-staff-app` del diseño: una columna para el celular, sin sidebar, con la barra inferior al
 * alcance del pulgar (Fitts). Se usa en la puerta, con una mano y poca luz.
 */
export function AccessLayout({ accountMenu }: { accountMenu: ReactNode }) {
  const { isLoggedIn, isAccessStaff, firstName, isScanTab } = useAccessLayout()

  if (!isLoggedIn) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#f6f5f0] px-4">
        <LoginRequired message="Iniciá sesión para validar entradas." />
      </main>
    )
  }

  if (!isAccessStaff) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#f6f5f0] px-4 text-center">
        <section className="flex max-w-90 flex-col items-center gap-2.5 text-[#79766e]">
          <LockKeyhole aria-hidden className="size-9" />
          <h1 className="m-0 font-display text-xl font-bold text-[#26251f]">
            No tenés permiso para ver esto
          </h1>
          <p className="m-0 text-sm leading-normal">
            La puerta es para el personal de acceso. Ingresá con esa cuenta para validar entradas.
          </p>
          <Link to={ROUTES.home} className="min-h-11 content-center text-sm font-semibold text-ink">
            Volver a la tienda
          </Link>
        </section>
      </main>
    )
  }

  const outletContext: AccessOutletContext = { firstName }

  return (
    <div className="min-h-dvh bg-[#121310]">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-170 flex-col bg-[#f6f5f0] pb-16.5 text-[#171713]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#e7e4dc] bg-[#f6f5f0] px-3.25 sm:h-14.5 sm:px-4.25">
          <Link
            to={ROUTES.home}
            className="flex min-h-11 items-center gap-1.75 font-display text-base font-extrabold text-ink no-underline hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4.25" />
            TicketYa
          </Link>
          {accountMenu}
        </header>
        <main className="mx-auto w-full max-w-142.5 flex-1 px-4.75 pt-5.5 pb-7">
          <Outlet context={outletContext} />
        </main>
      </div>
      <nav
        aria-label="Puerta"
        className="fixed inset-x-0 bottom-0 z-30 flex h-15.5 justify-center border-t border-[#e5e2da] bg-white"
      >
        <BottomTab to={ROUTES.access.home} isActive={!isScanTab} icon={CalendarDays}>
          Eventos
        </BottomTab>
        <BottomTab to={ROUTES.access.scan} isActive={isScanTab} icon={QrCode}>
          Escanear
        </BottomTab>
      </nav>
    </div>
  )
}

type BottomTabProps = {
  to: string
  isActive: boolean
  icon: typeof QrCode
  children: ReactNode
}

function BottomTab({ to, isActive, icon: Icon, children }: BottomTabProps) {
  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex max-w-55 flex-1 flex-col items-center justify-center gap-1 text-[11px] no-underline',
        isActive ? 'font-bold text-[#987511]' : 'text-[#858178] hover:text-[#5f5c55]',
      )}
    >
      <Icon aria-hidden className="size-5" />
      {children}
    </Link>
  )
}
