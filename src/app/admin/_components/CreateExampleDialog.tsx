'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ExampleForm } from './ExampleForm';
import { useCreateExample } from '../_hooks/useCreateExample';
import { ExampleFormData } from '@/validations/example';

type CreateExampleDialogProps = {
  wordId: string;
};

export const CreateExampleDialog = ({ wordId }: CreateExampleDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: createExample, isPending } = useCreateExample(wordId);

  const onSubmit = (data: ExampleFormData) => {
    createExample(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Example
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Example</DialogTitle>
        </DialogHeader>
        <ExampleForm onSubmit={onSubmit} isLoading={isPending} submitLabel="Add Example" />
      </DialogContent>
    </Dialog>
  );
};
