export type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: string;
  word: string;
  pronunciation?: string | null;
  level?: string | null;
  category?: string;
  options: QuizOption[];
};

export type QuizAnswerItem = {
  wordId: string;
  isCorrect: boolean;
};

export type QuizSubmitResult = {
  score: number;
  correctCount: number;
  totalQuestions: number;
};
