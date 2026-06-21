import { cn } from "@/lib/utils";

export default function HomeSectionSkeleton({ className, minHeight = "320px" }) {
  return (
    <div
      className={cn("section-pad bg-background", className)}
      style={{ minHeight }}
      aria-hidden
    >
      <div className="site-container space-y-4">
        <div className="h-4 w-28 shimmer rounded-full" />
        <div className="h-10 w-2/3 max-w-md shimmer rounded-2xl" />
        <div className="h-4 w-full max-w-lg shimmer rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-border/40">
                <div className="aspect-[4/3] shimmer" />
                <div className="p-5 space-y-2">
                  <div className="h-5 shimmer rounded w-2/3" />
                  <div className="h-4 shimmer rounded w-full" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
