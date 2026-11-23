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

const HERO_BACKGROUND_URL =
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80'

/** Hero recortado: el evento destacado y su cuenta regresiva llegan con #11. */
function HomeHero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden bg-ink text-surface"
    >
      <img
        src={HERO_BACKGROUND_URL}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 size-full object-cover object-[center_40%]"
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-ink/88 via-ink/62 to-ink/35"
      />
      <div className="relative mx-auto flex w-full max-w-310 flex-col gap-5.5 px-4 py-11 md:px-7 md:pt-18 md:pb-16">
        <p className="flex items-center gap-2.5 text-xs font-bold tracking-widest text-surface/90 uppercase">
          <span aria-hidden className="h-0.5 w-5.5 bg-accent" />
          Recitales · festivales · teatro · partidos · conferencias
        </p>
        <h1 id="hero-titulo" className="max-w-190 text-display">
          Nadie más tiene <span className="text-accent">tu lugar.</span>
        </h1>
        <p className="max-w-140 text-lg leading-relaxed text-surface/90">
          Elegís el asiento, te lo guardamos 10 minutos mientras pagás y la entrada te llega con un
          QR que vale una sola vez. Aunque haya miles comprando al mismo tiempo.
        </p>
        <EventSearchBox />
        <QuickTypeFilter />
      </div>
    </section>
  )
}
