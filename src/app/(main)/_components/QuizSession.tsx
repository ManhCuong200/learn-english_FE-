'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuizQuestion as QuizQuestionType, QuizSubmitResponse } from '@/types/quiz';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { useSubmitQuiz } from '../_hooks/useSubmitQuiz';
import { useStartQuiz } from '../_hooks/useStartQuiz';
import { useQuizAttempt } from '../_hooks/useQuizAttempt';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Send, ArrowLeft } from 'lucide-react';

interface QuizSessionProps {
  quizId: string;
  quizTitle: string;
  initialAttemptId?: string;
  initialQuestions?: QuizQuestionType[];
}

export const QuizSession = ({
  quizId,
  quizTitle,
  initialAttemptId,
  initialQuestions,
}: QuizSessionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryAttemptId = searchParams.get('attemptId') || initialAttemptId;

  // Active quiz state
  const [attemptId, setAttemptId] = useState<string | undefined>(queryAttemptId);
  const [questions, setQuestions] = useState<QuizQuestionType[]>(initialQuestions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<QuizSubmitResponse | null>(null);

  // TanStack Query Hooks
  const submitQuizMutation = useSubmitQuiz();
  const startQuizMutation = useStartQuiz();
  const { data: restoredAttempt, isLoading: isLoadingAttempt } = useQuizAttempt(
    queryAttemptId && !quizResult ? queryAttemptId : undefined,
  );

  // If restoring an existing attempt from attemptId query param
  useEffect(() => {
    if (restoredAttempt && restoredAttempt.completedAt) {
      setQuizResult({
        attemptId: restoredAttempt.attemptId,
        quiz: restoredAttempt.quiz,
        result: {
          score: restoredAttempt.score,
          correctAnswers: restoredAttempt.correctAnswers,
          totalQuestions: restoredAttempt.totalQuestions,
        },
        completedAt: restoredAttempt.completedAt,
        answers: restoredAttempt.answers,
      });
    }
  }, [restoredAttempt]);

  // Handle start/restart quiz
  const handleStartQuiz = async () => {
    try {
      const res = await startQuizMutation.mutateAsync(quizId);
      setAttemptId(res.attemptId);
      setQuestions(res.questions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizResult(null);
      // Clean query params
      router.replace(`/learning/quizzes/${quizId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start quiz.');
    }
  };

  // Answer selection callback
  const handleSelectAnswer = (option: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!attemptId) {
      toast.error('Quiz attempt invalid. Please start again.');
      return;
    }

    const allAnswered = questions.every((q) => Boolean(selectedAnswers[q.id]));
    if (!allAnswered) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    const payload = {
      answers: questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[q.id] || '',
      })),
    };

    try {
      const response = await submitQuizMutation.mutateAsync({
        attemptId,
        data: payload,
      });

      setQuizResult(response);
      toast.success('Quiz submitted successfully!');
      // Update URL with attemptId for refresh capability
      router.replace(`/learning/quizzes/${quizId}?attemptId=${response.attemptId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit quiz.');
    }
  };

  // Loading restored attempt
  if (queryAttemptId && isLoadingAttempt && !quizResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 p-6">
        <Skeleton className="h-12 w-3/4 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  // Render Result Screen if completed
  if (quizResult) {
    return (
      <QuizResult
        quizTitle={quizResult.quiz.title || quizTitle}
        score={quizResult.result.score}
        correctAnswers={quizResult.result.correctAnswers}
        totalQuestions={quizResult.result.totalQuestions}
        answers={quizResult.answers}
        onRetry={handleStartQuiz}
        isRetrying={startQuizMutation.isPending}
      />
    );
  }

  // Fallback if session started without questions loaded
  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-4">
        <p className="text-muted-foreground">No questions loaded for this quiz session.</p>
        <Button onClick={handleStartQuiz} disabled={startQuizMutation.isPending} className="rounded-xl">
          {startQuizMutation.isPending ? 'Starting...' : 'Start Quiz'}
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswered = Boolean(selectedAnswers[currentQuestion.id]);
  const allAnswered = questions.every((q) => Boolean(selectedAnswers[q.id]));
  const isSubmitting = submitQuizMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top bar with back button & Quiz Title */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/learning/quizzes')}
          className="rounded-xl text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Exit Quiz
        </Button>

        <h2 className="font-display text-sm font-bold text-foreground truncate max-w-[250px] sm:max-w-md">
          {quizTitle}
        </h2>
      </div>

      {/* Progress Bar */}
      <QuizProgress
        currentIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      {/* Active Question Component */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        selectedAnswer={selectedAnswers[currentQuestion.id]}
        onSelectAnswer={handleSelectAnswer}
        disabled={isSubmitting}
      />

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={isFirstQuestion || isSubmitting}
          className="rounded-xl gap-1.5 px-5 font-semibold"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {!isLastQuestion ? (
          <Button
            type="button"
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={!currentAnswered || isSubmitting}
            className="rounded-xl gap-1.5 px-5 font-semibold"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="rounded-xl gap-2 px-6 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </div>
    </div>
  );
};
