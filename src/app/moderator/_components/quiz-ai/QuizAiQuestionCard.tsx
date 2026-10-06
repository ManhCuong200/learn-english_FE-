'use client';

import React, { memo, useCallback, useMemo } from 'react';
import {
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  PenLine,
} from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useWords } from '@/app/moderator/_hooks/useWords';
import { useRegenerateQuizQuestion } from '@/app/moderator/_hooks/useRegenerateQuizQuestion';
import type { QuizQuestionType } from '@/types/quiz';
import type { DraftAiQuestion } from '@/types/quiz-ai';
import type { Word } from '@/types/word';

interface QuizAiQuestionCardProps {
  index: number;
  question: DraftAiQuestion;
  onChange: (updated: DraftAiQuestion) => void;
  onDelete: () => void;
}

const QUESTION_TYPES: { label: string; value: QuizQuestionType }[] = [
  { label: 'Meaning', value: 'MEANING' },
  { label: 'Fill in the Blank', value: 'FILL_BLANK' },
  { label: 'Translation', value: 'TRANSLATION' },
];

export const QuizAiQuestionCard = memo(
  ({ index, question, onChange, onDelete }: QuizAiQuestionCardProps) => {
    const { data: words = [] } = useWords();
    const regenerateMutation = useRegenerateQuizQuestion();

    // Memoize target word search
    const targetWord = useMemo(
      () => words.find((w: Word) => w.id === question.wordId),
      [words, question.wordId],
    );

    const handleRegenerate = useCallback(async () => {
      if (!question.wordId) return;
      try {
        const res = await regenerateMutation.mutateAsync({
          wordId: question.wordId,
          type: question.type,
          previousQuestion: question.question,
        });
        if (res?.question) {
          onChange({
            ...question,
            question: res.question.question,
            type: res.question.type,
            options: res.question.options,
            correctAnswer: res.question.correctAnswer,
            source: 'ai',
          });
        }
      } catch {
        // Handled by mutation toast
      }
    }, [question, regenerateMutation, onChange]);

    const handleOptionChange = useCallback(
      (optIdx: number, val: string) => {
        const newOptions = [...question.options];
        newOptions[optIdx] = val;

        let newCorrect = question.correctAnswer;
        const trimmedNewOptions = newOptions.map((o) => o.trim());

        if (newCorrect && !trimmedNewOptions.includes(newCorrect.trim())) {
          newCorrect = trimmedNewOptions[0] || '';
        }

        onChange({
          ...question,
          options: newOptions,
          correctAnswer: newCorrect,
        });
      },
      [onChange, question],
    );

    // Validation checks for Card border & badge status
    const { isUnique, isValid } = useMemo(() => {
      const trimmed = question.options.map((o) => o.trim());
      const empty = trimmed.some((o) => !o);
      const unique = new Set(trimmed.map((o) => o.toLowerCase())).size === 4;
      const validCorrect =
        Boolean(question.correctAnswer.trim()) &&
        trimmed.some(
          (o) =>
            o.toLowerCase() === question.correctAnswer.trim().toLowerCase(),
        );
      const valid =
        Boolean(question.question.trim()) &&
        Boolean(question.wordId) &&
        !empty &&
        unique &&
        validCorrect;

      return { isUnique: unique, isValid: valid };
    }, [question.options, question.question, question.correctAnswer, question.wordId]);

    return (
      <Card
        className={`relative transition-all shadow-sm border ${
          !isValid
            ? 'border-destructive/40 bg-destructive/5'
            : question.selected
            ? 'border-primary/50 bg-card shadow-md'
            : 'border-border bg-card'
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 pt-4 px-6 bg-muted/20">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Select Checkbox */}
            <Checkbox
              id={`select-q-${question.id}`}
              checked={question.selected}
              onCheckedChange={(checked) =>
                onChange({ ...question, selected: Boolean(checked) })
              }
            />
            <Label
              htmlFor={`select-q-${question.id}`}
              className="cursor-pointer font-bold text-base text-foreground"
            >
              Question {index + 1}
            </Label>

            {/* Source Badge */}
            {question.source === 'manual' ? (
              <Badge
                variant="outline"
                className="gap-1 text-xs border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5 font-semibold"
              >
                <PenLine className="size-3" /> Manual
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5 font-semibold"
              >
                <Sparkles className="size-3" /> AI
              </Badge>
            )}

            {/* Type Badge */}
            <Badge variant="secondary" className="font-semibold text-xs">
              {question.type}
            </Badge>

            {/* Validation Status Badge */}
            {!isValid ? (
              <Badge variant="destructive" className="gap-1 text-xs">
                <AlertCircle className="size-3" /> Needs Review
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1 text-xs border-green-500/40 text-green-600 dark:text-green-400"
              >
                <CheckCircle2 className="size-3" /> Valid
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Regenerate with AI Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 transition-colors"
              disabled={regenerateMutation.isPending || !question.wordId}
              onClick={handleRegenerate}
              title={
                question.wordId
                  ? 'Regenerate this question with AI'
                  : 'Select a word first to regenerate with AI'
              }
            >
              {regenerateMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 text-primary" />
              )}
              <span>Regenerate</span>
            </Button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                }
              />
              <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Question?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove Question {index + 1} from
                  your draft list?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

        <CardContent className="space-y-4 pt-5 px-6">
          {/* Vocabulary Info */}
          <div className="rounded-lg bg-muted/40 p-3 text-sm flex items-center justify-between border border-border/60">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Target Vocabulary
              </span>
              {targetWord ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-foreground text-base">
                    {targetWord.word}
                  </span>
                  {targetWord.meaning && (
                    <span className="text-muted-foreground text-xs">
                      — {targetWord.meaning}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-medium text-xs mt-0.5 flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 inline shrink-0" />
                  Chưa chọn từ vựng mục tiêu (Vui lòng chọn ở mục bên dưới)
                </span>
              )}
            </div>
            {targetWord?.level && (
              <Badge variant="outline">{targetWord.level}</Badge>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Question Type Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Question Type
              </Label>
              <Select
                value={question.type}
                onValueChange={(val: string | null) =>
                  val && onChange({ ...question, type: val as QuizQuestionType })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Word ID Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vocabulary Word Reference <span className="text-destructive">*</span>
              </Label>
              <Select
                value={question.wordId}
                onValueChange={(val: string | null) => {
                  const chosenWord = words.find((w: Word) => w.id === val);
                  const isQuestionEmpty = !question.question.trim();
                  const areOptionsEmpty = question.options.every((o) => !o.trim());

                  onChange({
                    ...question,
                    wordId: val ?? '',
                    question:
                      isQuestionEmpty && chosenWord
                        ? `What is the definition of "${chosenWord.word}"?`
                        : question.question,
                    options:
                      areOptionsEmpty && chosenWord?.meaning
                        ? [chosenWord.meaning, '', '', '']
                        : question.options,
                    correctAnswer:
                      !question.correctAnswer && chosenWord?.meaning
                        ? chosenWord.meaning
                        : question.correctAnswer,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  {targetWord ? (
                    <span className="truncate flex items-center gap-1.5 text-left">
                      <span className="font-semibold text-foreground">{targetWord.word}</span>
                      {targetWord.meaning && (
                        <span className="text-muted-foreground text-xs">— {targetWord.meaning}</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">Chọn từ vựng mục tiêu...</span>
                  )}
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {[...words]
                    .sort((a, b) => a.word.localeCompare(b.word))
                    .map((w: Word) => (
                      <SelectItem key={w.id} value={w.id}>
                        <span className="font-semibold">{w.word}</span>
                        {w.meaning ? ` — ${w.meaning}` : ''}
                        {w.level ? ` (${w.level})` : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Question Text <span className="text-destructive">*</span>
            </Label>
            <Input
              value={question.question}
              onChange={(e) =>
                onChange({ ...question, question: e.target.value })
              }
              placeholder="Question text..."
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Options (Exactly 4 choices){' '}
                <span className="text-destructive">*</span>
              </Label>
              {!isUnique && (
                <span className="text-xs text-destructive font-medium">
                  Duplicate options detected
                </span>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[0, 1, 2, 3].map((optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <Input
                    value={question.options[optIdx] || ''}
                    onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                    placeholder={`Option ${optIdx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Correct Answer <span className="text-destructive">*</span>
            </Label>
            <Select
              value={question.correctAnswer}
              onValueChange={(val: string | null) =>
                onChange({ ...question, correctAnswer: val ?? '' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer..." />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((opt, i) =>
                  opt.trim() ? (
                    <SelectItem key={i} value={opt}>
                      Option {String.fromCharCode(65 + i)}: {opt}
                    </SelectItem>
                  ) : null,
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  },
);

QuizAiQuestionCard.displayName = 'QuizAiQuestionCard';
