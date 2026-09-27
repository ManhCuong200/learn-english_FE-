'use client';

import { useState } from 'react';
import { useQuizQuestions, useSubmitQuiz } from '../_hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Trophy,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import { QuizAnswerItem, QuizOption } from '@/types/quiz';
import { toast } from 'sonner';

export const QuizSession = () => {
  const { data, isLoading, isError, refetch } = useQuizQuestions(5);
  const submitQuizMutation = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correctCount: number; totalQuestions: number } | null>(null);

  const questions = data?.data || [];
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: QuizOption) => {
    if (selectedOptionId !== null) return; // Prevent changing after select

    setSelectedOptionId(option.id);
    const newAnswer: QuizAnswerItem = {
      wordId: currentQuestion.id,
      isCorrect: option.isCorrect,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      // Finish quiz & submit
      submitQuizMutation.mutate(answers, {
        onSuccess: (res) => {
          setResult(res);
          setIsSubmitted(true);
        },
        onError: () => {
          toast.error('Failed to submit quiz results. Your progress may not be saved.');
          setIsSubmitted(true);
        },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswers([]);
    setIsSubmitted(false);
    setResult(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center animate-pulse">
        <Skeleton className="h-10 w-48 mb-6 rounded-full" />
        <Skeleton className="h-[380px] w-full rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-12 rounded-3xl border border-destructive/20 bg-destructive/5">
        <HelpCircle className="size-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-destructive mb-2">Failed to load Quiz questions</h2>
        <p className="text-muted-foreground mb-6">Make sure you have vocabulary in the system to generate a quiz.</p>
        <Button onClick={() => refetch()} variant="outline" className="rounded-full">Try again</Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-16 rounded-3xl border border-dashed bg-card/50 shadow-sm">
        <Brain className="size-16 text-primary mx-auto mb-6" />
        <h2 className="text-2xl font-extrabold mb-3">No Quiz Questions Available</h2>
        <p className="text-muted-foreground mb-8">You need to add some vocabulary words before taking a quiz.</p>
        <Button onClick={() => window.location.href = '/learning/vocabulary'} size="lg" className="rounded-full px-8">
          Explore Vocabulary <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    );
  }

  if (isSubmitted) {
    const score = result?.score ?? Math.round((answers.filter(a => a.isCorrect).length / questions.length) * 100);
    const correctCount = result?.correctCount ?? answers.filter(a => a.isCorrect).length;

    return (
      <div className="w-full max-w-xl mx-auto text-center p-12 sm:p-16 rounded-[2.5rem] border bg-card shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
          <Trophy className="w-12 h-12 text-primary" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-foreground">
          Quiz Completed!
        </h2>
        <p className="text-muted-foreground mb-8 font-medium">
          Your score has been saved to your learning history.
        </p>

        <div className="my-8 flex justify-center items-center gap-6">
          <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 text-center min-w-[140px]">
            <p className="text-3xl font-extrabold text-primary">{score}%</p>
            <p className="text-xs text-muted-foreground font-semibold uppercase mt-1">Accuracy</p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 text-center min-w-[140px]">
            <p className="text-3xl font-extrabold text-foreground">{correctCount} / {questions.length}</p>
            <p className="text-xs text-muted-foreground font-semibold uppercase mt-1">Correct</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button onClick={() => window.location.href = '/learning'} variant="outline" size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 font-bold">
            Back to Overview
          </Button>
          <Button onClick={handleRestart} size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 font-bold shadow-lg shadow-primary/20">
            <RotateCcw className="mr-2 size-5" /> Take Another Quiz
          </Button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-2 px-1 uppercase tracking-wider">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-[2.5rem] border border-border/60 bg-card p-8 sm:p-10 shadow-xl space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-bold rounded-full">
              {currentQuestion.category || 'Vocabulary'}
            </Badge>
            {currentQuestion.level && (
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Level {currentQuestion.level}
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            {currentQuestion.word}
          </h2>

          {currentQuestion.pronunciation && (
            <p className="text-base font-mono text-muted-foreground">
              {currentQuestion.pronunciation}
            </p>
          )}

          <p className="mt-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            What is the correct meaning of this word?
          </p>
        </div>

        {/* Options */}
        <div className="grid gap-3.5">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const hasAnswered = selectedOptionId !== null;

            let buttonStyle = "border-border/60 bg-background hover:bg-muted/50 text-foreground";
            if (hasAnswered) {
              if (option.isCorrect) {
                buttonStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 font-bold dark:text-emerald-400";
              } else if (isSelected && !option.isCorrect) {
                buttonStyle = "border-rose-500 bg-rose-500/10 text-rose-700 font-bold dark:text-rose-400";
              } else {
                buttonStyle = "border-border/30 bg-muted/20 text-muted-foreground opacity-50";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                disabled={hasAnswered}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
              >
                <span className="text-base font-semibold leading-snug">{option.text}</span>
                {hasAnswered && option.isCorrect && (
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 ml-3" />
                )}
                {hasAnswered && isSelected && !option.isCorrect && (
                  <XCircle className="size-5 text-rose-600 shrink-0 ml-3" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {selectedOptionId !== null && (
          <div className="pt-4 flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Button
              onClick={handleNext}
              disabled={submitQuizMutation.isPending}
              size="lg"
              className="rounded-full px-8 h-14 font-bold text-base shadow-lg shadow-primary/20"
            >
              {currentIndex < questions.length - 1 ? (
                <>Next Question <ArrowRight className="ml-2 size-5" /></>
              ) : (
                <>Submit Quiz <Sparkles className="ml-2 size-5" /></>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
