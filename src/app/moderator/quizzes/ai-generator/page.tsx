'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppSidebar } from '@/components/common/AppSidebar';
import {
  LayoutDashboard,
  HelpCircle,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Plus,
  Loader2,
  BookA,
} from 'lucide-react';
import { useModeratorLogout } from '@/app/moderator/_hooks/useModeratorAuth';
import { useModeratorQuizzes } from '@/app/moderator/_hooks/useModeratorQuizzes';
import { useCreateQuiz } from '@/app/moderator/_hooks/useCreateQuiz';
import { useCategories } from '@/app/moderator/_hooks/useCategories';
import { QuizAiGenerator } from '@/app/moderator/_components/quiz-ai/QuizAiGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function ModeratorAiQuizGeneratorPage() {
  const logoutMutation = useModeratorLogout();
  const createQuizMutation = useCreateQuiz();
  const { data: categories = [] } = useCategories();
  const { data: quizzesData } = useModeratorQuizzes({ limit: 100 });
  const quizzes = quizzesData?.data ?? [];

  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Quick Create Quiz Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newLevel, setNewLevel] = useState('');

  const handleCreateNewQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Quiz title is required.');
      return;
    }

    try {
      const created = await createQuizMutation.mutateAsync({
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        categoryId: newCategoryId || null,
        level: newLevel || null,
      });

      setSelectedQuizId(created.id);
      setCreateDialogOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewCategoryId('');
      setNewLevel('');
      toast.success(`Created & selected target quiz "${created.title}"!`);
    } catch {
      // Handled in mutation toast
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        brand="Eunoia Moderator"
        activeHref="/moderator/quizzes"
        items={[
          {
            label: 'Category Management',
            href: '/moderator/dashboard',
            icon: LayoutDashboard,
          },
          {
            label: 'Vocabulary Management',
            href: '/moderator/words',
            icon: BookA,
          },
          {
            label: 'Quiz Management',
            href: '/moderator/quizzes',
            icon: HelpCircle,
          },
          { label: 'View Learner App', href: '/learning', icon: ExternalLink },
        ]}
        onSignOut={() => logoutMutation.mutate()}
        isSigningOut={logoutMutation.isPending}
      />

      <div className="min-w-0 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-border bg-card px-6 py-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <Link href="/moderator/quizzes">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-2 size-4" /> Back to Quizzes
                </Button>
              </Link>
              <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl flex items-center gap-2">
                <Sparkles className="size-6 text-primary" /> AI Quiz Generator
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Generate vocabulary questions using Gemini AI, review & edit choices, and save directly to any quiz.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Target Quiz Picker Card */}
            <Card className="border-border shadow-sm bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="target-quiz" className="font-bold text-sm">
                      Target Quiz to Add Generated Questions (Optional)
                    </Label>
                    <Select
                      value={selectedQuizId || 'NONE'}
                      onValueChange={(val: string | null) =>
                        setSelectedQuizId(!val || val === 'NONE' ? '' : val)
                      }
                    >
                      <SelectTrigger id="target-quiz" className="w-full sm:w-[420px]">
                        <SelectValue placeholder="Select target quiz to populate..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="NONE">
                          -- No Target Quiz Selected --
                        </SelectItem>
                        {quizzes.map((quiz) => (
                          <SelectItem key={quiz.id} value={quiz.id}>
                            <span className="font-bold">{quiz.title}</span>
                            {quiz.level ? ` (${quiz.level})` : ''} — {quiz.totalQuestions} question(s)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Create New Quiz Dialog Button */}
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger render={
                      <Button variant="outline" className="gap-2 border-primary/40 text-primary hover:bg-primary/5">
                        <Plus className="size-4" /> Create New Target Quiz
                      </Button>
                    } />
                    <DialogContent className="sm:max-w-[500px]">
                      <form onSubmit={handleCreateNewQuiz}>
                        <DialogHeader>
                          <DialogTitle>Create New Target Quiz</DialogTitle>
                          <DialogDescription>
                            Create a new Quiz container to populate with AI generated questions.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="quiz-title" className="font-semibold">
                              Quiz Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="quiz-title"
                              placeholder="e.g., Daily Vocabulary Practice A2"
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="quiz-desc" className="font-semibold">
                              Description (Optional)
                            </Label>
                            <Textarea
                              id="quiz-desc"
                              placeholder="Short overview..."
                              rows={2}
                              value={newDescription}
                              onChange={(e) => setNewDescription(e.target.value)}
                            />
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="font-semibold">Category</Label>
                              <Select
                                value={newCategoryId || 'NONE'}
                                onValueChange={(val: string | null) =>
                                  setNewCategoryId(!val || val === 'NONE' ? '' : val)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Category..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="NONE">None</SelectItem>
                                  {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                      {c.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="font-semibold">Level</Label>
                              <Select
                                value={newLevel || 'NONE'}
                                onValueChange={(val: string | null) =>
                                  setNewLevel(!val || val === 'NONE' ? '' : val)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Level..." />
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
                        </div>

                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateDialogOpen(false)}
                            disabled={createQuizMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={createQuizMutation.isPending} className="gap-2">
                            {createQuizMutation.isPending ? (
                              <>
                                <Loader2 className="size-4 animate-spin" /> Creating...
                              </>
                            ) : (
                              'Create & Select'
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selecting a target quiz enables direct &quot;Approve & Add to Quiz&quot; action.
                </p>
              </CardContent>
            </Card>

            {/* AI Generator Component */}
            <QuizAiGenerator quizId={selectedQuizId || undefined} />
          </div>
        </main>
      </div>
    </div>
  );
}
