export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-52 rounded-lg bg-stone" />
      <div className="mt-2 h-4 w-36 rounded-md bg-stone/70" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-inkBorder bg-white shadow-sm"
          >
            <div className="aspect-video bg-stone" />
            <div className="space-y-2.5 p-4">
              <div className="h-5 w-3/4 rounded-md bg-stone" />
              <div className="h-3 w-1/2 rounded-md bg-stone/70" />
              <div className="mt-3 h-9 w-full rounded-lg bg-stone/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
