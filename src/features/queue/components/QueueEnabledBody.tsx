import { formatEnabledUntilTime } from '../utils/queueFormat'

type QueueEnabledBodyProps = {
  enabledUntil: string | null
}

export function QueueEnabledBody({ enabledUntil }: QueueEnabledBodyProps) {
  const limitTime = enabledUntil ? formatEnabledUntilTime(enabledUntil) : '--:--'

  return (
    <>
      <div
        aria-live="polite"
        className="mt-5.5 font-mono text-[clamp(72px,14vw,128px)] leading-none font-normal tracking-[-0.06em] text-[#1c8a54]"
      >
        00
      </div>
      <h1 id="fila-titulo" className="mt-1.5 mb-2 text-[26px] font-bold">
        ¡Es tu turno!
      </h1>
      <p className="m-0 text-control text-subtle">
        Tenés hasta las <strong className="font-mono text-ink">{limitTime}</strong> para reservar
        tus lugares.
      </p>
    </>
  )
}
