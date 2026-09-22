import { Word } from '@/types/word';
import { WordCard } from './WordCard';
import { Skeleton } from '@/components/ui/skeleton';

type WordListProps = {
  words?: Word[];
  isLoading: boolean;
};

export const WordList = ({ words, isLoading }: WordListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h3 className="mt-2 text-sm font-semibold">No vocabulary found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {words.map((word) => (
        <WordCard key={word.id} word={word} />
      ))}
    </div>
  );
};
