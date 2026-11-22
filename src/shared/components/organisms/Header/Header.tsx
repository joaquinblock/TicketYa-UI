import type { ReactNode } from 'react'
import { BrandLogo } from '@/shared/components/atoms/BrandLogo'
import { MainNav } from './MainNav'
import { MobileNav } from './MobileNav/MobileNav'

/**
 * Mobile: logo, acciones y hamburguesa. Desde `md`: logo, navegación centrada y acciones.
 * `actions` es el lugar de las notificaciones y el usuario.
 */
export function Header({ actions }: { actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="mx-auto grid min-h-16 max-w-310 grid-cols-[1fr_auto] items-center gap-3 px-4 md:min-h-19 md:grid-cols-[1fr_auto_1fr] md:px-7">
        <BrandLogo />
        <MainNav />
        <div className="flex items-center gap-2 justify-self-end md:gap-3.5">
          {actions}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
