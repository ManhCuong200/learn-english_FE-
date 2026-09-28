'use client';

import { useCategories } from '@/app/admin/_hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface QuizFiltersProps {
  selectedCategoryId?: string;
  selectedLevel?: string;
  onCategoryChange: (categoryId?: string) => void;
  onLevelChange: (level?: string) => void;
  onReset: () => void;
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const QuizFilters = ({
  selectedCategoryId,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
  onReset,
}: QuizFiltersProps) => {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const hasActiveFilters = Boolean(selectedCategoryId || selectedLevel);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Filter className="h-4 w-4 text-primary" />
        <span>Filter Quizzes</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category select */}
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          disabled={isLoadingCategories}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Level select */}
        <select
          value={selectedLevel || ''}
          onChange={(e) => onLevelChange(e.target.value || undefined)}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Levels</option>
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              Level {lvl}
            </option>
          ))}
        </select>

        {/* Clear button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground rounded-xl"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
