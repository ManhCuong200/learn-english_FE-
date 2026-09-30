'use client';

import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
} from '@/components/ui/alert-dialog';

import { useCategories } from '@/app/admin/_hooks/useCategories';
import { useWords } from '@/app/admin/_hooks/useWords';
import { useGenerateQuizQuestions } from '@/app/admin/_hooks/useGenerateQuizQuestions';
import {
  generateQuizQuestionsSchema,
  type GenerateQuizQuestionsFormValues,
} from '@/validations/quiz-ai';
import type { QuizQuestionType } from '@/types/quiz';
import type {
  AiGeneratedQuestion,
  GenerateQuizQuestionsRequest,
} from '@/types/quiz-ai';
import type { Word } from '@/types/word';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const QUESTION_TYPES: { label: string; value: QuizQuestionType }[] = [
  { label: 'Meaning (Định nghĩa)', value: 'MEANING' },
  { label: 'Fill in the Blank (Điền chỗ trống)', value: 'FILL_BLANK' },
  { label: 'Translation (Dịch câu)', value: 'TRANSLATION' },
];

interface QuizAiConfigFormProps {
  hasExistingDrafts: boolean;
  onQuestionsGenerated: (questions: AiGeneratedQuestion[]) => void;
}

export const QuizAiConfigForm = ({
  hasExistingDrafts,
  onQuestionsGenerated,
}: QuizAiConfigFormProps) => {
  const { data: categories = [] } = useCategories();
  const { data: words = [] } = useWords();
  const generateMutation = useGenerateQuizQuestions();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<GenerateQuizQuestionsFormValues | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<GenerateQuizQuestionsFormValues>({
    resolver: zodResolver(generateQuizQuestionsSchema),
    defaultValues: {
      categoryId: undefined,
      level: undefined,
      count: 5,
      types: ['MEANING', 'FILL_BLANK'],
    },
  });

  const selectedCategoryId = useWatch({ control, name: 'categoryId' }) || '';
  const selectedLevel = useWatch({ control, name: 'level' }) || '';
  const selectedTypes = useWatch({ control, name: 'types' }) || [];
  const requestedCount = useWatch({ control, name: 'count' }) || 5;

  // Filter words count based on selected category & level
  const filteredWordsCount = words.filter((w: Word) => {
    if (selectedCategoryId && w.categoryId !== selectedCategoryId) {
      return false;
    }
    if (selectedLevel && w.level !== selectedLevel) {
      return false;
    }
    return true;
  }).length;

  const hasInsufficientWords = filteredWordsCount < Number(requestedCount);

  const executeGeneration = async (values: GenerateQuizQuestionsFormValues) => {
    try {
      const countNum = Number(values.count) || 5;
      const payload: GenerateQuizQuestionsRequest = {
        count: countNum,
        types: Array.isArray(values.types) ? values.types : ['MEANING'],
      };

      if (
        values.categoryId &&
        typeof values.categoryId === 'string' &&
        values.categoryId.trim() !== '' &&
        values.categoryId !== 'ALL'
      ) {
        payload.categoryId = values.categoryId.trim();
      }

      if (
        values.level &&
        typeof values.level === 'string' &&
        values.level.trim() !== '' &&
        values.level !== 'ALL'
      ) {
        payload.level = values.level.trim();
      }

      const response = await generateMutation.mutateAsync(payload);
      onQuestionsGenerated(response.questions);
    } catch {
      // Error handled in mutation toast
    }
  };

  const onSubmit = (values: GenerateQuizQuestionsFormValues) => {
    if (hasExistingDrafts) {
      setPendingValues(values);
      setConfirmOpen(true);
    } else {
      void executeGeneration(values);
    }
  };

  const handleConfirmRegenerate = () => {
    setConfirmOpen(false);
    if (pendingValues) {
      void executeGeneration(pendingValues);
      setPendingValues(null);
    }
  };

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Sparkles className="size-5 text-primary animate-pulse" />
            1. AI Generator Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="ai-categoryId" className="font-semibold">
                  Category (Optional)
                </Label>
                <Select
                  value={selectedCategoryId || 'ALL'}
                  onValueChange={(val: string | null) =>
                    setValue('categoryId', !val || val === 'ALL' ? undefined : val)
                  }
                >
                  <SelectTrigger id="ai-categoryId">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Filter vocabulary database source by category.
                </p>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="ai-level" className="font-semibold">
                  Level (Optional)
                </Label>
                <Select
                  value={selectedLevel || 'ALL'}
                  onValueChange={(val: string | null) =>
                    setValue('level', !val || val === 'ALL' ? undefined : val)
                  }
                >
                  <SelectTrigger id="ai-level">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Levels</SelectItem>
                    {LEVELS.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Filter vocabulary database source by proficiency level.
                </p>
              </div>
            </div>

            {/* Word Source Status Banner */}
            <div
              className={`rounded-lg border p-3.5 text-xs font-medium transition-colors ${
                hasInsufficientWords
                  ? 'border-destructive/40 bg-destructive/10 text-destructive'
                  : 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  Source Database Words Available:{' '}
                  <strong className="font-bold">{filteredWordsCount} words</strong>{' '}
                  (Requested: <strong className="font-bold">{requestedCount} questions</strong>).
                </span>
              </div>
              {hasInsufficientWords && (
                <p className="mt-1 ml-6 text-destructive/90">
                  ⚠️ Database has only {filteredWordsCount} words matching your selected filter. Please lower requested questions to &le; {filteredWordsCount} or select another Category with more words (e.g. Office & Workplace).
                </p>
              )}
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <Label htmlFor="ai-count" className="font-semibold">
                Number of Questions (1 – 20){' '}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ai-count"
                type="number"
                min={1}
                max={20}
                placeholder="5"
                {...register('count', { valueAsNumber: true })}
              />
              {errors.count && (
                <p className="text-xs text-destructive">
                  {errors.count.message}
                </p>
              )}
            </div>

            {/* Question Types Checkboxes */}
            <div className="space-y-3">
              <Label className="font-semibold">
                Question Types <span className="text-destructive">*</span>
              </Label>
              <div className="grid gap-3 sm:grid-cols-3">
                <Controller
                  control={control}
                  name="types"
                  render={({ field }) => (
                    <>
                      {QUESTION_TYPES.map((typeObj) => {
                        const checked = field.value?.includes(typeObj.value);
                        return (
                          <div
                            key={typeObj.value}
                            className="flex items-center space-x-2 rounded-lg border p-3 shadow-xs hover:bg-accent/50"
                          >
                            <Checkbox
                              id={`type-${typeObj.value}`}
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                if (isChecked) {
                                  field.onChange([...field.value, typeObj.value]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (val) => val !== typeObj.value,
                                    ),
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`type-${typeObj.value}`}
                              className="cursor-pointer text-sm font-medium"
                            >
                              {typeObj.label}
                            </Label>
                          </div>
                        );
                      })}
                    </>
                  )}
                />
              </div>
              {errors.types && (
                <p className="text-xs text-destructive">
                  {errors.types.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={
                  generateMutation.isPending ||
                  selectedTypes.length === 0 ||
                  hasInsufficientWords
                }
                className="gap-2 px-6"
                size="lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Again?</AlertDialogTitle>
            <AlertDialogDescription>
              You currently have generated question drafts. Generating new questions
              will replace your current un-saved drafts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRegenerate}>
              Generate Again & Replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
