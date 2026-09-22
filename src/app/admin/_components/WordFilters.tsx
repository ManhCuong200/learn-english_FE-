'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '../_hooks/useCategories';
import { Search, Filter, Layers } from 'lucide-react';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const WordFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: categories = [] } = useCategories();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get('search') || '')) {
        router.push(`${pathname}?${createQueryString('search', searchTerm)}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, createQueryString, searchParams]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="relative w-full sm:max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          placeholder="Search vocabulary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30 transition-all rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2 hidden lg:flex">
          <Filter className="h-4 w-4" />
          Filters
        </div>

        <Select
          value={searchParams.get('categoryId') || 'all'}
          onValueChange={(val: string | null) => {
            if (val === null) return;
            router.push(
              `${pathname || ''}?${createQueryString('categoryId', val === 'all' ? '' : val)}`
            );
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl bg-background/50 border-muted-foreground/20">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 opacity-50" />
              <SelectValue placeholder="All Categories" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('level') || 'all'}
          onValueChange={(val: string | null) => {
            if (val === null) return;
            router.push(
              `${pathname || ''}?${createQueryString('level', val === 'all' ? '' : val)}`
            );
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl bg-background/50 border-muted-foreground/20">
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary opacity-70">L</span>
              <SelectValue placeholder="All Levels" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
