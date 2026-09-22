export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryRequest = {
  name: string;
  slug: string;
};

export type UpdateCategoryRequest = {
  name?: string;
  slug?: string;
};
