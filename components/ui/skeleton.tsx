import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white/10 rounded",
        shimmer && "animate-shimmer bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function NFTCardSkeleton() {
  return (
    <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4 overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-square rounded-lg mb-3" />

      {/* Title skeleton */}
      <Skeleton className="h-5 w-3/4 mb-2" />

      {/* Description skeleton */}
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3 mb-3" />

      {/* Attributes skeleton */}
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
