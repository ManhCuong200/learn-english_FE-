export interface ModeratorLoginRequest {
  email: string;
  password: string;
}

export interface ModeratorLoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
  accessToken?: string;
}

export interface ModeratorCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ModeratorWord {
  id: string;
  word: string;
  meaning?: string | null;
  pronunciation?: string | null;
  ipa?: string | null;
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
  pronunciation?: string;
  ipa?: string;
  categoryId?: string;
}

export type ModeratorListResponse<T> = T[] | { data: T[] };