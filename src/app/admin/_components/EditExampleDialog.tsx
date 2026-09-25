'use client';

import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExampleForm } from './ExampleForm';
import { useUpdateExample } from '../_hooks/useUpdateExample';
import { ExampleFormData } from '@/validations/example';
import { Example } from '@/types/example';

type EditExampleDialogProps = {
  example: Example;
  wordId: string;
  children: React.ReactElement;
};

export const EditExampleDialog = ({ example, wordId, children }: EditExampleDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: updateExample, isPending } = useUpdateExample(wordId);

  const onSubmit = (data: ExampleFormData) => {
    updateExample(
      { id: example.id, data },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Example</DialogTitle>
        </DialogHeader>
        <ExampleForm 
          defaultValues={{ content: example.content, meaning: example.meaning || '' }} 
          onSubmit={onSubmit} 
          isLoading={isPending} 
          submitLabel="Save Changes" 
        />
      </DialogContent>
    </Dialog>
  );
};
