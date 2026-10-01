export interface ExtractedWordItem {
  word: string;
  meaning: string;
  ipa?: string;
  level?: string;
  partOfSpeech?: string;
  example?: string;
  exampleMeaning?: string;
  selected?: boolean;
}

export interface ExtractedCategoryItem {
  name: string;
  description?: string;
  words: ExtractedWordItem[];
  selected?: boolean;
}

export interface ExtractPdfResponse {
  fileName?: string;
  totalCategories: number;
  totalWords: number;
  categories: ExtractedCategoryItem[];
}

export interface ImportExtractedResponse {
  message: string;
  createdCategories: number;
  createdWords: number;
  updatedWords: number;
  totalProcessedWords: number;
}
