'use client';

import { useRouter } from 'next/navigation';
import { QuizResultAnswer } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { QuizAnswerReview } from '@/app/(main)/_components/quizzes/QuizAnswerReview';
import { Award, RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface QuizResultProps {
  quizTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: QuizResultAnswer[];
  onRetry: () => void;
  isRetrying?: boolean;
}

export const QuizResult = ({
  quizTitle,
  score,
  correctAnswers,
  totalQuestions,
  answers,
  onRetry,
  isRetrying = false,
}: QuizResultProps) => {
  const router = useRouter();

  let message = 'Keep practicing!';
  let scoreColorClass = 'text-destructive border-destructive/30 bg-destructive/5';

  if (score >= 80) {
    message = 'Excellent work!';
    scoreColorClass = 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5';
  } else if (score >= 50) {
    message = 'Good job!';
    scoreColorClass = 'text-amber-500 border-amber-500/30 bg-amber-500/5';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Result Card */}
      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
          <Award className="h-8 w-8 text-primary" />
        </div>

        <h2 className="font-display text-3xl font-extrabold text-foreground">
          Quiz Completed!
        </h2>
        <p className="text-muted-foreground mt-1 font-medium text-base">
          {quizTitle}
        </p>

        {/* Score Pill */}
        <div className="my-6 inline-flex flex-col items-center justify-center p-6 rounded-3xl border min-w-[200px]">
          <span className={`font-display text-5xl font-black ${scoreColorClass.split(' ')[0]}`}>
            {score}%
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
            Score
          </span>
        </div>

        {/* Breakdown info */}
        <div className="flex items-center justify-center gap-6 text-sm font-semibold text-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>
              {correctAnswers} of {totalQuestions} Correct
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold text-primary">{message}</p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="rounded-xl gap-2 font-semibold px-6"
          >
            <RotateCcw className="h-4 w-4" />
            {isRetrying ? 'Starting new quiz...' : 'Try Again'}
          </Button>

          <Button
            onClick={() => router.push('/learning/quizzes')}
            variant="outline"
            className="rounded-xl gap-2 font-semibold px-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Button>
        </div>
      </div>

      {/* Detailed Answer Review */}
      {answers && answers.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <QuizAnswerReview answers={answers} />
        </div>
      )}
    </div>
  );
};
