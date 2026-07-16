export function FlightCardSkeleton() {
  return (
    <div className="glass-panel flex animate-pulse items-center justify-between rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <div className="size-11 rounded-xl bg-navy-700" />
        <div>
          <div className="h-3 w-32 rounded bg-navy-700" />
          <div className="mt-2 h-5 w-48 rounded bg-navy-700" />
          <div className="mt-2 h-3 w-40 rounded bg-navy-700" />
        </div>
      </div>
      <div className="h-8 w-24 rounded bg-navy-700" />
    </div>
  );
}
