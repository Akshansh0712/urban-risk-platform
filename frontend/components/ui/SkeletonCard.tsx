export default function SkeletonCard({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`bg-panel border border-border rounded-xl p-5 animate-pulse ${className}`}>
      <div className="h-3.5 bg-border rounded-full w-1/3 mb-5" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-2.5 bg-border rounded-full mb-3 ${i % 2 === 0 ? "w-full" : "w-3/4"}`} />
      ))}
    </div>
  );
}