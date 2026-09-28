'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/common/AppSidebar';
import { LayoutDashboard, ExternalLink } from 'lucide-react';
import { useAdminLogout } from '@/app/admin/_hooks/useAdminAuth';
import { useAdminQuizzes } from '@/app/admin/_hooks/useAdminQuizzes';
import { QuizFilters } from '@/app/admin/_components/QuizFilters';
import { QuizList } from '@/app/admin/_components/QuizList';

export default function AdminQuizzesPage() {
  const logoutMutation = useAdminLogout();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminQuizzes({
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
        brand="Eunoia Admin"
        activeHref="/admin/quizzes"
        items={[
          { label: 'Content dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Quiz Management', href: '/admin/quizzes', icon: HelpCircle },
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

            <Link href="/admin/quizzes/create">
              <Button className="rounded-full shadow-md gap-2">
                <Plus className="size-4" /> Create Quiz
              </Button>
            </Link>
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
