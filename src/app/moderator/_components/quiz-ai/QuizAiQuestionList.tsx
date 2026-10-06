'use client';

import { useState } from 'react';
import {
  CheckSquare,
  Square,
  Trash2,
  PlusCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';

import { QuizAiQuestionCard } from '@/app/moderator/_components/quiz-ai/QuizAiQuestionCard';
import { useCreateQuizQuestion } from '@/app/moderator/_hooks/useCreateQuizQuestion';
import { useModeratorQuizzes } from '@/app/moderator/_hooks/useModeratorQuizzes';
import type { DraftAiQuestion } from '@/types/quiz-ai';
import type { QuestionDraft } from '@/app/moderator/_components/quizzes/QuizQuestionCard';

interface QuizAiQuestionListProps {
  questions: DraftAiQuestion[];
  quizId?: string;
  onQuestionsChange: (updated: DraftAiQuestion[]) => void;
  onClearAll: () => void;
  onQuestionsAddedSuccess?: () => void;
  onImportToQuizForm?: (questions: QuestionDraft[]) => void;
}

export const QuizAiQuestionList = ({
  questions,
  quizId: initialQuizId,
  onQuestionsChange,
  onClearAll,
  onQuestionsAddedSuccess,
  onImportToQuizForm,
}: QuizAiQuestionListProps) => {
  const createQuestionMutation = useCreateQuizQuestion();
  const { data: quizzesData } = useModeratorQuizzes({ limit: 100 });
  const quizzes = quizzesData?.data ?? [];

  const [localQuizId, setLocalQuizId] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  const activeQuizId = initialQuizId || localQuizId;

  const selectedQuestions = questions.filter((q) => q.selected);
  const allSelected =
    questions.length > 0 && selectedQuestions.length === questions.length;

  const handleToggleSelectAll = () => {
    const nextState = !allSelected;
    onQuestionsChange(
      questions.map((q) => ({ ...q, selected: nextState })),
    );
  };

  const handleQuestionChange = (index: number, updated: DraftAiQuestion) => {
    const copy = [...questions];
    copy[index] = updated;
    onQuestionsChange(copy);
  };

  const handleRemoveQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
    toast.success(`Question ${index + 1} removed.`);
  };

  // Client-side validation check before saving
  const validateSelectedQuestions = (): boolean => {
    if (selectedQuestions.length === 0) {
      toast.error('No questions selected. Please select at least one question.');
      return false;
    }

    for (let i = 0; i < selectedQuestions.length; i++) {
      const q = selectedQuestions[i];
      if (!q.wordId) {
        toast.error(`Question ${i + 1}: Vocabulary word reference is required.`);
        return false;
      }
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Question text cannot be empty.`);
        return false;
      }
      const trimmedOptions = q.options.map((o) => o.trim());
      if (trimmedOptions.some((o) => !o)) {
        toast.error(`Question ${i + 1}: All 4 options are required.`);
        return false;
      }
      const uniqueOptions = new Set(trimmedOptions.map((o) => o.toLowerCase()));
      if (uniqueOptions.size !== 4) {
        toast.error(`Question ${i + 1}: All 4 options must be unique.`);
        return false;
      }
      if (!q.correctAnswer.trim()) {
        toast.error(`Question ${i + 1}: Please select the correct answer.`);
        return false;
      }
      if (
        !trimmedOptions.some(
          (o) => o.toLowerCase() === q.correctAnswer.trim().toLowerCase(),
        )
      ) {
        toast.error(
          `Question ${i + 1}: Correct answer must exist in the 4 options.`,
        );
        return false;
      }
    }
    return true;
  };

  // Direct Sequential Add to Existing Quiz
  const handleAddSelectedToQuiz = async () => {
    if (!activeQuizId) {
      toast.error('Please select a Target Quiz to add questions to.');
      return;
    }

    if (!validateSelectedQuestions()) return;

    setIsAdding(true);
    let successCount = 0;
    let failCount = 0;
    const remainingDrafts = [...questions];

    for (const q of selectedQuestions) {
      try {
        await createQuestionMutation.mutateAsync({
          quizId: activeQuizId,
          data: {
            wordId: q.wordId,
            question: q.question.trim(),
            type: q.type,
            options: q.options.map((o) => o.trim()),
            correctAnswer: q.correctAnswer.trim(),
          },
        });
        successCount++;
        // Remove successfully added item from remaining drafts
        const idx = remainingDrafts.findIndex((item) => item.id === q.id);
        if (idx !== -1) {
          remainingDrafts.splice(idx, 1);
        }
      } catch {
        failCount++;
      }
    }

    setIsAdding(false);
    onQuestionsChange(remainingDrafts);

    if (failCount === 0) {
      toast.success(
        `Successfully approved & added ${successCount} question(s) to quiz!`,
      );
      if (onQuestionsAddedSuccess) onQuestionsAddedSuccess();
    } else {
      toast.warning(
        `Added ${successCount} question(s). ${failCount} question(s) failed. Remaining failed questions stay in draft preview for retry.`,
      );
    }
  };

  // Import into Form State (For Quiz Creation / Edit Form)
  const handleImportToQuizForm = () => {
    if (!validateSelectedQuestions()) return;

    if (onImportToQuizForm) {
      const formatted: QuestionDraft[] = selectedQuestions.map((q) => ({
        tempId: 'temp-ai-' + Date.now() + '-' + Math.random(),
        wordId: q.wordId,
        question: q.question.trim(),
        type: q.type,
        options: (q.options.map((o) => o.trim()).length === 4
          ? q.options.map((o) => o.trim())
          : ['', '', '', '']) as [string, string, string, string],
        correctAnswer: q.correctAnswer.trim(),
      }));

      onImportToQuizForm(formatted);

      // Remove imported questions from drafts list
      const remaining = questions.filter((q) => !q.selected);
      onQuestionsChange(remaining);
      toast.success(
        `Imported ${selectedQuestions.length} AI question(s) into Quiz Form!`,
      );
    }
  };

  if (questions.length === 0) {
    return (
      <Card className="border-dashed border-border bg-card/50 p-12 text-center">
        <p className="text-muted-foreground">
          No AI-generated questions to preview yet. Configure parameters above and
          click &quot;Generate Questions&quot;.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b bg-muted/30 pb-4">
        <div>
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            2. Review & Approve AI Questions ({questions.length})
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Review, edit choices, select valid questions, and click approve to save to quiz.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Summary Badge */}
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {questions.length} generated • {selectedQuestions.length} selected
          </span>

          {/* Select All */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleSelectAll}
            className="gap-1.5"
          >
            {allSelected ? (
              <>
                <CheckSquare className="size-4 text-primary" /> Unselect All
              </>
            ) : (
              <>
                <Square className="size-4" /> Select All
              </>
            )}
          </Button>

          {/* Clear All Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" /> Clear All
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All AI Drafts?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all current AI-generated draft questions.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Question Cards List */}
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <QuizAiQuestionCard
              key={q.id}
              index={idx}
              question={q}
              onChange={(updated) => handleQuestionChange(idx, updated)}
              onDelete={() => handleRemoveQuestion(idx)}
            />
          ))}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col gap-4 border-t pt-6">
          {!initialQuizId && !onImportToQuizForm && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/40 p-4 rounded-xl border border-border">
              <Label htmlFor="bottom-target-quiz" className="font-bold text-sm shrink-0">
                Select Target Quiz:
              </Label>
              <Select
                value={localQuizId || 'NONE'}
                onValueChange={(val: string | null) =>
                  setLocalQuizId(!val || val === 'NONE' ? '' : val)
                }
              >
                <SelectTrigger id="bottom-target-quiz" className="w-full sm:w-[360px]">
                  <SelectValue placeholder="Choose a quiz to add questions..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="NONE">-- Choose Target Quiz --</SelectItem>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      <span className="font-bold">{quiz.title}</span> ({quiz.totalQuestions} questions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {selectedQuestions.length > 0
                ? `Ready to approve ${selectedQuestions.length} selected question(s).`
                : 'Select at least 1 question to approve and add.'}
            </p>

            <div className="flex items-center gap-3">
              {onImportToQuizForm && (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled={selectedQuestions.length === 0}
                  onClick={handleImportToQuizForm}
                  className="gap-2"
                >
                  <PlusCircle className="size-5" /> Import Selected to Form ({selectedQuestions.length})
                </Button>
              )}

              {(!onImportToQuizForm || initialQuizId) && (
                <Button
                  type="button"
                  size="lg"
                  disabled={isAdding || selectedQuestions.length === 0 || (!activeQuizId && !onImportToQuizForm)}
                  onClick={handleAddSelectedToQuiz}
                  className="gap-2 min-w-[220px] bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Adding Questions...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-5" />
                      Approve & Add to Quiz ({selectedQuestions.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
