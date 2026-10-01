import type { QuizQuestionType } from './quiz';

export interface GenerateQuizQuestionsRequest {
  categoryId?: string;
  level?: string;
  count: number;
  types: QuizQuestionType[];
  wordIds?: string[];
}

export interface RegenerateQuizQuestionRequest {
  wordId: string;
  type?: QuizQuestionType;
  previousQuestion?: string;
  promptHint?: string;
  level?: string;
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

export interface RegenerateQuizQuestionResponse {
  question: AiGeneratedQuestion;
}

export interface DraftAiQuestion extends AiGeneratedQuestion {
  id: string; // Temporary unique ID for client-side keying
  selected: boolean;
  source?: 'ai' | 'manual';
  isRegenerating?: boolean;
}

