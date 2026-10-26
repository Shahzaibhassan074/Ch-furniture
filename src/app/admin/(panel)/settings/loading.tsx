export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-28 rounded-md bg-stone" />
      <div className="mt-1 h-10 w-32 rounded-lg bg-stone" />
      <div className="mt-1 h-4 w-64 rounded-md bg-stone/70" />
      <div className="mt-8 space-y-6">
        {["Brand", "Contact", "Social", "About", "SEO"].map((s) => (
          <div key={s} className="rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
            <div className="h-7 w-28 rounded-lg bg-stone" />
            <div className="mt-5 space-y-4">
              <div className="h-10 w-full rounded-lg bg-stone/60" />
              <div className="h-10 w-full rounded-lg bg-stone/60" />
              <div className="h-20 w-full rounded-lg bg-stone/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
