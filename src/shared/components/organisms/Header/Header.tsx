import type { ReactNode } from 'react'
import { BrandLogo } from '@/shared/components/atoms/BrandLogo'
import { MainNav } from './MainNav'

/** `actions` es el lugar de la derecha: login, usuario y notificaciones. */
export function Header({ actions }: { actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="mx-auto grid min-h-19 max-w-310 grid-cols-[1fr_auto] items-center gap-3 px-4 md:grid-cols-[1fr_auto_1fr] md:px-7">
        <BrandLogo />
        <MainNav />
        <div className="flex items-center gap-3.5 justify-self-end">{actions}</div>
      </div>
    </header>
  )
}
