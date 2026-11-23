import { EventBoard } from '@/features/catalog/components/EventBoard/EventBoard'
import { EventSearchBox } from '@/features/catalog/components/EventSearchBox/EventSearchBox'
import { QuickTypeFilter } from '@/features/catalog/components/QuickTypeFilter'

/** Inicio combina `catalog` (cartelera) y `preferences` ("Para vos"), por eso vive en `pages/`. */
export function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="mx-auto w-full max-w-310 px-4 py-10 md:px-7 md:py-14">
        <EventBoard />
      </div>
    </>
  )
}

/** Hero recortado: el evento destacado y su cuenta regresiva llegan con #11. */
function HomeHero() {
  return (
    <section aria-labelledby="hero-titulo" className="bg-ink text-surface">
      <div className="mx-auto flex w-full max-w-310 flex-col gap-5.5 px-4 py-11 md:px-7 md:pt-18 md:pb-16">
        <h1 id="hero-titulo">Nadie más tiene tu lugar.</h1>
        <EventSearchBox />
        <QuickTypeFilter />
      </div>
    </section>
  )
}
