'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminCategory, AdminWord, CategoryInput, WordInput } from '@/types/admin';

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

type CategoryFormProps = {
  category: AdminCategory | null;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (input: CategoryInput) => Promise<void>;
};

const CategoryForm = ({ category, isPending, onCancel, onSubmit }: CategoryFormProps) => {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');

  return <form onSubmit={async (event) => { event.preventDefault(); await onSubmit({ name: name.trim(), slug: toSlug(slug || name) }); }} className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f7e3cf] text-[#c56b4e]"><Plus className="size-5" /></span><div><h2 className="font-semibold">{category ? 'Edit category' : 'New category'}</h2><p className="text-sm text-[#657477]">Give learners a clear path.</p></div></div><div className="mt-7 space-y-5"><div className="space-y-2"><Label htmlFor="category-name">Name</Label><Input id="category-name" value={name} onChange={(event) => { setName(event.target.value); if (!category) setSlug(toSlug(event.target.value)); }} required /></div><div className="space-y-2"><Label htmlFor="category-slug">Slug</Label><Input id="category-slug" value={slug} onChange={(event) => setSlug(toSlug(event.target.value))} minLength={2} maxLength={50} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /><p className="text-xs text-[#657477]">2–50 characters, lowercase letters, numbers and hyphens.</p></div><div className="flex gap-2"><Button type="submit" disabled={isPending || toSlug(slug || name).length < 2}>{isPending ? 'Saving...' : category ? 'Update category' : 'Create category'}</Button>{category && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}</div></div></form>;
};

type WordFormProps = {
  word: AdminWord | null;
  categories: AdminCategory[];
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (input: WordInput) => Promise<void>;
};

const WordForm = ({ word, categories, isPending, onCancel, onSubmit }: WordFormProps) => {
  const [value, setValue] = useState<WordInput>({ word: word?.word ?? '', meaning: word?.meaning ?? '', categoryId: word?.categoryId ?? word?.category?.id ?? '' });

  return <form onSubmit={async (event) => { event.preventDefault(); await onSubmit({ ...value, word: value.word.trim(), meaning: value.meaning.trim(), categoryId: value.categoryId || undefined }); }} className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#d9eee4] text-[#286052]"><Plus className="size-5" /></span><div><h2 className="font-semibold">{word ? 'Edit word' : 'New word'}</h2><p className="text-sm text-[#657477]">Add useful language to the library.</p></div></div><div className="mt-7 space-y-5"><div className="space-y-2"><Label htmlFor="word-value">Word</Label><Input id="word-value" value={value.word} onChange={(event) => setValue({ ...value, word: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="word-meaning">Meaning</Label><Input id="word-meaning" value={value.meaning} onChange={(event) => setValue({ ...value, meaning: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="word-category">Category</Label><select id="word-category" value={value.categoryId} onChange={(event) => setValue({ ...value, categoryId: event.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"><option value="">No category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className="flex gap-2"><Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : word ? 'Update word' : 'Create word'}</Button>{word && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}</div></div></form>;
};

export { CategoryForm, WordForm };
