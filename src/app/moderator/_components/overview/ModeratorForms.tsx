'use client';

import { useState } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ModeratorCategory, ModeratorWord, CategoryInput, WordInput } from '@/types/moderator';
import { fetchWordInfo } from '@/app/moderator/_api/words';

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
  category: ModeratorCategory | null;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (input: CategoryInput) => Promise<void>;
};

const CategoryForm = ({ category, isPending, onCancel, onSubmit }: CategoryFormProps) => {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({ name: name.trim(), slug: toSlug(slug || name) });
        if (!category) {
          setName('');
          setSlug('');
        }
      }}
      className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-[#f7e3cf] text-[#c56b4e]">
          <Plus className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">{category ? 'Edit category' : 'Create category'}</h2>
          <p className="text-sm text-[#657477]">Give learners a clear path.</p>
        </div>
      </div>
      <div className="mt-7 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="category-name">Name</Label>
          <Input
            id="category-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!category) setSlug(toSlug(event.target.value));
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-slug">Slug</Label>
          <Input
            id="category-slug"
            value={slug}
            onChange={(event) => setSlug(toSlug(event.target.value))}
            minLength={2}
            maxLength={50}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
          <p className="text-xs text-[#657477]">2–50 characters, lowercase letters, numbers and hyphens.</p>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending || toSlug(slug || name).length < 2}>
            {isPending ? (category ? 'Updating...' : 'Creating...') : category ? 'Update category' : 'Create category'}
          </Button>
          {category && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

type WordFormProps = {
  word: ModeratorWord | null;
  categories: ModeratorCategory[];
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (input: WordInput) => Promise<void>;
};

const WordForm = ({ word, categories, isPending, onCancel, onSubmit }: WordFormProps) => {
  const [value, setValue] = useState<WordInput>({
    word: word?.word ?? '',
    meaning: word?.meaning ?? '',
    ipa: word?.ipa ?? word?.pronunciation ?? '',
    pronunciation: word?.pronunciation ?? word?.ipa ?? '',
    categoryId: word?.categoryId ?? word?.category?.id ?? '',
  });
  const [isAutoFetching, setIsAutoFetching] = useState(false);

  const handleAutoFetch = async () => {
    if (!value.word.trim()) return;
    setIsAutoFetching(true);
    try {
      const data = await fetchWordInfo(value.word.trim());
      setValue((prev) => ({
        ...prev,
        meaning: data.meaning || prev.meaning,
        ipa: data.ipa || prev.ipa,
        pronunciation: data.ipa || prev.pronunciation,
      }));
    } catch {
      // Ignore
    } finally {
      setIsAutoFetching(false);
    }
  };

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const ipaVal = value.ipa?.trim() || value.pronunciation?.trim();
        await onSubmit({
          ...value,
          word: value.word.trim(),
          meaning: value.meaning.trim(),
          ipa: ipaVal,
          pronunciation: ipaVal,
          categoryId: value.categoryId || undefined,
        });
        if (!word) {
          setValue({ word: '', meaning: '', ipa: '', pronunciation: '', categoryId: '' });
        }
      }}
      className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#d9eee4] text-[#286052]">
            <Plus className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">{word ? 'Edit word' : 'Create word'}</h2>
            <p className="text-sm text-[#657477]">{word ? 'Update word details in the library.' : 'Add a new word to the library.'}</p>
          </div>
        </div>
      </div>
      <div className="mt-7 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="word-value">Word</Label>
            <button
              type="button"
              disabled={isAutoFetching || !value.word.trim()}
              onClick={handleAutoFetch}
              className="flex items-center gap-1.5 text-xs font-bold text-[#286052] hover:underline disabled:opacity-40"
            >
              {isAutoFetching ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3 text-amber-500" />}
              {isAutoFetching ? 'Đang tra...' : '✨ Tra từ tự động'}
            </button>
          </div>
          <Input
            id="word-value"
            value={value.word}
            onChange={(event) => setValue({ ...value, word: event.target.value })}
            placeholder="e.g. resilient"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="word-meaning">Meaning</Label>
          <Input
            id="word-meaning"
            value={value.meaning}
            onChange={(event) => setValue({ ...value, meaning: event.target.value })}
            placeholder="e.g. xin chào"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="word-ipa">IPA (Phiên âm)</Label>
          <Input
            id="word-ipa"
            value={value.ipa}
            onChange={(event) => setValue({ ...value, ipa: event.target.value, pronunciation: event.target.value })}
            placeholder="e.g. /həˈloʊ/"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="word-category">Category</Label>
          <select
            id="word-category"
            value={value.categoryId}
            onChange={(event) => setValue({ ...value, categoryId: event.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (word ? 'Updating...' : 'Creating...') : word ? 'Update word' : 'Create word'}
          </Button>
          {word && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export { CategoryForm, WordForm };
