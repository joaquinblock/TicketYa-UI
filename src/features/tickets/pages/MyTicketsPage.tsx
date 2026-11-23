import { CircleAlert, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { Spinner } from '@/shared/components/atoms/Spinner'
import { ROUTES } from '@/shared/lib/routes'
import { OrderCard } from '../components/OrderCard'
import { useMyOrders } from '../hooks/useMyOrders'

export function MyTicketsPage() {
  const { orders, isPending, isError, refetch } = useMyOrders()

  return (
    <section className="mx-auto flex w-full max-w-245 flex-col gap-5.5 px-4 pt-10 pb-18 md:px-7">
      <div className="flex flex-col gap-2">
        <span className="text-micro font-bold tracking-widest text-subtle uppercase">
          Tu historial de momentos
        </span>
        <PageTitle>Mis entradas</PageTitle>
      </div>

      {isPending ? (
        <MyTicketsLoadingState />
      ) : isError ? (
        <MyTicketsErrorState onRetry={() => void refetch()} />
      ) : orders.length === 0 ? (
        <MyTicketsEmptyState />
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </section>
  )
}

function MyTicketsLoadingState() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 text-sm text-muted">
        <Spinner label="Cargando tus entradas" />
        <span aria-hidden="true">Cargando tus entradas...</span>
      </div>
      <div
        aria-hidden="true"
        className="h-44 animate-pulse rounded-2xl border border-line bg-surface motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="h-44 animate-pulse rounded-2xl border border-line bg-surface motion-reduce:animate-none"
      />
    </div>
  )
}

function MyTicketsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-12 text-center text-muted"
    >
      <CircleAlert aria-hidden="true" className="size-11 text-error-ink" />
      <h2 className="text-2xl font-bold text-ink">No pudimos cargar tus entradas</h2>
      <p className="max-w-md text-sm">
        Revisá tu conexión y probá de nuevo. Si sigue pasando, el problema es nuestro.
      </p>
      <Button onClick={onRetry} className="mt-1">
        Reintentar
      </Button>
    </div>
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
