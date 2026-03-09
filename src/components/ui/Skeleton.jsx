export function ProductCardSkeleton() {
  return (
    <div className="card-press flex flex-col overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-ink-700" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-ink-700 rounded w-3/4" />
        <div className="h-3 bg-ink-700 rounded w-full" />
        <div className="h-3 bg-ink-700 rounded w-2/3" />
        <div className="mt-4 pt-4 border-t border-white/[0.07] flex justify-between">
          <div className="h-5 bg-ink-700 rounded w-16" />
          <div className="h-4 bg-ink-700 rounded w-10" />
        </div>
      </div>
    </div>
  )
}

export function PageSkeleton({ rows = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: rows }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
