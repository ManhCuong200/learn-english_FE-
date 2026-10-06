export type ToeicPart =
  | 'PART_1'
  | 'PART_2'
  | 'PART_3'
  | 'PART_4'
  | 'PART_5'
  | 'PART_6'
  | 'PART_7';

export type ExamType = 'FULL_TEST' | 'MINI_TEST' | 'PRACTICE_PART';

export interface ToeicExamSummary {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  series: string;
  year: number;
  testNumber: number;
  type: ExamType;
  duration: number;
  totalQuestions: number;
  audioFullUrl?: string | null;
  difficulty?: string | null;
  isPublished: boolean;
  createdAt: string;
  _count?: {
    questions: number;
    passages: number;
    attempts: number;
  };
}

export interface ToeicExamListResponse {
  items: ToeicExamSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ToeicPassage {
  id: string;
  part: ToeicPart;
  passageNumber?: number | null;
  title?: string | null;
  content?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  transcript?: string | null;
  translation?: string | null;
}

export interface ToeicQuestion {
  id: string;
  passageId?: string | null;
  part: ToeicPart;
  questionNumber: number;
  questionText?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  options: Record<string, string>;
}

export interface ToeicExamQuestionsResponse {
  exam: {
    id: string;
    title: string;
    slug: string;
    year: number;
    series: string;
    duration: number;
    audioFullUrl?: string | null;
  };
  totalQuestions: number;
  targetPart: ToeicPart | null;
  passages: ToeicPassage[];
  questions: ToeicQuestion[];
}

export interface ToeicPartStat {
  total: number;
  correct: number;
  accuracy: number;
}

export interface ToeicScoreResult {
  listeningCorrect: number;
  readingCorrect: number;
  scoreListening: number;
  scoreReading: number;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  partAnalytics: Record<ToeicPart, ToeicPartStat>;
  proficiencyLevel: string;
}

export interface ToeicSubmitResponse {
  attemptId: string;
  examId: string;
  examTitle: string;
  targetPart: ToeicPart | null;
  timeSpent: number;
  completedAt: string;
  score: ToeicScoreResult;
}

export interface ToeicAnswerReview {
  id: string;
  questionId: string;
  questionNumber: number;
  part: ToeicPart;
  questionText?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  options: Record<string, string>;
  selectedAnswer?: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string | null;
  transcript?: string | null;
  passage?: ToeicPassage | null;
}

export interface ToeicAttemptReview {
  attemptId: string;
  exam: {
    id: string;
    title: string;
    series: string;
    year: number;
  };
  targetPart: ToeicPart | null;
  startedAt: string;
  completedAt?: string | null;
  timeSpent: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  scores: {
    listeningCorrect: number;
    readingCorrect: number;
    scoreListening: number;
    scoreReading: number;
    totalScore: number;
  };
  partStats: Record<ToeicPart, { total: number; correct: number }>;
  answers: ToeicAnswerReview[];
}

export interface ToeicUserAttemptItem {
  id: string;
  examId: string;
  totalQuestions: number;
  correctAnswers: number;
  scoreListening: number;
  scoreReading: number;
  totalScore: number;
  timeSpent: number;
  targetPart: ToeicPart | null;
  startedAt: string;
  completedAt?: string | null;
  exam: {
    id: string;
    title: string;
    year: number;
    series: string;
    slug: string;
  };
}
