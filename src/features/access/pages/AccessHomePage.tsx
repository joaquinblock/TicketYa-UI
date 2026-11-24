import { useOutletContext } from 'react-router-dom'
import type { AccessOutletContext } from '../components/AccessLayout/AccessLayout'
import { AssignedEvents } from '../components/AssignedEvents/AssignedEvents'
import { RecentScans } from '../components/RecentScans'

/** Inicio de la puerta: dónde está asignado el personal y qué escaneó último. */
export function AccessHomePage() {
  const { firstName } = useOutletContext<AccessOutletContext>()

  return (
    <>
      <div className="mb-5">
        <p className="m-0 text-[11px] font-bold tracking-[0.7px] text-[#8a6100]">
          {firstName ? `HOLA, ${firstName.toUpperCase()}` : 'PERSONAL DE ACCESO'}
        </p>
        <h1 className="my-1.75 font-display text-[30px] leading-[1.2] font-bold tracking-[-1px]">
          Puerta lista<span className="text-[#d79d0d]">.</span>
        </h1>
        <p className="m-0 text-sm text-[#716e66]">Estos son los eventos donde estás asignado.</p>
      </div>
      <AssignedEvents />
      <RecentScans />
    </>
  )
}
