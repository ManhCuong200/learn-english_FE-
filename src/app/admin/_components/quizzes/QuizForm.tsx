'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Sparkles,
  PenLine,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Save,
  Loader2,
  CheckSquare,
  Square,
  AlertCircle,
  ExternalLink,
  Layers,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

import { useCategories } from '@/app/admin/_hooks/useCategories';
import { useWords } from '@/app/admin/_hooks/useWords';
import { useCreateQuiz } from '@/app/admin/_hooks/useCreateQuiz';
import { useUpdateQuiz } from '@/app/admin/_hooks/useUpdateQuiz';
import { useCreateQuizQuestion } from '@/app/admin/_hooks/useCreateQuizQuestion';
import { useUpdateQuizQuestion } from '@/app/admin/_hooks/useUpdateQuizQuestion';
import { useDeleteQuizQuestion } from '@/app/admin/_hooks/useDeleteQuizQuestion';
import { useGenerateQuizQuestions } from '@/app/admin/_hooks/useGenerateQuizQuestions';

import { quizInfoSchema, type QuizInfoFormValues } from '@/validations/quiz';
import type { AdminQuiz, AdminQuizQuestion, QuizQuestionType } from '@/types/quiz';
import type { DraftAiQuestion } from '@/types/quiz-ai';
import type { Word } from '@/types/word';
import { QuizAiQuestionCard } from '@/app/admin/_components/quiz-ai/QuizAiQuestionCard';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const QUESTION_TYPES: { label: string; value: QuizQuestionType }[] = [
  { label: 'Meaning (Định nghĩa)', value: 'MEANING' },
  { label: 'Fill in Blank (Điền từ)', value: 'FILL_BLANK' },
  { label: 'Translation (Dịch nghĩa)', value: 'TRANSLATION' },
];

type QuizFormProps = {
  initialQuiz?: AdminQuiz;
  mode: 'create' | 'edit';
};

