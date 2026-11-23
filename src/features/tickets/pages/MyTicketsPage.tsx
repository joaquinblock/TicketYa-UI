import { PageTitle } from '@/shared/components/atoms/PageTitle'
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

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </section>
  )
}
