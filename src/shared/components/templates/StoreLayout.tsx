import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '@/shared/components/organisms/Footer'
import { Header } from '@/shared/components/organisms/Header/Header'

/** Template de todas las pantallas del cliente: header, contenido de la ruta y footer. */
export function StoreLayout({ headerActions }: { headerActions?: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header actions={headerActions} />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
