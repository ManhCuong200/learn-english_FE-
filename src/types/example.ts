export type Example = {
  id: string;
  content: string;
  meaning: string | null;
  wordId: string;
  createdAt: string;
};

export type CreateExampleRequest = {
  content: string;
  meaning?: string;
};

export type UpdateExampleRequest = {
  content: string;
  meaning?: string;
};
