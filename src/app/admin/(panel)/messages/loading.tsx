export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded-md bg-stone" />
      <div className="mt-1 h-10 w-40 rounded-lg bg-stone" />
      <div className="mt-1 h-4 w-32 rounded-md bg-stone/70" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-inkBorder bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded-md bg-stone" />
                <div className="h-3 w-48 rounded-md bg-stone/70" />
                <div className="mt-3 h-12 w-full rounded-md bg-stone/50" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-9 rounded-lg bg-stone" />
                <div className="h-9 w-9 rounded-lg bg-stone" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
