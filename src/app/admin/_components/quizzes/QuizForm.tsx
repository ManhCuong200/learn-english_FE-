'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCategories } from '@/app/admin/_hooks/useCategories';
import { useCreateQuiz } from '@/app/admin/_hooks/useCreateQuiz';
import { useUpdateQuiz } from '@/app/admin/_hooks/useUpdateQuiz';
import { useCreateQuizQuestion } from '@/app/admin/_hooks/useCreateQuizQuestion';
import { useUpdateQuizQuestion } from '@/app/admin/_hooks/useUpdateQuizQuestion';
import { useDeleteQuizQuestion } from '@/app/admin/_hooks/useDeleteQuizQuestion';

import { quizInfoSchema, type QuizInfoFormValues } from '@/validations/quiz';
import type { AdminQuiz, AdminQuizQuestion, QuizQuestionType } from '@/types/quiz';
import { QuizQuestionCard, type QuestionDraft } from '@/app/admin/_components/quizzes/QuizQuestionCard';
import { QuizAiGenerator } from '@/app/admin/_components/quiz-ai/QuizAiGenerator';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

type QuizFormProps = {
  initialQuiz?: AdminQuiz;
  mode: 'create' | 'edit';
};

export const QuizForm = ({ initialQuiz, mode }: QuizFormProps) => {
  const router = useRouter();
  const { data: categories = [] } = useCategories();

  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const createQuestionMutation = useCreateQuizQuestion();
  const updateQuestionMutation = useUpdateQuizQuestion();
  const deleteQuestionMutation = useDeleteQuizQuestion();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  // Form for Quiz Information
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<QuizInfoFormValues>({
    resolver: zodResolver(quizInfoSchema),
    defaultValues: {
      title: initialQuiz?.title || '',
      description: initialQuiz?.description || '',
      categoryId: initialQuiz?.categoryId || '',
      level: initialQuiz?.level || '',
    },
  });

  const selectedCategoryId = useWatch({ control, name: 'categoryId' }) || '';
  const selectedLevel = useWatch({ control, name: 'level' }) || '';

  // State for Questions List
  const [questions, setQuestions] = useState<QuestionDraft[]>(() => {
    if (initialQuiz?.questions && initialQuiz.questions.length > 0) {
      return initialQuiz.questions.map((q: AdminQuizQuestion) => ({
        tempId: q.id,
        id: q.id,
        wordId: q.wordId,
        question: q.question,
        type: q.type,
        options: (q.options.length === 4
          ? q.options
          : ['', '', '', '']) as [string, string, string, string],
        correctAnswer: q.correctAnswer,
      }));
    }
    return [
      {
        tempId: 'temp-' + Date.now(),
        wordId: '',
        question: '',
        type: 'MEANING' as QuizQuestionType,
        options: ['', '', '', ''],
        correctAnswer: '',
      },
    ];
  });

  // Track deleted question IDs in edit mode
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        tempId: 'temp-' + Date.now() + '-' + Math.random(),
        wordId: '',
        question: '',
        type: 'MEANING' as QuizQuestionType,
        options: ['', '', '', ''],
        correctAnswer: '',
      },
    ]);
  };

  const handleQuestionChange = (index: number, updated: QuestionDraft) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const qToRemove = questions[index];
    if (qToRemove.id) {
      setDeletedQuestionIds((prev) => [...prev, qToRemove.id!]);
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate Questions list
  const validateQuestions = (): boolean => {
    if (questions.length === 0) {
      toast.error('Quiz must have at least 1 question.');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.wordId) {
        toast.error(`Question ${i + 1}: Please select a vocabulary word.`);
        return false;
      }
      if (!q.question.trim() || q.question.trim().length < 2) {
        toast.error(`Question ${i + 1}: Please enter a valid question text.`);
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

  const onSubmitForm = async (data: QuizInfoFormValues) => {
    if (!validateQuestions()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        // Step 1: Create Quiz
        const newQuiz = await createQuizMutation.mutateAsync({
          title: data.title,
          description: data.description || null,
          categoryId: data.categoryId || null,
          level: data.level || null,
        });

        // Step 2: Create Questions
        for (const q of questions) {
          await createQuestionMutation.mutateAsync({
            quizId: newQuiz.id,
            data: {
              wordId: q.wordId,
              question: q.question,
              type: q.type,
              options: q.options.map((o) => o.trim()),
              correctAnswer: q.correctAnswer.trim(),
            },
          });
        }

        toast.success('Quiz created successfully!');
        router.push('/admin/quizzes');
      } else if (mode === 'edit' && initialQuiz) {
        const quizId = initialQuiz.id;

        // Step 1: Update Quiz Info
        await updateQuizMutation.mutateAsync({
          id: quizId,
          data: {
            title: data.title,
            description: data.description || null,
            categoryId: data.categoryId || null,
            level: data.level || null,
          },
        });

        // Step 2: Delete removed questions
        for (const questionId of deletedQuestionIds) {
          await deleteQuestionMutation.mutateAsync({ questionId, quizId });
        }

        // Step 3: Update existing & create new questions
        for (const q of questions) {
          if (q.id) {
            // Existing Question -> PATCH
            await updateQuestionMutation.mutateAsync({
              questionId: q.id,
              quizId,
              data: {
                wordId: q.wordId,
                question: q.question,
                type: q.type,
                options: q.options.map((o) => o.trim()),
                correctAnswer: q.correctAnswer.trim(),
              },
            });
          } else {
            // New Question -> POST
            await createQuestionMutation.mutateAsync({
              quizId,
              data: {
                wordId: q.wordId,
                question: q.question,
                type: q.type,
                options: q.options.map((o) => o.trim()),
                correctAnswer: q.correctAnswer.trim(),
              },
            });
          }
        }

        toast.success('Quiz updated successfully!');
        router.push('/admin/quizzes');
      }
    } catch {
      // Errors handled in mutations / toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/quizzes')}
            className="mb-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 size-4" /> Back to Quizzes
          </Button>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            {mode === 'create' ? 'Create New Quiz' : `Edit Quiz: ${initialQuiz?.title}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/quizzes')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                {mode === 'create' ? 'Create Quiz' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SECTION 1: QUIZ INFORMATION */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle className="text-lg font-bold">1. Quiz Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Basic Business Vocabulary B1"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a short overview of what this quiz tests..."
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Level */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="font-semibold">
                Category
              </Label>
              <Select
                value={selectedCategoryId || 'NONE'}
                onValueChange={(val) => setValue('categoryId', val === 'NONE' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None / Uncategorized</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label htmlFor="level" className="font-semibold">
                Level
              </Label>
              <Select
                value={selectedLevel || 'NONE'}
                onValueChange={(val) => setValue('level', val === 'NONE' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  {LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: QUESTIONS */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              2. Questions ({questions.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              Add multiple choice questions manually or generate them automatically using AI Gemini.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
              <DialogTrigger render={
                <Button
                  type="button"
                  variant="default"
                  className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md"
                >
                  <Sparkles className="size-4 animate-pulse" /> Generate with AI
                </Button>
              } />
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                    <Sparkles className="size-5 text-primary" /> AI Quiz Question Generator
                  </DialogTitle>
                  <DialogDescription>
                    Automatically generate high quality vocabulary questions using AI. Review and edit choices before importing into your quiz.
                  </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                  <QuizAiGenerator
                    quizId={initialQuiz?.id}
                    onImportToQuizForm={(aiQuestions) => {
                      setQuestions((prev) => [...prev, ...aiQuestions]);
                      setAiDialogOpen(false);
                      toast.success(`Imported ${aiQuestions.length} AI question(s) into quiz!`);
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="gap-2 border-dashed"
            >
              <Plus className="size-4" /> Add Question
            </Button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No questions added yet.</p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddQuestion}
              className="mt-4 gap-2"
            >
              <Plus className="size-4" /> Add First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <QuizQuestionCard
                key={q.tempId || q.id || idx}
                index={idx}
                question={q}
                onChange={(updated) => handleQuestionChange(idx, updated)}
                onDelete={() => handleRemoveQuestion(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/quizzes')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-[160px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 size-5" />
              {mode === 'create' ? 'Create Quiz' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
