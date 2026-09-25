import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLearningHistory, recordLearningHistory } from '../_api/learning-history';
import type { LearningHistoryParams, CreateLearningHistoryPayload } from '@/types/learning-history';

export const useLearningHistory = (params: LearningHistoryParams = {}) => {
  return useQuery({
    queryKey: ['learning-history', params],
    queryFn: () => getLearningHistory(params),
  });
};

export const useRecordLearningHistory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateLearningHistoryPayload) => recordLearningHistory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-history'] });
    },
  });
};
