'use client';

import { Skeleton } from '@/components/ui/skeleton';

export const ProgressLoading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-9 w-48 rounded-xl" />
        <Skeleton className="h-5 w-80 rounded-lg" />
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Activity Chart Skeleton */}
      <div className="rounded-2xl border border-border p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>

      {/* Breakdowns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};
