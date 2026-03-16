export default function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-panel border border-border rounded-xl p-5 animate-pulse">
      <div className="h-4 bg-border rounded w-1/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-border rounded mb-2 ${i % 2 === 0 ? "w-full" : "w-2/3"}`} />
      ))}
    </div>
  );
}