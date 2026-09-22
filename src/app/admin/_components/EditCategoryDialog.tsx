'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CategoryForm } from './CategoryForm';
import { useUpdateCategory } from '../_hooks/useUpdateCategory';
import { CategoryFormValues } from '@/validations/category';
import { Category } from '@/types/category';
import { ReactNode } from 'react';

type EditCategoryDialogProps = {
  category: Category;
  children: ReactNode; // trigger element
};

export const EditCategoryDialog = ({ category, children }: EditCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const handleSubmit = (data: CategoryFormValues) => {
    updateCategory(
      { id: category.id, data },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <CategoryForm
          defaultValues={{ name: category.name, slug: category.slug }}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
