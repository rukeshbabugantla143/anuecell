export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-12">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0f17]/50 p-6 rounded-2xl border border-border-color backdrop-blur-sm">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-elevated-surface rounded-lg"></div>
          <div className="h-4 w-48 bg-elevated-surface/60 rounded"></div>
        </div>
        <div className="h-10 w-36 bg-elevated-surface rounded-xl"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#101827] border border-border-color rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3 w-28 bg-elevated-surface/80 rounded"></div>
                <div className="h-8 w-16 bg-elevated-surface rounded-lg"></div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-elevated-surface/60"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#101827] border border-border-color rounded-xl p-6 space-y-4">
          <div className="h-6 w-40 bg-elevated-surface rounded"></div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-elevated-surface/40 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="bg-[#101827] border border-border-color rounded-xl p-6 space-y-4">
          <div className="h-6 w-36 bg-elevated-surface rounded"></div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-elevated-surface/40 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
