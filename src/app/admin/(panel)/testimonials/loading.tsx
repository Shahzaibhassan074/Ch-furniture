export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-20 rounded-md bg-stone" />
          <div className="mt-1 h-10 w-44 rounded-lg bg-stone" />
          <div className="mt-1 h-4 w-28 rounded-md bg-stone/70" />
        </div>
        <div className="h-10 w-24 rounded-lg bg-stone" />
      </div>
      <div className="mt-8 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-inkBorder bg-white p-4 shadow-sm">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 rounded-md bg-stone" />
              <div className="h-3 w-24 rounded-md bg-stone/70" />
              <div className="h-8 w-full rounded-md bg-stone/50" />
            </div>
            <div className="h-9 w-9 rounded-lg bg-stone" />
            <div className="h-9 w-9 rounded-lg bg-stone" />
          </div>
        ))}
      </div>
    </div>
  );
}
