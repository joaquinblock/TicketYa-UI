import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/atoms/Button'

type PaginationProps = {
  /** Desde 1. */
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-4">
      <Button variant="ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft aria-hidden className="size-4" />
        Anterior
      </Button>
      <p className="font-mono text-label text-muted">
        Página {page} de {totalPages}
      </p>
      <Button variant="ghost" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Siguiente
        <ChevronRight aria-hidden className="size-4" />
      </Button>
    </nav>
  )
}
