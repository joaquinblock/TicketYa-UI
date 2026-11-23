const PULSE_CLASS = 'animate-pulse bg-line motion-reduce:animate-none'

type EventSectorsSkeletonProps = { rowCount: number }

/** Una fila por sector y de la misma altura, para que la sección no salte cuando llegan los datos. */
export function EventSectorsSkeleton({ rowCount }: EventSectorsSkeletonProps) {
  return (
    <>
      <p role="status" className="sr-only">
        Cargando sectores
      </p>
      <div aria-hidden className="flex flex-col">
        {Array.from({ length: rowCount }, (_, index) => (
          <span key={index} className={`my-2 block h-15 rounded-xl ${PULSE_CLASS}`} />
        ))}
      </div>
    </>
  )
}
