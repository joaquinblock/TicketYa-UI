export function PaymentSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando tu reserva"
      className="flex flex-wrap items-start gap-5"
    >
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
        <div className="h-17 animate-pulse rounded-xl bg-line" />
        <div className="h-96 animate-pulse rounded-2xl border border-line bg-surface" />
      </div>
      <div className="h-88 min-w-0 flex-[1_1_320px] animate-pulse rounded-2xl border border-line bg-surface" />
    </div>
  )
}
