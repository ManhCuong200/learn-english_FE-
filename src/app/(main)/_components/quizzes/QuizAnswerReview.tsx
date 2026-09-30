'use client';

import { QuizResultAnswer } from '@/types/quiz';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuizAnswerReviewProps {
  answers: QuizResultAnswer[];
}

export const QuizAnswerReview = ({ answers }: QuizAnswerReviewProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">
        Answer Review
      </h3>

      <div className="space-y-4">
        {answers.map((ans, idx) => {
          const isCorrect = ans.isCorrect;

          return (
            <div
              key={ans.questionId || idx}
              className={`rounded-2xl border p-5 transition-all ${
                isCorrect
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-destructive/30 bg-destructive/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Question {idx + 1}
                    </span>
                    {ans.question && (
                      <h4 className="font-semibold text-foreground text-base mt-0.5">
                        {ans.question}
                      </h4>
                    )}
                  </div>
                </div>

                <Badge
                  variant={isCorrect ? 'secondary' : 'destructive'}
                  className={
                    isCorrect
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'font-semibold'
                  }
                >
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </Badge>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-background/80 p-3 border border-border/50">
                  <span className="text-xs font-medium text-muted-foreground block mb-1">
                    Your Answer
                  </span>
                  <span
                    className={`font-semibold ${
                      isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                    }`}
                  >
                    {ans.selectedAnswer}
                  </span>
                </div>

                <div className="rounded-xl bg-background/80 p-3 border border-border/50">
                  <span className="text-xs font-medium text-muted-foreground block mb-1">
                    Correct Answer
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {ans.correctAnswer}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
