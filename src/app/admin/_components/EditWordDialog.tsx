'use client';

import { ReactElement, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WordForm } from './WordForm';
import { useUpdateWord } from '../_hooks/useUpdateWord';
import { WordFormValues } from '@/validations/word';
import { Word } from '@/types/word';

type EditWordDialogProps = {
  word: Word;
  children: ReactElement;
};

export const EditWordDialog = ({ word, children }: EditWordDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: updateWord, isPending } = useUpdateWord();

  const handleSubmit = (data: WordFormValues) => {
    updateWord(
      { id: word.id, data },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Word</DialogTitle>
          <DialogDescription>
            Update the vocabulary details.
          </DialogDescription>
        </DialogHeader>
        <WordForm
          defaultValues={{
            word: word.word,
            meaning: word.meaning,
            pronunciation: word.pronunciation || '',
            level: word.level || '',
            categoryId: word.categoryId,
          }}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
