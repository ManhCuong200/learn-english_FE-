export interface QuizCategory {
  id: string;
  name: string;
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string | null;
  category: QuizCategory | null;
  level: string | null;
  totalQuestions: number;
}

export type QuizQuestionType =
  | 'MEANING'
  | 'FILL_BLANK'
  | 'TRANSLATION';

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
}

export interface QuizDetail extends QuizSummary {
  questions: QuizQuestion[];
}

export interface QuizStartResponse {
  attemptId: string;
  quiz: {
    id: string;
    title: string;
    totalQuestions: number;
  };
  questions: QuizQuestion[];
  startedAt: string;
}

export interface QuizAnswerRequest {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizSubmitRequest {
  answers: QuizAnswerRequest[];
}

export interface QuizResultAnswer {
  questionId: string;
  question?: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface QuizSubmitResponse {
  attemptId: string;
  quiz: {
    id: string;
    title: string;
  };
  result: QuizResult;
  completedAt: string;
  answers: QuizResultAnswer[];
}

export interface QuizAttempt {
  attemptId: string;
  quiz: {
    id: string;
    title: string;
  };
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  startedAt: string;
  completedAt: string | null;
  answers: QuizResultAnswer[];
}

export interface QuizListResponse {
  data: QuizSummary[];
}

export interface AdminQuizQuestion {
  id: string;
  quizId: string;
  wordId: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correctAnswer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminQuiz {
  id: string;
  title: string;
  description: string | null;
  categoryId: string | null;
  level: string | null;
  totalQuestions: number;
  category?: QuizCategory | null;
  questions?: AdminQuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizRequest {
  title: string;
  description?: string | null;
  categoryId?: string | null;
  level?: string | null;
  questions?: CreateQuizQuestionRequest[];
}

export interface UpdateQuizRequest {
  title?: string;
  description?: string | null;
  categoryId?: string | null;
  level?: string | null;
}

export interface CreateQuizQuestionRequest {
  wordId: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correctAnswer: string;
}

export interface UpdateQuizQuestionRequest {
  wordId?: string;
  question?: string;
  type?: QuizQuestionType;
  options?: string[];
  correctAnswer?: string;
}

export interface AdminQuizQueryParams {
  search?: string;
  categoryId?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export interface AdminQuizListResponse {
  data: AdminQuiz[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
