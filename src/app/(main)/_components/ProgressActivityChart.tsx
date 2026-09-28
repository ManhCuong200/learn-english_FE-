'use client';

import { useState } from 'react';
import { useProgressActivity } from '../_hooks/useProgressActivity';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, AlertCircle, TrendingUp } from 'lucide-react';

export const ProgressActivityChart = () => {
  const [days, setDays] = useState<number>(7);
  const { data, isLoading, isError } = useProgressActivity(days);

  const daysOptions = [7, 30, 90];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm font-medium text-destructive flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Unable to load activity progress.</span>
      </div>
    );
  }

  const items = data.data || [];
  const maxCount = Math.max(...items.map((i) => i.count), 1);
  const totalCount = items.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-base text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Learning Activity</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total <span className="font-bold text-foreground">{totalCount}</span> activities completed in the last {days} days
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/50">
          {daysOptions.map((opt) => (
            <Button
              key={opt}
              type="button"
              variant={days === opt ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDays(opt)}
              className="h-8 px-3 text-xs font-semibold rounded-lg"
            >
              {opt} Days
            </Button>
          ))}
        </div>
      </div>

      {/* CSS Visual Bar Chart */}
      {items.length > 0 ? (
        <div className="space-y-4 pt-2">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground border-b border-border/40 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-blue-500 inline-block" />
              <span>Vocabulary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-amber-500 inline-block" />
              <span>Flashcard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-violet-500 inline-block" />
              <span>Quiz</span>
            </div>
          </div>

          {/* Bar Chart Grid */}
          <div className="flex items-end gap-1.5 sm:gap-2 h-44 pt-4 overflow-x-auto pb-2 scrollbar-thin">
            {items.map((item) => {
              const heightPercent = Math.round((item.count / maxCount) * 100);
              const dateObj = new Date(item.date);
              const dayLabel = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

              return (
                <div
                  key={item.date}
                  className="flex flex-col items-center flex-1 min-w-[28px] group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 z-10 hidden group-hover:flex flex-col items-center bg-popover text-popover-foreground border border-border rounded-lg px-2.5 py-1 text-[11px] font-semibold shadow-md whitespace-nowrap">
                    <span>{item.date}</span>
                    <span className="text-primary font-bold">{item.count} activities</span>
                  </div>

                  {/* Stacked or Proportional Bar */}
                  <div className="w-full bg-secondary/60 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all group-hover:brightness-110 min-h-[4px]" style={{ height: `${Math.max(heightPercent, 4)}%` }}>
                    {item.count > 0 ? (
                      <div className="w-full flex flex-col h-full">
                        {item.vocabulary > 0 && (
                          <div
                            className="bg-blue-500 w-full"
                            style={{ height: `${(item.vocabulary / item.count) * 100}%` }}
                          />
                        )}
                        {item.flashcard > 0 && (
                          <div
                            className="bg-amber-500 w-full"
                            style={{ height: `${(item.flashcard / item.count) * 100}%` }}
                          />
                        )}
                        {item.quiz > 0 && (
                          <div
                            className="bg-violet-500 w-full"
                            style={{ height: `${(item.quiz / item.count) * 100}%` }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-1 bg-muted rounded-t-sm" />
                    )}
                  </div>

                  {/* Date X-Axis Label */}
                  <span className="text-[10px] font-medium text-muted-foreground mt-2 truncate w-full text-center">
                    {days <= 14 ? dayLabel : dayLabel.slice(0, 5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
          <Calendar className="h-8 w-8 text-muted-foreground/60" />
          <span>No learning activity recorded in the last {days} days.</span>
        </div>
      )}
    </div>
  );
};
