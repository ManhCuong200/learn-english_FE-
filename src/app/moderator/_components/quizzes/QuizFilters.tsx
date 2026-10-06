'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/app/moderator/_hooks/useCategories';

type QuizFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  onReset: () => void;
};

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const QuizFilters = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  level,
  onLevelChange,
  onReset,
}: QuizFiltersProps) => {
  const { data: categories = [] } = useCategories();
  const hasActiveFilters = Boolean(search || categoryId || level);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search quizzes by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-[180px]">
          <Select value={categoryId || 'ALL'} onValueChange={(val) => onCategoryChange(val && val !== 'ALL' ? val : '')}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level Filter */}
        <div className="w-full sm:w-[140px]">
          <Select value={level || 'ALL'} onValueChange={(val) => onLevelChange(val && val !== 'ALL' ? val : '')}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              {LEVELS.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-9 gap-1.5 text-muted-foreground hover:text-foreground">
          <X className="size-4" /> Reset Filters
        </Button>
      )}
    </div>
  );
};
