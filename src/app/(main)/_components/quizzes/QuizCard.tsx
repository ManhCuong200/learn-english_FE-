'use client';

import { useRouter } from 'next/navigation';
import { QuizSummary } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, HelpCircle, ArrowRight, GraduationCap } from 'lucide-react';

interface QuizCardProps {
  quiz: QuizSummary;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
  const router = useRouter();

  const categoryName = quiz.category?.name || 'General';
  const levelText = quiz.level || 'All Levels';

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <div>
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
            <BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary" />
            {categoryName}
          </Badge>
          <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-medium border-primary/30 text-primary">
            <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
            {levelText}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {quiz.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {quiz.description || 'Practice your vocabulary with this interactive quiz.'}
        </p>
      </div>

      {/* Footer info & action */}
      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center text-xs font-medium text-muted-foreground">
          <HelpCircle className="mr-1.5 h-4 w-4 text-primary/70" />
          <span>{quiz.totalQuestions} questions</span>
        </div>

        <Button
          onClick={() => router.push(`/learning/quizzes/${quiz.id}`)}
          size="sm"
          className="rounded-xl gap-1.5 font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all"
        >
          <span>Start Quiz</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
