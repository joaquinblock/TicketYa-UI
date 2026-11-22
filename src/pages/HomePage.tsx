import { EventBoard } from '@/features/catalog/components/EventBoard/EventBoard'

/** Inicio combina `catalog` (cartelera) y `preferences` ("Para vos"), por eso vive en `pages/`. */
export function HomePage() {
  return (
    <div className="mx-auto w-full max-w-310 px-4 py-10 md:px-7 md:py-14">
      <EventBoard />
    </div>
  )
}
