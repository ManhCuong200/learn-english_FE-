'use client';

import { AppSidebar } from '@/components/common/AppSidebar';
import { LayoutDashboard, HelpCircle, ExternalLink, BookA } from 'lucide-react';
import { useAdminLogout } from '@/app/admin/_hooks/useAdminAuth';
import { QuizForm } from '@/app/admin/_components/quizzes/QuizForm';

export default function CreateQuizPage() {
  const logoutMutation = useAdminLogout();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        brand="Eunoia Admin"
        activeHref="/admin/quizzes"
        items={[
          { label: 'Category Management', href: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Vocabulary Management', href: '/admin/words', icon: BookA },
          { label: 'Quiz Management', href: '/admin/quizzes', icon: HelpCircle },
          { label: 'View Learner App', href: '/learning', icon: ExternalLink },
        ]}
        onSignOut={() => logoutMutation.mutate()}
        isSigningOut={logoutMutation.isPending}
      />

      <div className="min-w-0 flex-1 flex flex-col">
        <main className="flex-1 p-6 sm:p-10">
          <div className="mx-auto max-w-5xl">
            <QuizForm mode="create" />
          </div>
        </main>
      </div>
    </div>
  );
}
