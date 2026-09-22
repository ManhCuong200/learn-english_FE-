'use client';

import { useCategories } from '../_hooks/useCategories';
import { EditCategoryDialog } from './EditCategoryDialog';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

export const CategoryList = () => {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading categories...</div>;
  if (error) return <div className="py-8 text-center text-destructive">Error loading categories.</div>;
  if (!categories || categories.length === 0) return <div className="py-8 text-center text-muted-foreground">No categories found.</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>
                {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditCategoryDialog category={category}>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </EditCategoryDialog>

                  <DeleteCategoryDialog categoryId={category.id} categoryName={category.name}>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DeleteCategoryDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
