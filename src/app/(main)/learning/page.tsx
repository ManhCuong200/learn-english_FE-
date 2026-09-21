'use client';

import { useAuth } from '@/app/(auth)/_hooks/useAuth';
import { useLogout } from '@/app/(auth)/_hooks/useLogout';
import Header from '@/components/common/Header';
import { AppSidebar } from '@/components/common/AppSidebar';
import { BookOpen, Headphones, LayoutDashboard } from 'lucide-react';
import LearningOverview from '../_components/LearningOverview';

const LearningPage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();

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
    <main className="min-h-screen bg-background lg:flex">
      <AppSidebar
        brand="Eunoia"
        activeHref="/learning"
        items={[
          { label: 'My learning', href: '/learning', icon: LayoutDashboard },
          { label: 'My reading list', href: '#', icon: BookOpen },
          { label: 'Listening room', href: '#', icon: Headphones },
        ]}
        onSignOut={() => logoutMutation.mutate()}
        isSigningOut={logoutMutation.isPending}
      />

      <div className="min-w-0 flex-1">
        <Header variant="app" />
        <LearningOverview firstName={user?.name?.split(' ')[0] || 'reader'} />
      </div>
    </main>
  );
};

export default LearningPage;
