'use client';

import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  selectedAnswer?: string;
  onSelectAnswer: (option: string) => void;
  disabled?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  MEANING: 'Vocabulary Meaning',
  FILL_BLANK: 'Fill in the Blank',
  TRANSLATION: 'Translation',
};

export const QuizQuestion = ({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}: QuizQuestionProps) => {
  const typeLabel = TYPE_LABELS[question.type] || question.type;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
      {/* Header with Question Number & Type Badge */}
      <div className="flex items-center justify-between gap-4">
        <Badge variant="outline" className="px-3 py-1 font-semibold text-xs border-primary/30 text-primary">
          <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
          {typeLabel}
        </Badge>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Q{questionNumber}
        </span>
      </div>

      {/* Question Text */}
      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground leading-snug">
        {question.question}
      </h2>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3 pt-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelectAnswer(option)}
              className={cn(
                'group relative flex items-center justify-between rounded-xl border p-4 text-left font-medium transition-all duration-200 outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-sm font-semibold'
                  : 'border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent/50',
                disabled && 'cursor-not-allowed opacity-60',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary',
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base">{option}</span>
              </div>

              {isSelected && (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
