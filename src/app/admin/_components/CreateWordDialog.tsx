'use client';

import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WordForm } from './WordForm';
import { useCreateWord } from '../_hooks/useCreateWord';
import { WordFormValues } from '@/validations/word';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const CreateWordDialog = () => {
  const [open, setOpen] = useState(false);
  const { mutate: createWord, isPending } = useCreateWord();

  const handleSubmit = (data: WordFormValues) => {
    createWord(data, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Word
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Word</DialogTitle>
          <DialogDescription>
            Add a new word to the vocabulary list.
          </DialogDescription>
        </DialogHeader>
        <WordForm onSubmit={handleSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};
