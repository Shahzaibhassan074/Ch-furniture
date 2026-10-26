export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-20 rounded-md bg-stone" />
          <div className="mt-1 h-10 w-32 rounded-lg bg-stone" />
        </div>
        <div className="h-10 w-20 rounded-lg bg-stone" />
      </div>
      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
          <div className="h-7 w-20 rounded-lg bg-stone" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="mb-1.5 h-3 w-20 rounded-md bg-stone/70" />
                <div className="h-10 w-full rounded-lg bg-stone/60" />
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-4">
            <div className="h-10 w-full rounded-lg bg-stone/60" />
            <div className="h-24 w-full rounded-lg bg-stone/50" />
          </div>
        </div>
        <div className="rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
          <div className="h-7 w-36 rounded-lg bg-stone" />
          <div className="mt-4 h-32 w-full rounded-lg bg-stone/50" />
        </div>
      </div>
    </div>
  );
}
