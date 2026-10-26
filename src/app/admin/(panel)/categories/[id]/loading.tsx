export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-40 rounded-md bg-stone" />
      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="h-10 w-48 rounded-lg bg-stone" />
          <div className="mt-1 h-4 w-24 rounded-md bg-stone/70" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-stone" />
          <div className="h-10 w-28 rounded-lg bg-stone" />
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-inkBorder bg-white shadow-sm">
            <div className="aspect-square bg-stone" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 rounded-md bg-stone" />
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-lg bg-stone/70" />
                <div className="h-8 w-10 rounded-lg bg-stone/70" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
