import type { QuizQuestionType } from './quiz';

export interface GenerateQuizQuestionsRequest {
  categoryId?: string;
  level?: string;
  count: number;
  types: QuizQuestionType[];
}

export interface AiGeneratedQuestion {
  wordId: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correctAnswer: string;
}

export interface GenerateQuizQuestionsResponse {
  questions: AiGeneratedQuestion[];
}

export interface DraftAiQuestion extends AiGeneratedQuestion {
  id: string; // Temporary unique ID for client-side keying
  selected: boolean;
}
