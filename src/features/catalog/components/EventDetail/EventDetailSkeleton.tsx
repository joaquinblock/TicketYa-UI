/** Misma forma que el hero y "El evento", para que la página no salte cuando llega el evento. */
export function EventDetailSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Cargando evento
      </p>
      <div aria-hidden>
        <span />
        <span />
      </div>
    </>
  )
}
