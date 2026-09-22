import { Word } from '@/types/word';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronRight, Layers, Target } from 'lucide-react';

type WordCardProps = {
  word: Word;
};

export const WordCard = ({ word }: WordCardProps) => {
  return (
    <Link 
      href={`/learning/vocabulary/${word.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-blue-600">
            {word.word}
          </h3>
          {word.pronunciation && (
            <p className="mt-1.5 text-sm font-medium text-muted-foreground/80 font-mono tracking-wide">
              {word.pronunciation}
            </p>
          )}
        </div>
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
          <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </div>
      
      <div className="relative z-10 mt-5 line-clamp-2 text-base text-foreground/70 leading-relaxed">
        {word.meaning}
      </div>
      
      <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
        {word.level && (
          <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-secondary/50 hover:bg-secondary border-transparent">
            <Target className="mr-1.5 h-3 w-3 opacity-70" />
            {word.level}
          </Badge>
        )}
        {word.category?.name && (
          <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-semibold border-border/50 text-muted-foreground bg-background/50">
            <Layers className="mr-1.5 h-3 w-3 opacity-70" />
            {word.category.name}
          </Badge>
        )}
      </div>
    </Link>
  );
};
