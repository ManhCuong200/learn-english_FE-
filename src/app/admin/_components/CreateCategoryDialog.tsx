'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CategoryForm } from './CategoryForm';
import { useCreateCategory } from '../_hooks/useCreateCategory';
import { CategoryFormValues } from '@/validations/category';
import { Plus } from 'lucide-react';

export const CreateCategoryDialog = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = (data: CategoryFormValues) => {
    createCategory(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />} >
        <Plus className="mr-2 h-4 w-4" /> Create Category
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <CategoryForm onSubmit={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};
