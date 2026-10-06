import { apiFetch } from '@/api/client';
import {
  ToeicAttemptReview,
  ToeicExamListResponse,
  ToeicExamQuestionsResponse,
  ToeicExamSummary,
  ToeicPart,
  ToeicSubmitResponse,
  ToeicUserAttemptItem,
} from '@/types/toeic';

export async function getToeicExams(params?: {
  year?: number;
  series?: string;
  type?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ToeicExamListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.set('year', String(params.year));
  if (params?.series) searchParams.set('series', params.series);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  const endpoint = `/toeic/exams${query ? `?${query}` : ''}`;

  return apiFetch<ToeicExamListResponse>(endpoint, {
    method: 'GET',
  });
}

export async function getToeicExamDetail(
  idOrSlug: string,
): Promise<ToeicExamSummary & { partCounts: Record<string, number> }> {
  return apiFetch<ToeicExamSummary & { partCounts: Record<string, number> }>(
    `/toeic/exams/${idOrSlug}`,
    {
      method: 'GET',
    },
  );
}

export async function getToeicExamQuestions(
  idOrSlug: string,
  targetPart?: ToeicPart | null,
): Promise<ToeicExamQuestionsResponse> {
  const query = targetPart ? `?targetPart=${targetPart}` : '';
  return apiFetch<ToeicExamQuestionsResponse>(
    `/toeic/exams/${idOrSlug}/questions${query}`,
    {
      method: 'GET',
    },
  );
}

export async function startToeicExam(
  examId: string,
  targetPart?: ToeicPart | null,
): Promise<{
  attemptId: string;
  examId: string;
  examTitle: string;
  targetPart: ToeicPart | null;
  totalQuestions: number;
  startedAt: string;
}> {
  return apiFetch(`/toeic/exams/${examId}/start`, {
    method: 'POST',
    body: { targetPart: targetPart || null },
  });
}

export async function submitToeicExam(
  attemptId: string,
  data: {
    timeSpent: number;
    answers: Array<{ questionId: string; selectedAnswer: string | null }>;
  },
): Promise<ToeicSubmitResponse> {
  return apiFetch<ToeicSubmitResponse>(`/toeic/attempts/${attemptId}/submit`, {
    method: 'POST',
    body: data,
  });
}

export async function getToeicAttemptDetail(
  attemptId: string,
): Promise<ToeicAttemptReview> {
  return apiFetch<ToeicAttemptReview>(`/toeic/attempts/${attemptId}`, {
    method: 'GET',
  });
}

export async function getToeicUserHistory(): Promise<ToeicUserAttemptItem[]> {
  return apiFetch<ToeicUserAttemptItem[]>('/toeic/user/history', {
    method: 'GET',
  });
}

export async function generateToeicExamAi(data: {
  title?: string;
  year?: number;
  difficulty?: string;
  topic?: string;
  parts?: ToeicPart[];
  saveToDatabase?: boolean;
}): Promise<unknown> {
  return apiFetch('/toeic/ai/generate-exam', {
    method: 'POST',
    body: data,
    timeout: 180000,
  });
}

export async function generateToeicPartAi(data: {
  part: ToeicPart;
  count?: number;
  difficulty?: string;
  topic?: string;
  examId?: string;
}): Promise<unknown> {
  return apiFetch('/toeic/ai/generate-part', {
    method: 'POST',
    body: data,
    timeout: 60000,
  });
}
