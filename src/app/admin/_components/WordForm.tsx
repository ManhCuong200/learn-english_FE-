'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wordSchema, WordFormValues } from '@/validations/word';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCategories } from '../_hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Type, BookOpen, Volume2, Layers, Target, Save } from 'lucide-react';

type WordFormProps = {
  defaultValues?: Partial<WordFormValues>;
  onSubmit: (data: WordFormValues) => void;
  isPending: boolean;
};

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const WordForm = ({ defaultValues, onSubmit, isPending }: WordFormProps) => {
  const { data: categories = [] } = useCategories();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WordFormValues>({
    resolver: zodResolver(wordSchema),
    defaultValues: {
      word: defaultValues?.word || '',
      meaning: defaultValues?.meaning || '',
      pronunciation: defaultValues?.pronunciation || '',
      level: defaultValues?.level || '',
      categoryId: defaultValues?.categoryId || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="word" className="flex items-center gap-2 text-foreground/80">
          <Type className="h-4 w-4 text-primary" />
          Word <span className="text-destructive">*</span>
        </Label>
        <Input 
          id="word" 
          placeholder="e.g. abandon" 
          className="h-11 rounded-xl bg-background/50 focus-visible:ring-primary/30"
          {...register('word')} 
        />
        {errors.word && <p className="text-sm font-medium text-destructive">{errors.word.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="meaning" className="flex items-center gap-2 text-foreground/80">
          <BookOpen className="h-4 w-4 text-blue-500" />
          Meaning <span className="text-destructive">*</span>
        </Label>
        <Input 
          id="meaning" 
          placeholder="e.g. từ bỏ" 
          className="h-11 rounded-xl bg-background/50 focus-visible:ring-primary/30"
          {...register('meaning')} 
        />
        {errors.meaning && <p className="text-sm font-medium text-destructive">{errors.meaning.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pronunciation" className="flex items-center gap-2 text-foreground/80">
          <Volume2 className="h-4 w-4 text-amber-500" />
          Pronunciation
        </Label>
        <Input 
          id="pronunciation" 
          placeholder="e.g. /əˈbæn.dən/" 
          className="h-11 rounded-xl bg-background/50 font-mono text-sm focus-visible:ring-primary/30"
          {...register('pronunciation')} 
        />
        {errors.pronunciation && <p className="text-sm font-medium text-destructive">{errors.pronunciation.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="categoryId" className="flex items-center gap-2 text-foreground/80">
            <Layers className="h-4 w-4 text-emerald-500" />
            Category <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="categoryId" className="h-11 rounded-xl bg-background/50 focus:ring-primary/30">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && <p className="text-sm font-medium text-destructive">{errors.categoryId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className="flex items-center gap-2 text-foreground/80">
            <Target className="h-4 w-4 text-purple-500" />
            Level
          </Label>
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="level" className="h-11 rounded-xl bg-background/50 focus:ring-primary/30">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.level && <p className="text-sm font-medium text-destructive">{errors.level.message}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t mt-6">
        <Button type="submit" disabled={isPending} className="rounded-xl px-8 shadow-md hover:shadow-lg transition-all h-11">
          {isPending ? (
            'Saving...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Word
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
