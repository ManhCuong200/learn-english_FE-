import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLearningHistory, recordLearningHistory } from '../_api/learning-history';
import type {
  LearningHistoryParams,
  CreateLearningHistoryPayload,
  LearningHistoryResponse,
} from '@/types/learning-history';
import { historyKeys, progressKeys, dashboardKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useLearningHistory = (params: LearningHistoryParams = {}) => {
  return useQuery<LearningHistoryResponse, ApiError>({
    queryKey: historyKeys.list(params as Record<string, unknown>),
    queryFn: () => getLearningHistory(params),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useRecordLearningHistory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, CreateLearningHistoryPayload>({
    mutationFn: (payload: CreateLearningHistoryPayload) => recordLearningHistory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};
