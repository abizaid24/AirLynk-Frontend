export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-0" aria-busy="true" aria-label="Loading flights">
      <div className="h-4 w-32 animate-pulse rounded-full bg-navy-700" />
      <div className="mt-3 h-9 w-72 animate-pulse rounded-xl bg-navy-700" />
      <div className="mt-8 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-panel h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
