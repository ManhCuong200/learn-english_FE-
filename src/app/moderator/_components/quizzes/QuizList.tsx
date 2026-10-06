'use client';

import Link from 'next/link';
import { Pencil, Trash2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { ModeratorQuiz } from '@/types/quiz';
import { DeleteQuizDialog } from '@/app/moderator/_components/quizzes/DeleteQuizDialog';

type QuizListProps = {
  quizzes: ModeratorQuiz[];
  isLoading: boolean;
};

export const QuizList = ({ quizzes, isLoading }: QuizListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center bg-card">
        <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground mb-4">
          <HelpCircle className="size-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No quizzes found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No quizzes match your current search or filter parameters. Try adjusting filters or create a new quiz.
        </p>
        <Link href="/moderator/quizzes/create" className="mt-6">
          <Button className="rounded-full">Create Quiz</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Quiz Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4 text-center">Questions</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="transition-colors hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div>
                    <Link
                      href={`/moderator/quizzes/${quiz.id}/edit`}
                      className="font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {quiz.title}
                    </Link>
                    {quiz.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
                        {quiz.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {quiz.category ? (
                    <Badge variant="outline" className="font-normal">
                      {quiz.category.name}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {quiz.level ? (
                    <Badge variant="secondary" className="font-bold">
                      {quiz.level}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {quiz.totalQuestions}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(quiz.updatedAt || quiz.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/moderator/quizzes/${quiz.id}/edit`}>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4" />
                      </Button>
                    </Link>
                    <DeleteQuizDialog quizId={quiz.id} quizTitle={quiz.title}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </DeleteQuizDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
