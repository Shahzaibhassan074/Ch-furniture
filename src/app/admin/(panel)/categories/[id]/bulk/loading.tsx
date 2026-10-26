export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-40 rounded-md bg-stone" />
      <div className="mt-4">
        <div className="h-10 w-36 rounded-lg bg-stone" />
        <div className="mt-1 h-4 w-64 rounded-md bg-stone/70" />
      </div>
      <div className="mt-8 rounded-xl border border-inkBorder bg-white p-6 shadow-sm">
        <div className="h-4 w-48 rounded-md bg-stone/70" />
        <div className="mt-4 h-32 w-full rounded-lg bg-stone/50" />
      </div>
    </div>
  );
}
