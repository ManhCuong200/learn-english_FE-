'use client';

import { ReactNode } from 'react';

interface ProgressStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  accentColor?: string;
}

export const ProgressStatCard = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'text-primary bg-primary/10',
}: ProgressStatCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="text-sm font-semibold text-muted-foreground">
          {title}
        </span>
        <div className={`grid size-10 place-items-center rounded-xl font-bold transition-transform group-hover:scale-105 ${accentColor}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="font-display text-3xl font-extrabold text-foreground tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
