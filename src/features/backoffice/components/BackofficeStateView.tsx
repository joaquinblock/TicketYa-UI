import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type BackofficeStateViewProps = {
  icon: LucideIcon
  title: string
  text: string
  children?: ReactNode
}

/** Estado de pantalla completa del backoffice (sin permiso, próximamente), como `.bo-state`. */
export function BackofficeStateView({
  icon: Icon,
  title,
  text,
  children,
}: BackofficeStateViewProps) {
  return (
    <section className="flex min-h-90 flex-col items-center justify-center gap-2.5 text-center text-[#79766e]">
      <Icon aria-hidden className="size-9" />
      <h2 className="my-0.75 font-display text-lg font-bold text-[#26251f]">{title}</h2>
      <p className="m-0 mb-1.5 max-w-97.5 text-[11px] leading-[1.6]">{text}</p>
      {children}
    </section>
  )
}
