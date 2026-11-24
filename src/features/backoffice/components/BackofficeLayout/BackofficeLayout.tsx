import { LockKeyhole } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { LoginRequired } from '@/shared/components/molecules/LoginRequired/LoginRequired'
import { ROUTES } from '@/shared/lib/routes'
import { BackofficeSidebar } from '../BackofficeSidebar'
import { BackofficeStateView } from '../BackofficeStateView'
import { BackofficeTopbar } from '../BackofficeTopbar'
import { type BackofficeOutletContext, useBackofficeLayout } from './useBackofficeLayout'

/**
 * Template del backoffice que comparten administrador y organizador: sidebar con las secciones del
 * rol, topbar y el contenido de la ruta. Copiado de `ticketya-backoffice.tsx` del diseño.
 */
export function BackofficeLayout({ accountMenu }: { accountMenu: ReactNode }) {
  const { isLoggedIn, role, user, organizationName, isSectionAllowed, crumbLabel } =
    useBackofficeLayout()
  const [isNavOpen, setIsNavOpen] = useState(false)

  if (!isLoggedIn) {
    return (
      <main className="grid min-h-dvh place-items-center bg-backoffice px-4">
        <LoginRequired message="Iniciá sesión para entrar al backoffice." />
      </main>
    )
  }

  if (!role) {
    return (
      <main className="grid min-h-dvh place-items-center bg-backoffice px-4 text-[13px]">
        <BackofficeStateView
          icon={LockKeyhole}
          title="No tenés permiso para ver esto"
          text="El backoffice es para organizadores y administradores. Si necesitás acceso, hablá con la persona administradora."
        >
          <Link to={ROUTES.home} className="text-[11px] font-semibold text-ink">
            Volver a la tienda
          </Link>
        </BackofficeStateView>
      </main>
    )
  }

  const outletContext: BackofficeOutletContext = { role, organizationName }

  return (
    <div className="flex min-h-dvh bg-backoffice text-[13px] text-ink">
      <BackofficeSidebar
        role={role}
        organizationName={organizationName}
        user={user}
        isOpen={isNavOpen}
        onNavigate={() => setIsNavOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <BackofficeTopbar
          crumbLabel={crumbLabel}
          accountMenu={accountMenu}
          onToggleNav={() => setIsNavOpen((current) => !current)}
        />
        <main className="mx-auto max-w-360 px-3 pt-5.75 pb-11.25 sm:px-4.75 sm:pt-6.25 md:px-6 lg:px-8.75 lg:pt-8 lg:pb-15">
          {isSectionAllowed ? (
            <Outlet context={outletContext} />
          ) : (
            <BackofficeStateView
              icon={LockKeyhole}
              title="No tenés permiso para ver esto"
              text="Tu rol actual no permite acceder a esta sección. Si necesitás acceso, hablá con la persona administradora."
            >
              <Link
                to={ROUTES.backoffice.home}
                className="inline-flex min-h-9 items-center rounded-[7px] border border-[#dedbd3] bg-surface px-3.25 text-[11px] font-semibold text-ink no-underline hover:bg-[#f7f6f2] hover:text-ink"
              >
                Volver al inicio
              </Link>
            </BackofficeStateView>
          )}
        </main>
      </div>
      {isNavOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setIsNavOpen(false)}
          className="fixed inset-0 z-50 border-0 bg-[#15141061] sm:hidden"
        />
      )}
    </div>
  )
}
