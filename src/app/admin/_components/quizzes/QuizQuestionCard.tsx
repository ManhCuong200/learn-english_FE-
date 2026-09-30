'use client';

import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useWords } from '@/app/admin/_hooks/useWords';
import type { QuizQuestionType } from '@/types/quiz';
import type { Word } from '@/types/word';

export interface QuestionDraft {
  tempId: string;
  id?: string;
  wordId: string;
  question: string;
  type: QuizQuestionType;
  options: [string, string, string, string];
  correctAnswer: string;
}

type QuizQuestionCardProps = {
  index: number;
  question: QuestionDraft;
  onChange: (updated: QuestionDraft) => void;
  onDelete: () => void;
};

const QUESTION_TYPES: { label: string; value: QuizQuestionType }[] = [
  { label: 'Meaning', value: 'MEANING' },
  { label: 'Fill in the Blank', value: 'FILL_BLANK' },
  { label: 'Translation', value: 'TRANSLATION' },
];

export const QuizQuestionCard = ({
  index,
  question,
  onChange,
  onDelete,
}: QuizQuestionCardProps) => {
  const { data: words = [] } = useWords();

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions: [string, string, string, string] = [...question.options];
    newOptions[optionIndex] = value;

    let newCorrectAnswer = question.correctAnswer;
    if (newCorrectAnswer && !newOptions.includes(newCorrectAnswer)) {
      newCorrectAnswer = newOptions[0] || '';
    }

    onChange({
      ...question,
      options: newOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  return (
    <Card className="relative border-border bg-card shadow-sm transition-all hover:border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-base font-bold text-foreground">
          Question {index + 1}
        </CardTitle>
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
                Are you sure you want to remove Question {index + 1}?
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
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Select Word */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Word <span className="text-destructive">*</span>
          </Label>
          <Select
            value={question.wordId}
            onValueChange={(val) => onChange({ ...question, wordId: val || '' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vocabulary word..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {words.map((w: Word) => (
                <SelectItem key={w.id} value={w.id}>
                  <span className="font-semibold">{w.word}</span>
                  {w.meaning ? ` — ${w.meaning}` : ''}
                  {w.level ? ` (${w.level})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Question Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={question.type}
            onValueChange={(val) =>
              val && onChange({ ...question, type: val as QuizQuestionType })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type..." />
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

        {/* Question Text */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Question Text <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder='e.g., What does "purchase" mean?'
            value={question.question}
            onChange={(e) => onChange({ ...question, question: e.target.value })}
          />
        </div>

        {/* 4 Options */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Options (Exactly 4 choices) <span className="text-destructive">*</span>
          </Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[0, 1, 2, 3].map((optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <Input
                  placeholder={`Option ${optIdx + 1}`}
                  value={question.options[optIdx] || ''}
                  onChange={(e) => handleOptionChange(optIdx, e.target.value)}
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
            onValueChange={(val) => onChange({ ...question, correctAnswer: val || '' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select correct answer from options above..." />
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
};
