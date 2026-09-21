export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminWord {
  id: string;
  word: string;
  meaning?: string | null;
  example?: string | null;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
}

export interface CategoryInput {
  name: string;
  slug: string;
}

export interface WordInput {
  word: string;
  meaning: string;
  example?: string;
  categoryId?: string;
}

export type AdminListResponse<T> = T[] | { data: T[] };