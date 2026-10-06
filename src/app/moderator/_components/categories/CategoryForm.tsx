'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, CategoryFormValues } from '@/validations/category';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type CategoryFormProps = {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => void;
  isPending: boolean;
};

export const CategoryForm = ({ defaultValues, onSubmit, isPending }: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name || '',
      slug: defaultValues?.slug || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="e.g. Grammar" {...register('name')} />
        {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" placeholder="e.g. grammar" {...register('slug')} />
        {errors.slug && <p className="text-sm font-medium text-destructive">{errors.slug.message}</p>}
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  );
};
