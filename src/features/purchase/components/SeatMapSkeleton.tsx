import { Skeleton } from '@/shared/components/atoms/Skeleton'

const TAB_COUNT = 2
const ROW_COUNT = 5

/** Con la forma del mapa (pestañas, escenario y filas), para que la página no salte al cargar. */
export function SeatMapSkeleton() {
  return (
    <div role="status" aria-label="Cargando lugares" className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {Array.from({ length: TAB_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-14.5 rounded-control" />
        ))}
      </div>
      <Skeleton className="mx-auto h-8.5 w-full max-w-140 rounded-control" />
      <div className="flex flex-col items-center gap-1.5">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-7.5 w-full max-w-130 rounded-md" />
        ))}
      </div>
    </div>
  )
}
