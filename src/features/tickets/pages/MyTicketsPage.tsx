import { Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { ROUTES } from '@/shared/lib/routes'
import { OrderCard } from '../components/OrderCard'
import { useMyOrders } from '../hooks/useMyOrders'

export function MyTicketsPage() {
  const { orders } = useMyOrders()

  return (
    <section className="mx-auto flex w-full max-w-245 flex-col gap-5.5 px-4 pt-10 pb-18 md:px-7">
      <div className="flex flex-col gap-2">
        <span className="text-micro font-bold tracking-widest text-subtle uppercase">
          Tu historial de momentos
        </span>
        <PageTitle>Mis entradas</PageTitle>
      </div>

      {orders.length === 0 ? (
        <MyTicketsEmptyState />
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </section>
  )
}

function MyTicketsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-14 text-center text-muted">
      <Ticket aria-hidden="true" className="size-11 text-line-strong" />
      <h2 className="text-2xl font-bold text-ink">Todavía no tenés compras</h2>
      <p className="max-w-md text-sm">
        Cuando compres tus entradas, van a aparecer acá con su código QR listo para el ingreso.
      </p>
      <Button asChild variant="accent" className="mt-1">
        <Link to={ROUTES.home}>Explorar eventos</Link>
      </Button>
    </div>
  )
}
