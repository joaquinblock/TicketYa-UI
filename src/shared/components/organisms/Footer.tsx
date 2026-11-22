import { Link } from 'react-router-dom'
import { BrandLogo } from '@/shared/components/atoms/BrandLogo'
import { ROUTES } from '@/shared/lib/routes'

type FooterLink = { label: string; to: string }

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Explorar',
    links: ['Recitales', 'Festivales', 'Teatro', 'Deportes', 'Conferencias'].map((label) => ({
      label,
      to: ROUTES.home,
    })),
  },
  {
    title: 'Ciudades',
    links: ['Buenos Aires', 'Rosario', 'Córdoba', 'Tandil'].map((label) => ({
      label,
      to: ROUTES.home,
    })),
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Mis entradas y QR', to: ROUTES.myTickets },
      { label: 'Devoluciones', to: ROUTES.myTickets },
      { label: 'Cómo funciona la fila virtual', to: ROUTES.home },
      { label: 'Medios de pago', to: ROUTES.home },
    ],
  },
]

const LEGAL_LINKS = ['Términos', 'Privacidad', 'Defensa del consumidor']

export function Footer() {
  return (
    <footer className="mt-auto border-t border-footer-line bg-footer text-muted">
      <div className="mx-auto flex max-w-310 flex-col gap-12 px-4 pt-16 pb-9 md:px-7">
        <div className="flex flex-wrap gap-x-14 gap-y-10">
          <div className="flex max-w-90 flex-[2_1_260px] flex-col gap-4">
            <BrandLogo hasRegisteredMark />
            <p className="text-sm leading-relaxed">
              Entradas para todo tipo de eventos, desde el club del barrio hasta el estadio. Comprás
              desde el celular, sin filas ni sobresaltos.
            </p>
            <Link
              to={ROUTES.preferences}
              className="font-bold text-ink underline decoration-accent decoration-3 underline-offset-4 hover:text-ink"
            >
              Avisame cuando toque mi artista favorito →
            </Link>
          </div>
          {FOOTER_COLUMNS.map(({ title, links }) => (
            <nav key={title} aria-label={title} className="flex-[1_1_150px]">
              <h3 className="mb-3.5 font-sans text-label font-bold tracking-widest text-ink uppercase">
                {title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-muted no-underline hover:text-ink hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-footer-line pt-5.5 text-label text-subtle">
          <span>© 2026 TicketYa® · Hecho en Argentina · Grupo 10 · Arquitectura Web, TUDAI</span>
          <span className="flex flex-wrap gap-5">
            {LEGAL_LINKS.map((label) => (
              <span key={label}>{label}</span>
            ))}
            <span>Pagás con crédito, débito o dinero en cuenta</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
