'use client';

import { AppSidebar } from '@/components/common/AppSidebar';
import { LayoutDashboard, HelpCircle, ExternalLink, BookA } from 'lucide-react';
import { useModeratorLogout } from '@/app/moderator/_hooks/useModeratorAuth';
import { QuizForm } from '@/app/moderator/_components/quizzes/QuizForm';

export default function CreateQuizPage() {
  const logoutMutation = useModeratorLogout();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        brand="Eunoia Moderator"
        activeHref="/moderator/quizzes"
        items={[
          { label: 'Category Management', href: '/moderator/dashboard', icon: LayoutDashboard },
          { label: 'Vocabulary Management', href: '/moderator/words', icon: BookA },
          { label: 'Quiz Management', href: '/moderator/quizzes', icon: HelpCircle },
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
