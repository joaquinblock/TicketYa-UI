import { Skeleton } from '@/shared/components/atoms/Skeleton'

export function PreferencesSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando tus preferencias"
      className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6"
    >
      <Skeleton className="h-6 w-48" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-10.5 w-28 rounded-full" />
        <Skeleton className="h-10.5 w-28 rounded-full" />
        <Skeleton className="h-10.5 w-24 rounded-full" />
      </div>
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-11 w-64" />
    </div>
  )
}
