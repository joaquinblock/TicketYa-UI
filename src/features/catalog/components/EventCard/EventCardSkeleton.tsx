/** Misma forma que `EventCard`, para que la grilla no salte cuando llegan los eventos. */
export function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      <span className="aspect-video animate-pulse bg-line motion-reduce:animate-none" />
      <div className="flex flex-col gap-2.5 px-4 pt-4 pb-3.5">
        <SkeletonLine className="h-3 w-2/5" />
        <SkeletonLine className="h-5.5 w-4/5" />
        <SkeletonLine className="h-3.5 w-3/5" />
        <SkeletonLine className="mt-2 h-3.5 w-1/3 self-end" />
      </div>
    </div>
  )
}

function SkeletonLine({ className }: { className: string }) {
  return (
    <span
      className={`block animate-pulse rounded-md bg-line motion-reduce:animate-none ${className}`}
    />
  )
}
