import { PageTitle } from '@/shared/components/atoms/PageTitle'

/** Inicio combina `catalog` (cartelera) y `preferences` ("Para vos"), por eso vive en `pages/`. */
export function HomePage() {
  return (
    <section className="mx-auto w-full max-w-310 px-4 py-10 md:px-7 md:py-14">
      <PageTitle>Explorá eventos</PageTitle>
    </section>
  )
}
