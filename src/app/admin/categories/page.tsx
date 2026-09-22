import { Metadata } from 'next';
import { CategoryList } from '../_components/CategoryList';
import { CreateCategoryDialog } from '../_components/CreateCategoryDialog';

export const metadata: Metadata = {
  title: 'Manage Categories | Admin',
  description: 'Manage system categories',
};

export default function AdminCategoriesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground mt-2">
            Manage course and learning categories for the platform.
          </p>
        </div>
        <div>
          <CreateCategoryDialog />
        </div>
      </div>
      
      <div className="mt-8">
        <CategoryList />
      </div>
    </div>
  );
}
