'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, BookOpen, Check, LogOut, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAdminLogout } from '@/app/hooks/useAdminAuth';
import { useAdminCategories, useAdminCategoryMutations, useAdminWordMutations, useAdminWords } from '@/app/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError } from '@/lib/api';
import { clearAdminSession } from '@/app/hooks/useAdminAuth';
import type { AdminCategory, AdminWord, CategoryInput, WordInput } from '@/types/admin';

const errorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
};

const isAuthError = (error: unknown) => {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
};

const toSlug = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
};

const AdminDashboardPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutMutation = useAdminLogout();
  const categoriesQuery = useAdminCategories();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const wordsQuery = useAdminWords(search);
  const [activeTab, setActiveTab] = useState<'categories' | 'words'>('categories');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [editingWord, setEditingWord] = useState<AdminWord | null>(null);
  const categoryMutations = useAdminCategoryMutations();
  const wordMutations = useAdminWordMutations();

  useEffect(() => {
    const error = categoriesQuery.error ?? wordsQuery.error;
    if (isAuthError(error)) {
      clearAdminSession(queryClient);
      router.replace('/admin/login');
    }
  }, [categoriesQuery.error, queryClient, router, wordsQuery.error]);

  const categories = categoriesQuery.data ?? [];
  const words = wordsQuery.data ?? [];
  const mutationError = [
    categoryMutations.create.error,
    categoryMutations.update.error,
    categoryMutations.remove.error,
    wordMutations.create.error,
    wordMutations.update.error,
    wordMutations.remove.error,
  ].find(Boolean);

  useEffect(() => {
    if (isAuthError(mutationError)) {
      clearAdminSession(queryClient);
      router.replace('/admin/login');
    }
  }, [mutationError, queryClient, router]);

  const isLoading = categoriesQuery.isLoading || wordsQuery.isLoading;
  const isMutating = categoryMutations.create.isPending || categoryMutations.update.isPending || categoryMutations.remove.isPending || wordMutations.create.isPending || wordMutations.update.isPending || wordMutations.remove.isPending;

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
    setEditingWord(null);
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

  const handleWordSubmit = async (input: WordInput) => {
    setFeedback(null);
    if (editingWord) {
      await wordMutations.update.mutateAsync({ id: editingWord.id, input });
      showSuccess('Word updated successfully.');
    } else {
      await wordMutations.create.mutateAsync(input);
      showSuccess('Word created successfully.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    setFeedback(null);
    await categoryMutations.remove.mutateAsync(id);
    setFeedback({ type: 'success', message: 'Category deleted successfully.' });
  };

  const handleDeleteWord = async (id: string) => {
    if (!window.confirm('Delete this word?')) return;
    setFeedback(null);
    await wordMutations.remove.mutateAsync(id);
    setFeedback({ type: 'success', message: 'Word deleted successfully.' });
  };

  return (
    <main className="min-h-screen bg-[#f4f5f1] text-[#203238]">
      <header className="border-b border-[#dfe4dc] bg-[#203238] text-[#f7f4eb]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <div className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase">
            <span className="grid size-9 place-items-center rounded-full bg-[#f5c66f] text-lg text-[#203238]">e</span>
            Eunoia Admin
          </div>
          <Button variant="ghost" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending} className="gap-2 text-[#dce8e3] hover:bg-white/10 hover:text-white">
            <LogOut className="size-4" />
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-[#c56b4e] uppercase">Content control room</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Keep the library useful.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#657477]">Create and maintain the categories and vocabulary that power every learner&apos;s next session.</p>
          </div>
          <div className="rounded-xl border border-[#dfe4dc] bg-white px-4 py-3 text-sm text-[#657477]">
            <span className="font-semibold text-[#203238]">{categories.length}</span> categories · <span className="font-semibold text-[#203238]">{words.length}</span> words
          </div>
        </div>

        {(feedback || mutationError) && (
          <div className={`mt-8 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${feedback?.type === 'success' ? 'border-[#9bc6b6] bg-[#e9f5ee] text-[#286052]' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {feedback?.type === 'success' ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
            {feedback?.message ?? errorMessage(mutationError)}
            <button type="button" className="ml-auto" onClick={() => setFeedback(null)}><X className="size-4" /></button>
          </div>
        )}

        <div className="mt-8 flex gap-2 border-b border-[#dfe4dc]">
          {(['categories', 'words'] as const).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize transition ${activeTab === tab ? 'border-[#c56b4e] text-[#c56b4e]' : 'border-transparent text-[#657477] hover:text-[#203238]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {isLoading && <div className="mt-8 rounded-xl border border-[#dfe4dc] bg-white p-8 text-sm text-[#657477]">Loading admin data...</div>}
        {!isLoading && (categoriesQuery.isError || wordsQuery.isError) && !isAuthError(categoriesQuery.error ?? wordsQuery.error) && <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{errorMessage(categoriesQuery.error ?? wordsQuery.error)}</div>}

        {!isLoading && activeTab === 'categories' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <CategoryForm key={editingCategory?.id ?? 'new-category'} category={editingCategory} isPending={isMutating} onCancel={() => setEditingCategory(null)} onSubmit={handleCategorySubmit} />
            <section className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between"><div><h2 className="font-semibold">Categories</h2><p className="mt-1 text-sm text-[#657477]">Organize vocabulary by learning theme.</p></div><BookOpen className="size-5 text-[#c56b4e]" /></div>
              <div className="mt-6 space-y-3">
                {categories.map((category) => <div key={category.id} className="flex items-center justify-between rounded-xl border border-[#e6e9e4] p-4"><div><p className="font-semibold">{category.name}</p><p className="mt-1 text-sm text-[#657477]">/{category.slug}</p></div><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => setEditingCategory(category)} aria-label={`Edit ${category.name}`}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)} aria-label={`Delete ${category.name}`}><Trash2 className="size-4 text-red-600" /></Button></div></div>)}
                {categories.length === 0 && <p className="rounded-xl bg-[#f4f5f1] p-5 text-sm text-[#657477]">No categories yet. Create the first one.</p>}
              </div>
            </section>
          </div>
        )}

        {!isLoading && activeTab === 'words' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <WordForm key={editingWord?.id ?? 'new-word'} word={editingWord} categories={categories} isPending={isMutating} onCancel={() => setEditingWord(null)} onSubmit={handleWordSubmit} />
            <section className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-semibold">Words</h2><p className="mt-1 text-sm text-[#657477]">Search and maintain the vocabulary bank.</p></div><form onSubmit={(event) => { event.preventDefault(); setSearch(searchInput.trim()); }} className="flex gap-2"><Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search words" className="h-9 w-44" /><Button type="submit" size="icon" aria-label="Search words"><Search className="size-4" /></Button></form></div>
              <div className="mt-6 space-y-3">
                {words.map((word) => <div key={word.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#e6e9e4] p-4"><div className="min-w-0"><p className="font-semibold">{word.word}</p><p className="mt-1 truncate text-sm text-[#657477]">{word.meaning || 'No meaning yet.'}{word.category?.name ? ` · ${word.category.name}` : ''}</p></div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" onClick={() => setEditingWord(word)} aria-label={`Edit ${word.word}`}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDeleteWord(word.id)} aria-label={`Delete ${word.word}`}><Trash2 className="size-4 text-red-600" /></Button></div></div>)}
                {words.length === 0 && <p className="rounded-xl bg-[#f4f5f1] p-5 text-sm text-[#657477]">No words found.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

const CategoryForm = ({ category, isPending, onCancel, onSubmit }: { category: AdminCategory | null; isPending: boolean; onCancel: () => void; onSubmit: (input: CategoryInput) => Promise<void> }) => {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  return <form onSubmit={async (event) => { event.preventDefault(); await onSubmit({ name: name.trim(), slug: toSlug(slug || name) }); }} className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f7e3cf] text-[#c56b4e]"><Plus className="size-5" /></span><div><h2 className="font-semibold">{category ? 'Edit category' : 'New category'}</h2><p className="text-sm text-[#657477]">Give learners a clear path.</p></div></div><div className="mt-7 space-y-5"><div className="space-y-2"><Label htmlFor="category-name">Name</Label><Input id="category-name" value={name} onChange={(event) => { setName(event.target.value); if (!category) setSlug(toSlug(event.target.value)); }} required /></div><div className="space-y-2"><Label htmlFor="category-slug">Slug</Label><Input id="category-slug" value={slug} onChange={(event) => setSlug(toSlug(event.target.value))} minLength={2} maxLength={50} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><p className="text-xs text-[#657477]">2–50 characters, lowercase letters, numbers and hyphens.</p></div><div className="flex gap-2"><Button type="submit" disabled={isPending || toSlug(slug || name).length < 2}>{isPending ? 'Saving...' : category ? 'Update category' : 'Create category'}</Button>{category && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}</div></div></form>;
};

const WordForm = ({ word, categories, isPending, onCancel, onSubmit }: { word: AdminWord | null; categories: AdminCategory[]; isPending: boolean; onCancel: () => void; onSubmit: (input: WordInput) => Promise<void> }) => {
  const [value, setValue] = useState<WordInput>({ word: word?.word ?? '', meaning: word?.meaning ?? '', example: word?.example ?? '', categoryId: word?.categoryId ?? word?.category?.id ?? '' });
  return <form onSubmit={async (event) => { event.preventDefault(); await onSubmit({ ...value, word: value.word.trim(), meaning: value.meaning.trim(), example: value.example?.trim(), categoryId: value.categoryId || undefined }); }} className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#d9eee4] text-[#286052]"><Plus className="size-5" /></span><div><h2 className="font-semibold">{word ? 'Edit word' : 'New word'}</h2><p className="text-sm text-[#657477]">Add useful language to the library.</p></div></div><div className="mt-7 space-y-5"><div className="space-y-2"><Label htmlFor="word-value">Word</Label><Input id="word-value" value={value.word} onChange={(event) => setValue({ ...value, word: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="word-meaning">Meaning</Label><Input id="word-meaning" value={value.meaning} onChange={(event) => setValue({ ...value, meaning: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="word-example">Example</Label><textarea id="word-example" value={value.example} onChange={(event) => setValue({ ...value, example: event.target.value })} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" /></div><div className="space-y-2"><Label htmlFor="word-category">Category</Label><select id="word-category" value={value.categoryId} onChange={(event) => setValue({ ...value, categoryId: event.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"><option value="">No category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className="flex gap-2"><Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : word ? 'Update word' : 'Create word'}</Button>{word && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}</div></div></form>;
};

export default AdminDashboardPage;
