const PULSE_CLASS = 'animate-pulse bg-line motion-reduce:animate-none'

/** Misma forma que el hero y "El evento", para que la página no salte cuando llega el evento. */
export function EventDetailSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Cargando evento
      </p>
      <div aria-hidden className="flex flex-col gap-8">
        <span className={`block min-h-105 rounded-2xl ${PULSE_CLASS}`} />
        <div className="flex flex-wrap items-start gap-8">
          <span className={`block h-14 min-w-0 flex-[999_1_560px] rounded-xl ${PULSE_CLASS}`} />
          <span className={`block h-72 min-w-0 flex-[1_1_300px] rounded-card ${PULSE_CLASS}`} />
        </div>
      </div>
    </>
  )
}
