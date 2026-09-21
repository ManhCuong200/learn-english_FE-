'use client';

import { BookOpen, Pencil, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AdminCategory, AdminWord } from '@/types/admin';

type CategoryPanelProps = {
  categories: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
  onDelete: (id: string) => void;
};

const CategoryPanel = ({ categories, onEdit, onDelete }: CategoryPanelProps) => (
  <section className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8">
    <div className="flex items-center justify-between"><div><h2 className="font-semibold">Categories</h2><p className="mt-1 text-sm text-[#657477]">Organize vocabulary by learning theme.</p></div><BookOpen className="size-5 text-[#c56b4e]" /></div>
    <div className="mt-6 space-y-3">
      {categories.map((category) => <div key={category.id} className="flex items-center justify-between rounded-xl border border-[#e6e9e4] p-4"><div><p className="font-semibold">{category.name}</p><p className="mt-1 text-sm text-[#657477]">/{category.slug}</p></div><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => onEdit(category)} aria-label={`Edit ${category.name}`}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => onDelete(category.id)} aria-label={`Delete ${category.name}`}><Trash2 className="size-4 text-red-600" /></Button></div></div>)}
      {categories.length === 0 && <p className="rounded-xl bg-[#f4f5f1] p-5 text-sm text-[#657477]">No categories yet. Create the first one.</p>}
    </div>
  </section>
);

type WordPanelProps = {
  words: AdminWord[];
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onEdit: (word: AdminWord) => void;
  onDelete: (id: string) => void;
};

const WordPanel = ({ words, searchInput, onSearchInputChange, onSearch, onEdit, onDelete }: WordPanelProps) => (
  <section className="rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-semibold">Words</h2><p className="mt-1 text-sm text-[#657477]">Search and maintain the vocabulary bank.</p></div><form onSubmit={(event) => { event.preventDefault(); onSearch(); }} className="flex gap-2"><Input value={searchInput} onChange={(event) => onSearchInputChange(event.target.value)} placeholder="Search words" className="h-9 w-44" /><Button type="submit" size="icon" aria-label="Search words"><Search className="size-4" /></Button></form></div>
    <div className="mt-6 space-y-3">
      {words.map((word) => <div key={word.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#e6e9e4] p-4"><div className="min-w-0"><p className="font-semibold">{word.word}</p><p className="mt-1 truncate text-sm text-[#657477]">{word.meaning || 'No meaning yet.'}{word.category?.name ? ` · ${word.category.name}` : ''}</p></div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" onClick={() => onEdit(word)} aria-label={`Edit ${word.word}`}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => onDelete(word.id)} aria-label={`Delete ${word.word}`}><Trash2 className="size-4 text-red-600" /></Button></div></div>)}
      {words.length === 0 && <p className="rounded-xl bg-[#f4f5f1] p-5 text-sm text-[#657477]">No words found.</p>}
    </div>
  </section>
);

export { CategoryPanel, WordPanel };
