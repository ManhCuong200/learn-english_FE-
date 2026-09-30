'use client';

import { useAuth } from '@/app/(auth)/_hooks/useAuth';
import LearningOverview from '@/app/(main)/_components/overview/LearningOverview';

const LearningPage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>You are not logged in.</p>
      </main>
    );
  }

  return (
    <div className="w-full">
      <LearningOverview firstName={user?.name?.split(' ')[0] || 'reader'} />
    </div>
  );
};

export default LearningPage;
