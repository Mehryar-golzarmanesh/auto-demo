// Shown instantly while the real results are still loading on the server.
export function ResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="در حال بارگذاری خودروها" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-[#181c22]">
          <div className="aspect-[16/10] bg-[#31353c]" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 rounded bg-[#31353c]" />
            <div className="h-5 w-3/4 rounded bg-[#31353c]" />
            <div className="h-12 rounded bg-[#1c2026]" />
            <div className="h-6 w-1/2 rounded bg-[#31353c]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SidebarSkeleton() {
  return <div aria-hidden className="h-[520px] animate-pulse rounded-xl bg-[#181c22]" />
}
