'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, HelpCircle, ChevronLeft, ChevronRight, LayoutDashboard, ExternalLink, BookA } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/common/AppSidebar';
import { useModeratorLogout } from '@/app/moderator/_hooks/useModeratorAuth';
import { useModeratorQuizzes } from '@/app/moderator/_hooks/useModeratorQuizzes';
import { QuizFilters } from '@/app/moderator/_components/quizzes/QuizFilters';
import { QuizList } from '@/app/moderator/_components/quizzes/QuizList';

export default function ModeratorQuizzesPage() {
  const logoutMutation = useModeratorLogout();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useModeratorQuizzes({
    search: search || undefined,
    categoryId: categoryId || undefined,
    level: level || undefined,
    page,
    limit: 10,
  });

  const quizzes = data?.data ?? [];
  const meta = data?.meta;

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setLevel('');
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        brand="Eunoia Moderator"
        activeHref="/moderator/quizzes"
        items={[
          { label: 'Category Management', href: '/moderator/dashboard', icon: LayoutDashboard },
          { label: 'Vocabulary Management', href: '/moderator/words', icon: BookA },
          { label: 'Quiz Management', href: '/moderator/quizzes', icon: HelpCircle },
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
              <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                Quiz Management
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Create and manage quizzes & multiple choice questions for learners.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/moderator/quizzes/create">
                <Button className="rounded-full shadow-md gap-2">
                  <Plus className="size-4" /> Create Quiz
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl space-y-6">
            <QuizFilters
              search={search}
              onSearchChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              categoryId={categoryId}
              onCategoryChange={(val) => {
                setCategoryId(val);
                setPage(1);
              }}
              level={level}
              onLevelChange={(val) => {
                setLevel(val);
                setPage(1);
              }}
              onReset={handleResetFilters}
            />

            <QuizList quizzes={quizzes} isLoading={isLoading} />

            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Showing page <span className="font-bold">{meta.page}</span> of{' '}
                  <span className="font-bold">{meta.totalPages}</span> ({meta.total} total quizzes)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="size-4" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
