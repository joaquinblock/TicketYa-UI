export function QueueExpiredBody() {
  return (
    <>
      <div
        aria-live="polite"
        className="mt-5.5 font-mono text-[72px] leading-none font-normal tracking-[-0.06em] text-error-ink"
      >
        --:--
      </div>
      <h1 id="fila-titulo" className="mt-2.5 mb-2 text-[26px] font-bold">
        Se venció tu ventana
      </h1>
      <p className="m-0 text-control text-subtle">
        Pasaron los 10 minutos sin reservar. Podés volver a la fila: vas a quedar al final, con una
        posición nueva.
      </p>
    </>
  )
}
