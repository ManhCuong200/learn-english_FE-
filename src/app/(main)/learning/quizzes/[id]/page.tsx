'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuiz } from '../../../_hooks/useQuiz';
import { useStartQuiz } from '../../../_hooks/useStartQuiz';
import { QuizSession } from '../../../_components/QuizSession';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  ArrowLeft,
  Play,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const quizId = params.id as string;
  const attemptIdParam = searchParams.get('attemptId');

  const { data: quiz, isLoading, isError, refetch } = useQuiz(quizId);
  const startQuizMutation = useStartQuiz();

  // Active session state if user clicks "Start Quiz"
  const [session, setSession] = useState<{
    attemptId: string;
    questions: QuizQuestionType[];
  } | null>(null);

  const handleStartQuiz = async () => {
    try {
      const res = await startQuizMutation.mutateAsync(quizId);
      setSession({
        attemptId: res.attemptId,
        questions: res.questions,
      });
      toast.success('Quiz started! Good luck!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start quiz.');
    }
  };

  // Loading Quiz Detail
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !quiz) {
    return (
      <div className="min-h-screen bg-background py-12 flex items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-bold text-foreground">Quiz Not Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            The quiz you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => router.push('/learning/quizzes')}
              variant="outline"
              className="rounded-xl"
            >
              Back to Quizzes
            </Button>
            <Button onClick={() => refetch()} className="rounded-xl gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render QuizSession if attempt is active OR attemptId exists in URL
  if (session || attemptIdParam) {
    return (
      <div className="min-h-screen bg-background py-8 md:py-12 px-4 sm:px-6">
        <QuizSession
          quizId={quiz.id}
          quizTitle={quiz.title}
          initialAttemptId={session?.attemptId || attemptIdParam || undefined}
          initialQuestions={session?.questions}
        />
      </div>
    );
  }

  // Initial Quiz Detail Preview Screen
  const categoryName = quiz.category?.name || 'General';
  const levelText = quiz.level || 'All Levels';

  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/learning/quizzes')}
          className="rounded-xl text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Quizzes
        </Button>

        {/* Detail Card */}
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
              <BookOpen className="mr-1.5 h-3.5 w-3.5 text-primary" />
              {categoryName}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-primary/30 text-primary">
              <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
              {levelText}
            </Badge>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              {quiz.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              {quiz.description || 'Test your knowledge with this vocabulary quiz.'}
            </p>
          </div>

          {/* Quiz stats info */}
          <div className="pt-4 border-t border-border/60 flex items-center gap-6 text-sm font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>{quiz.totalQuestions} Questions</span>
            </div>
          </div>

          {/* Start Quiz Action */}
          <div className="pt-4">
            <Button
              onClick={handleStartQuiz}
              disabled={startQuizMutation.isPending}
              size="lg"
              className="w-full sm:w-auto rounded-2xl px-8 py-6 text-base font-bold gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Play className="h-5 w-5 fill-current" />
              {startQuizMutation.isPending ? 'Starting quiz...' : 'Start Quiz'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
