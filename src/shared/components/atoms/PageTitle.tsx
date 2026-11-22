import type { ReactNode } from 'react'

/** Título de página del mockup: Archivo 800 con el punto amarillo al final. */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-4xl font-extrabold">
      {children}
      <span className="text-accent">.</span>
    </h1>
  )
}