export const QuizForm = ({ initialQuiz, mode }: QuizFormProps) => {
  const { data: categories = [] } = useCategories();
  const { data: words = [] } = useWords();

  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const createQuestionMutation = useCreateQuizQuestion();
  const updateQuestionMutation = useUpdateQuizQuestion();
  const deleteQuestionMutation = useDeleteQuizQuestion();
  const generateAiMutation = useGenerateQuizQuestions();

  // Workflow Stages:
  // 'builder' (Quiz Creation: Manual/AI -> Question Drafts)
  // 'review' (Final Review of Selected Drafts)
  // 'published' (Quiz + Questions Saved & Published)
  const [currentStage, setCurrentStage] = useState<'builder' | 'review' | 'published'>('builder');
  const [publishedQuiz, setPublishedQuiz] = useState<{ id: string; title: string; totalQuestions: number } | null>(null);

  // Active channel for adding questions: 'ai' | 'manual'
  const [activeChannel, setActiveChannel] = useState<'ai' | 'manual'>('ai');

  // Form for Quiz Information
  const {
    register,
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
  const quizTitle = useWatch({ control, name: 'title' }) || '';
  const quizDescription = useWatch({ control, name: 'description' }) || '';

  // AI Generator Panel State
  const [aiCount, setAiCount] = useState<number>(5);
  const [aiSelectedTypes, setAiSelectedTypes] = useState<QuizQuestionType[]>([
    'MEANING',
    'FILL_BLANK',
  ]);

  // Manual Question Entry Form State
  const [manualWordId, setManualWordId] = useState<string>('');
  const [manualType, setManualType] = useState<QuizQuestionType>('MEANING');
  const [manualQuestionText, setManualQuestionText] = useState<string>('');
  const [manualOptions, setManualOptions] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [manualCorrectIndex, setManualCorrectIndex] = useState<number>(0);
  const [manualSubTab, setManualSubTab] = useState<'form' | 'batch'>('form');
  const [batchWordIds, setBatchWordIds] = useState<string[]>([]);
  const [batchSearch, setBatchSearch] = useState<string>('');

  const selectedManualWord = useMemo(
    () => words.find((w: Word) => w.id === manualWordId),
    [words, manualWordId],
  );

  // Central Hub: QUESTION DRAFTS State
  const [draftQuestions, setDraftQuestions] = useState<DraftAiQuestion[]>(() => {
    if (initialQuiz?.questions && initialQuiz.questions.length > 0) {
      return initialQuiz.questions.map((q: AdminQuizQuestion) => ({
        id: q.id,
        wordId: q.wordId,
        question: q.question,
        type: q.type,
        options: q.options.length === 4 ? q.options : [q.options[0] || '', '', '', ''],
        correctAnswer: q.correctAnswer,
        selected: true,
        source: 'manual',
      }));
    }
    return [];
  });

  // Track deleted question IDs in edit mode
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected questions count & validation
  const selectedDrafts = useMemo(
    () => draftQuestions.filter((q) => q.selected),
    [draftQuestions],
  );

  const isAllSelected =
    draftQuestions.length > 0 && selectedDrafts.length === draftQuestions.length;

  const validDraftsCount = useMemo(() => {
    return draftQuestions.filter((q) => {
      const trimmed = q.options.map((o) => o.trim());
      const hasWord = Boolean(q.wordId);
      const hasText = Boolean(q.question.trim());
      const has4Unique =
        !trimmed.some((o) => !o) && new Set(trimmed.map((o) => o.toLowerCase())).size === 4;
      const validCorrect =
        Boolean(q.correctAnswer.trim()) &&
        trimmed.some((o) => o.toLowerCase() === q.correctAnswer.trim().toLowerCase());
      return hasWord && hasText && has4Unique && validCorrect;
    }).length;
  }, [draftQuestions]);

  // Handle toggling select all
  const handleToggleSelectAll = () => {
    const nextState = !isAllSelected;
    setDraftQuestions((prev) => prev.map((q) => ({ ...q, selected: nextState })));
  };

  // Handle AI Question Generation
  const handleGenerateAi = async () => {
    if (aiSelectedTypes.length === 0) {
      toast.error('Please select at least one question type for AI generation.');
      return;
    }

    try {
      const response = await generateAiMutation.mutateAsync({
        categoryId: selectedCategoryId || undefined,
        level: selectedLevel || undefined,
        count: aiCount,
        types: aiSelectedTypes,
      });

      if (response?.questions && response.questions.length > 0) {
        const formattedNewDrafts: DraftAiQuestion[] = response.questions.map((q, idx) => ({
          ...q,
          id: `ai-draft-${Date.now()}-${idx}-${Math.random()}`,
          selected: true,
          source: 'ai',
        }));

        setDraftQuestions((prev) => [...prev, ...formattedNewDrafts]);
        toast.success(`Added ${formattedNewDrafts.length} AI generated questions to drafts!`);
      }
    } catch {
      // Handled in mutation hook toast
    }
  };

  // Handle Manual Question Add
  const handleAddManualQuestion = () => {
    if (!manualWordId) {
      toast.error('Please select a vocabulary word for the manual question.');
      return;
    }
    if (!manualQuestionText.trim()) {
      toast.error('Please enter the question text.');
      return;
    }
    const trimmedOpts = manualOptions.map((o) => o.trim());
    if (trimmedOpts.some((o) => !o)) {
      toast.error('Please fill in all 4 options.');
      return;
    }
    const uniqueOpts = new Set(trimmedOpts.map((o) => o.toLowerCase()));
    if (uniqueOpts.size !== 4) {
      toast.error('All 4 options must be distinct choices.');
      return;
    }

    const selectedCorrect = trimmedOpts[manualCorrectIndex] || trimmedOpts[0];

    const newManualDraft: DraftAiQuestion = {
      id: `manual-draft-${Date.now()}-${Math.random()}`,
      wordId: manualWordId,
      question: manualQuestionText.trim(),
      type: manualType,
      options: trimmedOpts,
      correctAnswer: selectedCorrect,
      selected: true,
      source: 'manual',
    };

    setDraftQuestions((prev) => [...prev, newManualDraft]);
    // Reset manual form
    setManualQuestionText('');
    setManualOptions(['', '', '', '']);
    setManualCorrectIndex(0);
    toast.success('Manual question added to drafts!');
  };

  // Add blank question drafts for quick editing on cards
  const handleAddBlankQuestions = (count = 1) => {
    const newDrafts: DraftAiQuestion[] = [];
    for (let i = 0; i < count; i++) {
      newDrafts.push({
        id: `manual-draft-${Date.now()}-${i}-${Math.random()}`,
        wordId: '',
        question: '',
        type: 'MEANING',
        options: ['', '', '', ''],
        correctAnswer: '',
        selected: true,
        source: 'manual',
      });
    }
    setDraftQuestions((prev) => [...prev, ...newDrafts]);
    toast.success(`Added ${count} blank question ${count > 1 ? 'drafts' : 'draft'} to list below!`);
  };

  // Batch add questions from selected vocabulary words
  const handleBatchAddFromWords = () => {
    if (batchWordIds.length === 0) {
      toast.error('Please select at least 1 vocabulary word.');
      return;
    }
    const newDrafts: DraftAiQuestion[] = batchWordIds.map((wId, i) => {
      const wObj = words.find((w: Word) => w.id === wId);
      return {
        id: `manual-draft-${Date.now()}-${i}-${Math.random()}`,
        wordId: wId,
        question: wObj ? `What is the definition of "${wObj.word}"?` : '',
        type: 'MEANING' as QuizQuestionType,
        options: wObj?.meaning ? [wObj.meaning, '', '', ''] : ['', '', '', ''],
        correctAnswer: wObj?.meaning || '',
        selected: true,
        source: 'manual',
      };
    });
    setDraftQuestions((prev) => [...prev, ...newDrafts]);
    setBatchWordIds([]);
    toast.success(`Created ${newDrafts.length} question drafts from selected words!`);
  };

  // Handle Draft Question Update
  const handleUpdateDraft = (index: number, updated: DraftAiQuestion) => {
    setDraftQuestions((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  // Handle Draft Question Removal
  const handleRemoveDraft = (index: number) => {
    const qToRemove = draftQuestions[index];
    if (qToRemove && qToRemove.id && !qToRemove.id.startsWith('ai-draft-') && !qToRemove.id.startsWith('manual-draft-')) {
      setDeletedQuestionIds((prev) => [...prev, qToRemove.id]);
    }
    setDraftQuestions((prev) => prev.filter((_, i) => i !== index));
    toast.info(`Question ${index + 1} removed from drafts.`);
  };

  // Handle Remove Selected Drafts
  const handleRemoveSelectedDrafts = () => {
    const remaining: DraftAiQuestion[] = [];
    for (const q of draftQuestions) {
      if (q.selected) {
        if (q.id && !q.id.startsWith('ai-draft-') && !q.id.startsWith('manual-draft-')) {
          setDeletedQuestionIds((prev) => [...prev, q.id]);
        }
      } else {
        remaining.push(q);
      }
    }
    setDraftQuestions(remaining);
    toast.success(`Removed selected questions from drafts.`);
  };

  // Validate drafts before proceeding to Final Review
  const validateBeforeReview = (): boolean => {
    if (!quizTitle.trim()) {
      toast.error('Please enter a Quiz Title first.');
      return false;
    }

    if (selectedDrafts.length === 0) {
      toast.error('Please select at least 1 question draft to include in the quiz.');
      return false;
    }

    for (let i = 0; i < selectedDrafts.length; i++) {
      const q = selectedDrafts[i];
      if (!q.wordId) {
        toast.error(`Question ${i + 1}: Vocabulary word reference is required.`);
        return false;
      }
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Question text cannot be empty.`);
        return false;
      }
      const trimmed = q.options.map((o) => o.trim());
      if (trimmed.some((o) => !o)) {
        toast.error(`Question ${i + 1}: All 4 options are required.`);
        return false;
      }
      if (new Set(trimmed.map((o) => o.toLowerCase())).size !== 4) {
        toast.error(`Question ${i + 1}: All 4 options must be unique.`);
        return false;
      }
      if (!q.correctAnswer.trim() || !trimmed.some((o) => o.toLowerCase() === q.correctAnswer.trim().toLowerCase())) {
        toast.error(`Question ${i + 1}: Correct answer must match one of the options.`);
        return false;
      }
    }

    return true;
  };

  // Proceed to Final Review
  const handleProceedToReview = () => {
    if (validateBeforeReview()) {
      setCurrentStage('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit and Save Quiz Atomically
  const handleSaveAndPublishQuiz = async () => {
    if (!validateBeforeReview()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        // Atomic Create Quiz + Questions
        const questionsPayload = selectedDrafts.map((q) => ({
          wordId: q.wordId,
          question: q.question.trim(),
          type: q.type,
          options: q.options.map((o) => o.trim()),
          correctAnswer: q.correctAnswer.trim(),
        }));

        const created = await createQuizMutation.mutateAsync({
          title: quizTitle.trim(),
          description: quizDescription.trim() || null,
          categoryId: selectedCategoryId || null,
          level: selectedLevel || null,
          questions: questionsPayload,
        });

        setPublishedQuiz({
          id: created.id,
          title: created.title,
          totalQuestions: created.totalQuestions || questionsPayload.length,
        });
        setCurrentStage('published');
        toast.success('Quiz and all questions published successfully!');
      } else if (mode === 'edit' && initialQuiz) {
        const quizId = initialQuiz.id;

        // Step 1: Update Quiz metadata
        await updateQuizMutation.mutateAsync({
          id: quizId,
          data: {
            title: quizTitle.trim(),
            description: quizDescription.trim() || null,
            categoryId: selectedCategoryId || null,
            level: selectedLevel || null,
          },
        });

        // Step 2: Delete removed questions
        for (const questionId of deletedQuestionIds) {
          await deleteQuestionMutation.mutateAsync({ questionId, quizId });
        }

        // Step 3: Upsert selected questions
        for (const q of selectedDrafts) {
          const isExisting = q.id && !q.id.startsWith('ai-draft-') && !q.id.startsWith('manual-draft-');
          if (isExisting) {
            await updateQuestionMutation.mutateAsync({
              questionId: q.id,
              quizId,
              data: {
                wordId: q.wordId,
                question: q.question.trim(),
                type: q.type,
                options: q.options.map((o) => o.trim()),
                correctAnswer: q.correctAnswer.trim(),
              },
            });
          } else {
            await createQuestionMutation.mutateAsync({
              quizId,
              data: {
                wordId: q.wordId,
                question: q.question.trim(),
                type: q.type,
                options: q.options.map((o) => o.trim()),
                correctAnswer: q.correctAnswer.trim(),
              },
            });
          }
        }

        setPublishedQuiz({
          id: quizId,
          title: quizTitle.trim(),
          totalQuestions: selectedDrafts.length,
        });
        setCurrentStage('published');
        toast.success('Quiz updated and published successfully!');
      }
    } catch {
      // Handled in mutation hook toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to create another quiz
  const handleCreateAnother = () => {
    setValue('title', '');
    setValue('description', '');
    setValue('categoryId', '');
    setValue('level', '');
    setDraftQuestions([]);
    setDeletedQuestionIds([]);
    setPublishedQuiz(null);
    setCurrentStage('builder');
  };

  // ==========================================
  // STAGE 3: PUBLISHED SCREEN
  // ==========================================
  if (currentStage === 'published' && publishedQuiz) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <Card className="border-border bg-card shadow-lg overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-primary" />
          <CardContent className="pt-10 pb-12 px-6 sm:px-12 text-center space-y-6">
            <div className="mx-auto size-20 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/10 shadow-inner">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1">
                PUBLISHED
              </Badge>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight font-display">
                Quiz Published Successfully!
              </h2>
              <p className="text-muted-foreground text-sm">
                &ldquo;{publishedQuiz.title}&rdquo; has been saved with{' '}
                <strong className="text-foreground">{publishedQuiz.totalQuestions} questions</strong> and is now live for learners.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href={`/learning/quiz/${publishedQuiz.id}`} target="_blank">
                <Button size="lg" className="rounded-xl gap-2 font-semibold shadow-md">
                  <BookOpen className="size-4" /> Try Quiz as Learner <ExternalLink className="size-3.5 opacity-70" />
                </Button>
              </Link>
              <Link href="/admin/quizzes">
                <Button variant="outline" size="lg" className="rounded-xl font-semibold">
                  Back to Quizzes List
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleCreateAnother}
                className="rounded-xl gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-4" /> Create Another Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // STAGE 2: FINAL REVIEW SCREEN
  // ==========================================
  if (currentStage === 'review') {
    const selectedCategoryName = categories.find((c) => c.id === selectedCategoryId)?.name;

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStage('builder')}
              className="gap-2 mb-1 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to Question Drafts
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-display flex items-center gap-2">
              <Layers className="size-6 text-primary" /> Final Review & Verification
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Verify your quiz details and inspect how each question will be presented to learners before publishing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStage('builder')}
            >
              Edit Drafts
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting}
              onClick={handleSaveAndPublishQuiz}
              className="gap-2 font-semibold shadow-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving Quiz...
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save & Publish Quiz
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quiz Metadata Summary Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {quizTitle}
                </CardTitle>
                {quizDescription && (
                  <CardDescription className="mt-1 text-sm">
                    {quizDescription}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedCategoryName && (
                  <Badge variant="secondary" className="font-semibold text-xs">
                    {selectedCategoryName}
                  </Badge>
                )}
                {selectedLevel && (
                  <Badge variant="outline" className="font-bold text-xs">
                    Level {selectedLevel}
                  </Badge>
                )}
                <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-xs">
                  {selectedDrafts.length} Questions
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Total Selected</span>
                <span className="text-2xl font-bold text-foreground">{selectedDrafts.length}</span>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Meaning Questions</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedDrafts.filter((q) => q.type === 'MEANING').length}
                </span>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Fill in Blank</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedDrafts.filter((q) => q.type === 'FILL_BLANK').length}
                </span>
              </div>
              <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                <span className="text-xs text-muted-foreground uppercase font-semibold block">Translation</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedDrafts.filter((q) => q.type === 'TRANSLATION').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Questions Simulation Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-500" /> Learner Experience Preview
            </h2>
            <span className="text-xs text-muted-foreground">
              Showing {selectedDrafts.length} questions in order
            </span>
          </div>

          <div className="space-y-4">
            {selectedDrafts.map((q, idx) => {
              const targetWord = words.find((w: Word) => w.id === q.wordId);
              return (
                <Card key={q.id || idx} className="border-border bg-card shadow-sm hover:border-primary/30 transition-all">
                  <CardHeader className="py-3 px-6 border-b bg-muted/10 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {q.type}
                      </Badge>
                      {targetWord && (
                        <span className="text-xs font-semibold text-muted-foreground">
                          Word: <strong className="text-foreground">{targetWord.word}</strong> ({targetWord.meaning})
                        </span>
                      )}
                    </div>
                    {q.source === 'ai' ? (
                      <Badge variant="outline" className="text-[11px] gap-1 border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5">
                        <Sparkles className="size-3" /> AI
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[11px] gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5">
                        <PenLine className="size-3" /> Manual
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4 px-6 space-y-4">
                    <p className="font-semibold text-base text-foreground">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-sm flex items-center justify-between font-medium transition-all ${
                              isCorrect
                                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500/30 font-bold'
                                : 'border-border/70 bg-muted/20 text-muted-foreground'
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && (
                              <Badge className="bg-emerald-500 text-white text-[10px] font-bold py-0.5">
                                CORRECT
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="sticky bottom-4 z-20 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCurrentStage('builder')}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" /> Back to Drafts
          </Button>

          <Button
            type="button"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSaveAndPublishQuiz}
            className="gap-2 font-bold px-8 shadow-lg bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:opacity-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Saving & Publishing...
              </>
            ) : (
              <>
                <Save className="size-4" /> Save & Publish Quiz ({selectedDrafts.length} Questions)
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // STAGE 1: BUILDER SCREEN (Metadata + Dual Channels + Drafts)
  // ==========================================
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <Link href="/admin/quizzes">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 mb-1 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to Quizzes
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display flex items-center gap-2">
            <HelpCircle className="size-6 text-primary" />
            {mode === 'create' ? 'Create New Quiz' : `Edit Quiz: ${initialQuiz?.title || ''}`}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Build your assessment using AI generation or manual creation, refine your question drafts, and publish.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={handleProceedToReview}
            disabled={selectedDrafts.length === 0}
            className="gap-2 font-semibold shadow-md bg-primary text-primary-foreground"
          >
            Proceed to Final Review ({selectedDrafts.length}) <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Section 1: Quiz Information Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-base font-bold text-foreground">
            Quiz Details
          </CardTitle>
          <CardDescription className="text-xs">
            Configure title, category, and target CEFR level for this quiz.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="quiz-title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quiz Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quiz-title"
              placeholder="e.g. Master Essential Business Vocabulary"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </Label>
              <Select
                value={selectedCategoryId || 'NONE'}
                onValueChange={(val: string | null) =>
                  setValue('categoryId', !val || val === 'NONE' ? '' : val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No Category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Level
              </Label>
              <Select
                value={selectedLevel || 'NONE'}
                onValueChange={(val: string | null) =>
                  setValue('level', !val || val === 'NONE' ? '' : val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select CEFR Level (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Any Level</SelectItem>
                  {LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quiz-desc" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="quiz-desc"
              rows={2}
              placeholder="Brief description or instructions for learners taking this quiz..."
              {...register('description')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Dual Creation Engine (MANUAL vs AI) */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Add Questions Channel
            </span>
          </div>

          {/* Toggle Pills between AI and Manual */}
          <div className="inline-flex rounded-xl bg-muted p-1 border border-border/70">
            <button
              type="button"
              onClick={() => setActiveChannel('ai')}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                activeChannel === 'ai'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="size-3.5 text-primary" /> AI Generator
            </button>
            <button
              type="button"
              onClick={() => setActiveChannel('manual')}
              className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                activeChannel === 'manual'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PenLine className="size-3.5 text-primary" /> Manual Entry
            </button>
          </div>
        </div>

        <CardContent className="p-6">
          {/* AI Channel */}
          {activeChannel === 'ai' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" /> Generate Questions with AI (Gemini)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Generate multiple-choice questions automatically from your vocabulary bank.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Count:</span>
                  {[3, 5, 10].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant={aiCount === num ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiCount(num)}
                      className="size-8 p-0 text-xs font-bold rounded-lg"
                    >
                      {num}
                    </Button>
                  ))}
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={aiCount}
                    onChange={(e) => setAiCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-16 h-8 text-xs font-bold text-center rounded-lg"
                  />
                </div>
              </div>

              {/* Question Types Checkboxes */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Allowed Question Types
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {QUESTION_TYPES.map((t) => {
                    const isChecked = aiSelectedTypes.includes(t.value);
                    return (
                      <div
                        key={t.value}
                        onClick={() => {
                          if (isChecked) {
                            if (aiSelectedTypes.length > 1) {
                              setAiSelectedTypes(aiSelectedTypes.filter((x) => x !== t.value));
                            }
                          } else {
                            setAiSelectedTypes([...aiSelectedTypes, t.value]);
                          }
                        }}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                          isChecked
                            ? 'border-primary/50 bg-primary/5 text-foreground font-semibold shadow-sm'
                            : 'border-border/70 bg-card text-muted-foreground hover:border-border'
                        }`}
                      >
                        <Checkbox checked={isChecked} />
                        <span className="text-xs">{t.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Target: {selectedCategoryId ? categories.find((c) => c.id === selectedCategoryId)?.name : 'All Categories'}, Level: {selectedLevel || 'Any'}
                </span>
                <Button
                  type="button"
                  disabled={generateAiMutation.isPending}
                  onClick={handleGenerateAi}
                  className="gap-2 font-bold px-6 shadow-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                >
                  {generateAiMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" /> Generate {aiCount} Questions
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Manual Channel */}
          {activeChannel === 'manual' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <PenLine className="size-4 text-primary" /> Create Manual Questions
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add single detailed questions, batch generate from vocabulary, or add quick blank drafts.
                  </p>
                </div>

                {/* Sub-modes for manual addition */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex rounded-lg bg-muted p-0.5 border border-border/70 text-xs">
                    <button
                      type="button"
                      onClick={() => setManualSubTab('form')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        manualSubTab === 'form'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Single Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualSubTab('batch')}
                      className={`px-3 py-1 rounded-md font-semibold transition-all ${
                        manualSubTab === 'batch'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Batch from Words
                    </button>
                  </div>

                  <div className="h-4 w-px bg-border hidden sm:block" />

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Quick Drafts:</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlankQuestions(1)}
                      className="h-7 text-xs font-semibold px-2.5 rounded-lg"
                    >
                      +1 Blank
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlankQuestions(3)}
                      className="h-7 text-xs font-semibold px-2.5 rounded-lg"
                    >
                      +3 Blanks
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlankQuestions(5)}
                      className="h-7 text-xs font-semibold px-2.5 rounded-lg"
                    >
                      +5 Blanks
                    </Button>
                  </div>
                </div>
              </div>

              {manualSubTab === 'batch' ? (
                /* Batch Create from Words View */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Select words from your bank to generate question drafts for each word:
                    </span>
                    <Input
                      placeholder="Search words..."
                      value={batchSearch}
                      onChange={(e) => setBatchSearch(e.target.value)}
                      className="h-8 max-w-xs text-xs"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto rounded-xl border border-border/70 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-muted/10">
                    {words
                      .filter((w: Word) =>
                        batchSearch
                          ? w.word.toLowerCase().includes(batchSearch.toLowerCase()) ||
                            (w.meaning && w.meaning.toLowerCase().includes(batchSearch.toLowerCase()))
                          : true
                      )
                      .map((w: Word) => {
                        const isChecked = batchWordIds.includes(w.id);
                        return (
                          <div
                            key={w.id}
                            onClick={() => {
                              if (isChecked) {
                                setBatchWordIds(batchWordIds.filter((id) => id !== w.id));
                              } else {
                                setBatchWordIds([...batchWordIds, w.id]);
                              }
                            }}
                            className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2.5 text-xs transition-all ${
                              isChecked
                                ? 'border-primary/50 bg-primary/10 text-foreground font-semibold shadow-xs'
                                : 'border-border/60 bg-card text-muted-foreground hover:border-border'
                            }`}
                          >
                            <Checkbox checked={isChecked} />
                            <div className="min-w-0 flex-1 truncate">
                              <span className="font-bold text-foreground mr-1.5">{w.word}</span>
                              {w.meaning && <span className="opacity-70 text-[11px] truncate">{w.meaning}</span>}
                            </div>
                            {w.level && <Badge variant="outline" className="text-[10px] px-1 py-0">{w.level}</Badge>}
                          </div>
                        );
                      })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {batchWordIds.length} words selected
                    </span>
                    <Button
                      type="button"
                      disabled={batchWordIds.length === 0}
                      onClick={handleBatchAddFromWords}
                      className="gap-2 font-bold px-6 shadow-md"
                    >
                      <Plus className="size-4" /> Create {batchWordIds.length} Question Drafts
                    </Button>
                  </div>
                </div>
              ) : (
                /* Single Manual Question Form View */
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Target Word <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={manualWordId}
                        onValueChange={(val: string | null) => {
                          setManualWordId(val ?? '');
                          const chosen = words.find((w: Word) => w.id === val);
                          if (chosen && !manualQuestionText.trim()) {
                            setManualQuestionText(`What is the definition of "${chosen.word}"?`);
                            if (chosen.meaning && manualOptions.every((o) => !o.trim())) {
                              setManualOptions([chosen.meaning, '', '', '']);
                              setManualCorrectIndex(0);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          {selectedManualWord ? (
                            <span className="truncate flex items-center gap-1.5 text-left">
                              <span className="font-semibold text-foreground">{selectedManualWord.word}</span>
                              {selectedManualWord.meaning && (
                                <span className="text-muted-foreground text-xs">— {selectedManualWord.meaning}</span>
                              )}
                              {selectedManualWord.level && (
                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                  {selectedManualWord.level}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Select target vocabulary...</span>
                          )}
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
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

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Question Type
                      </Label>
                      <Select
                        value={manualType}
                        onValueChange={(val: string | null) => val && setManualType(val as QuizQuestionType)}
                      >
                        <SelectTrigger>
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
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Question Text <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={manualQuestionText}
                      onChange={(e) => setManualQuestionText(e.target.value)}
                      placeholder="e.g. What is the meaning of 'elaborate'? OR Complete the sentence: She made an _____ speech."
                    />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Options (Radio button marks the correct answer)
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {manualOptions.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2.5 rounded-xl border p-2.5 transition-all ${
                            manualCorrectIndex === optIdx
                              ? 'border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/30'
                              : 'border-border/70 bg-card'
                          }`}
                        >
                          <input
                            type="radio"
                            name="manual-correct-choice"
                            id={`manual-opt-radio-${optIdx}`}
                            checked={manualCorrectIndex === optIdx}
                            onChange={() => setManualCorrectIndex(optIdx)}
                            className="size-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const copy: [string, string, string, string] = [...manualOptions];
                              copy[optIdx] = e.target.value;
                              setManualOptions(copy);
                            }}
                            placeholder={`Option ${optIdx + 1}${manualCorrectIndex === optIdx ? ' (Correct Answer)' : ''}`}
                            className="h-8 text-xs border-0 bg-transparent focus-visible:ring-0 shadow-none px-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleAddManualQuestion}
                      className="gap-2 font-bold px-6"
                    >
                      <Plus className="size-4" /> Add Question to Drafts
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: QUESTION DRAFTS (Central Hub) */}
      <div className="space-y-4">
        {/* Drafts Toolbar & Live Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="size-5 text-primary" /> Question Drafts
            </h2>
            <Badge variant="secondary" className="font-semibold text-xs">
              {draftQuestions.length} Total
            </Badge>
            <Badge
              variant="outline"
              className="border-primary/30 text-primary font-semibold text-xs"
            >
              {selectedDrafts.length} Selected
            </Badge>
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-xs"
            >
              {validDraftsCount} Valid
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddBlankQuestions(1)}
              className="gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5 shadow-xs"
            >
              <Plus className="size-3.5" /> Add Question
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToggleSelectAll}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {isAllSelected ? (
                <>
                  <CheckSquare className="size-3.5" /> Deselect All
                </>
              ) : (
                <>
                  <Square className="size-3.5" /> Select All
                </>
              )}
            </Button>

            {selectedDrafts.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" /> Remove Selected ({selectedDrafts.length})
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Selected Questions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {selectedDrafts.length} selected questions from your draft list?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemoveSelectedDrafts}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Empty State */}
        {draftQuestions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-muted/5">
            <div className="mx-auto size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Question Drafts Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Use the AI Generator above to auto-create questions, or use Manual Entry to add your own questions into drafts.
            </p>
          </div>
        ) : (
          /* Draft Cards List */
          <div className="space-y-4">
            {draftQuestions.map((question, index) => (
              <QuizAiQuestionCard
                key={question.id || index}
                index={index}
                question={question}
                onChange={(updated) => handleUpdateDraft(index, updated)}
                onDelete={() => handleRemoveDraft(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar */}
      {draftQuestions.length > 0 && (
        <div className="sticky bottom-4 z-20 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              {selectedDrafts.length} of {draftQuestions.length} questions selected
            </span>
            {selectedDrafts.length === 0 && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="size-3.5" /> Select at least 1 question
              </span>
            )}
          </div>

          <Button
            type="button"
            size="lg"
            disabled={selectedDrafts.length === 0}
            onClick={handleProceedToReview}
            className="gap-2 font-bold px-6 shadow-md bg-primary text-primary-foreground hover:opacity-95"
          >
            Proceed to Final Review ({selectedDrafts.length}) <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
