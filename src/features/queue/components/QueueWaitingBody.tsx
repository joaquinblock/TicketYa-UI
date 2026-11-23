type QueueWaitingBodyProps = {
  position: number
}

export function QueueWaitingBody({ position }: QueueWaitingBodyProps) {
  const positionLabel = position.toLocaleString('es-AR')
  const hint =
    position < 500
      ? 'Ya casi llega tu turno. No cierres esta ventana.'
      : 'Te avisamos acá mismo cuando sea tu turno.'

  return (
    <>
      <div
        aria-live="polite"
        className="mt-5.5 font-mono text-[clamp(72px,14vw,128px)] leading-none font-normal tracking-[-0.06em] text-ink"
      >
        {positionLabel}
      </div>
      <h1 id="fila-titulo" className="mt-1.5 mb-2 text-[26px] font-bold">
        {position === 1 ? 'persona delante tuyo' : 'personas delante tuyo'}
      </h1>
      <p className="m-0 text-control text-subtle">{hint}</p>
    </>
  )
}
