'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  LayoutDashboard,
  LogOut,
  X,
  ExternalLink,
  HelpCircle,
  BookA,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAdminLogout } from '@/app/admin/_hooks/useAdminAuth';
import { useAdminCategories, useAdminCategoryMutations } from '@/app/admin/_hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { AppSidebar } from '@/components/common/AppSidebar';
import { ApiError } from '@/api';
import { clearAdminSession } from '@/app/admin/_hooks/useAdminAuth';
import type { AdminCategory, CategoryInput } from '@/types/admin';
import { CategoryForm } from '@/app/admin/_components/overview/AdminForms';
import { CategoryPanel } from '@/app/admin/_components/overview/AdminDataPanels';

const errorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
};

const isAuthError = (error: unknown) => {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
};

const AdminDashboardPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useAdminLogout();
  const categoriesQuery = useAdminCategories();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const categoryMutations = useAdminCategoryMutations();

  useEffect(() => {
    const error = categoriesQuery.error;
    if (isAuthError(error)) {
      clearAdminSession(queryClient);
      router.replace('/admin/login');
    }
  }, [categoriesQuery.error, queryClient, router]);

  const categories = categoriesQuery.data ?? [];
  const mutationError = [
    categoryMutations.create.error,
    categoryMutations.update.error,
    categoryMutations.remove.error,
  ].find(Boolean);

  useEffect(() => {
    if (isAuthError(mutationError)) {
      clearAdminSession(queryClient);
      router.replace('/admin/login');
    }
  }, [mutationError, queryClient, router]);

  const isLoading = categoriesQuery.isLoading;
  const isMutating =
    categoryMutations.create.isPending ||
    categoryMutations.update.isPending ||
    categoryMutations.remove.isPending;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f1] text-[#657477]">
        <p className="text-sm font-medium">Checking admin access...</p>
      </main>
    );
  }

  const showSuccess = (message: string) => {
    setFeedback({ type: 'success', message });
    setEditingCategory(null);
  };

  const handleCategorySubmit = async (input: CategoryInput) => {
    setFeedback(null);
    if (editingCategory) {
      await categoryMutations.update.mutateAsync({ id: editingCategory.id, input });
      showSuccess('Category updated successfully.');
    } else {
      await categoryMutations.create.mutateAsync(input);
      showSuccess('Category created successfully.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    setFeedback(null);
    await categoryMutations.remove.mutateAsync(id);
    setFeedback({ type: 'success', message: 'Category deleted successfully.' });
  };

  return (
    <main className="min-h-screen bg-[#f4f5f1] text-[#203238] lg:flex">
      <AppSidebar
        brand="Eunoia Admin"
        activeHref="/admin/dashboard"
        items={[
          { label: 'Category Management', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Vocabulary Management', href: '/admin/words', icon: BookA },
          { label: 'Quiz Management', href: '/admin/quizzes', icon: HelpCircle },
          { label: 'View Learner App', href: '/learning', icon: ExternalLink },
        ]}
        onSignOut={() => logoutMutation.mutate()}
        isSigningOut={logoutMutation.isPending}
      />
      <div className="min-w-0 flex-1">
        <header className="border-b border-[#dfe4dc] bg-[#203238] text-[#f7f4eb] lg:hidden">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
            <div className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase">
              <span className="grid size-9 place-items-center rounded-full bg-[#f5c66f] text-lg text-[#203238]">e</span>
              Eunoia Admin
            </div>
            <div className="flex items-center gap-2">
              <Link href="/learning" className="rounded-md px-3 py-2 text-sm font-medium text-[#dce8e3] hover:bg-white/10 hover:text-white transition-colors">
                App
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending} className="gap-2 text-[#dce8e3] hover:bg-white/10 hover:text-white">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{logoutMutation.isPending ? 'Signing out...' : 'Sign out'}</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#c56b4e] uppercase">Content control room</p>
              <h1 className="mt-2 font-display text-4xl sm:text-5xl">Category Management</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#657477]">
                Create and maintain categories that organize all vocabulary topics. To manage and edit words, please visit{' '}
                <Link href="/admin/words" className="text-[#c56b4e] font-semibold underline underline-offset-4 hover:opacity-85">
                  Vocabulary Management
                </Link>.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/admin/words">
                <Button variant="outline" className="gap-2 border-[#dfe4dc] text-xs font-bold h-9">
                  <BookA className="size-4 text-[#c56b4e]" />
                  Vocabulary Management
                </Button>
              </Link>
              <div className="rounded-xl border border-[#dfe4dc] bg-white px-4 py-2 text-sm text-[#657477]">
                <span className="font-semibold text-[#203238]">{categories.length}</span> categories
              </div>
            </div>
          </div>

          {(feedback || mutationError) && (
            <div className={`mt-8 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${feedback?.type === 'success' ? 'border-[#9bc6b6] bg-[#e9f5ee] text-[#286052]' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {feedback?.type === 'success' ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
              {feedback?.message ?? errorMessage(mutationError)}
              <button type="button" className="ml-auto" onClick={() => setFeedback(null)}><X className="size-4" /></button>
            </div>
          )}

          {!isLoading && (categoriesQuery.isError) && !isAuthError(categoriesQuery.error) && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {errorMessage(categoriesQuery.error)}
            </div>
          )}

          {!isLoading && (
            <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <CategoryForm
                key={editingCategory?.id ?? 'new-category'}
                category={editingCategory}
                isPending={isMutating}
                onCancel={() => setEditingCategory(null)}
                onSubmit={handleCategorySubmit}
              />
              <CategoryPanel
                categories={categories}
                onEdit={setEditingCategory}
                onDelete={handleDeleteCategory}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
