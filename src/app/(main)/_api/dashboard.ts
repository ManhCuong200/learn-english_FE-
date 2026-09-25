import { apiFetch } from '@/api/client';

export interface DashboardOverviewResponse {
  streak: {
    currentStreak: number;
    thisWeekActivity: boolean[];
  };
  progress: {
    hoursThisWeek: number;
    weeklyGoalHours: number;
    percentVsLastWeek: number;
    thisWeekDailyPercents: number[];
  };
  flashcard: {
    dueCount: number;
    estimatedMinutes: number;
  };
}

export const getDashboardOverview = async (): Promise<DashboardOverviewResponse> => {
  return apiFetch<DashboardOverviewResponse>('/dashboard/overview');
};
