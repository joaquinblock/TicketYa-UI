export function QueueSkeleton() {
  return (
    <section
      role="status"
      aria-label="Ingresando a la fila virtual"
      className="mx-auto flex w-full max-w-150 flex-col items-center gap-5 rounded-[18px] border border-line bg-surface px-5 py-10 md:px-10"
    >
      <div className="h-3 w-48 animate-pulse rounded bg-line" />
      <div className="h-24 w-40 animate-pulse rounded-xl bg-line" />
      <div className="h-6 w-64 animate-pulse rounded bg-line" />
      <div className="h-2 w-full animate-pulse rounded bg-line" />
      <div className="h-13.5 w-full animate-pulse rounded-xl bg-line" />
    </section>
  )
}
