interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-6 h-24 w-56" />
          <Skeleton className="mt-4 h-4 w-32" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-20" />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
        <Skeleton className="h-5 w-32" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10" />
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md lg:col-span-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    </div>
  )
}
