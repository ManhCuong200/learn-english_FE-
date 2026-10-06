'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/common/AppSidebar';
import { LayoutDashboard, HelpCircle, ExternalLink, ArrowLeft, BookA } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useModeratorLogout } from '@/app/moderator/_hooks/useModeratorAuth';
import { useModeratorQuiz } from '@/app/moderator/_hooks/useModeratorQuiz';
import { QuizForm } from '@/app/moderator/_components/quizzes/QuizForm';

type EditQuizPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditQuizPage({ params }: EditQuizPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const logoutMutation = useModeratorLogout();

  const { data: quiz, isLoading, isError } = useModeratorQuiz(id);

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
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-48 rounded-full" />
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
            ) : isError || !quiz ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center">
                <h2 className="text-2xl font-bold text-foreground">Quiz not found</h2>
                <p className="mt-2 text-muted-foreground">
                  The quiz you are trying to edit does not exist or was deleted.
                </p>
                <Button
                  className="mt-6 rounded-full"
                  onClick={() => router.push('/moderator/quizzes')}
                >
                  <ArrowLeft className="mr-2 size-4" /> Back to Quizzes
                </Button>
              </div>
            ) : (
              <QuizForm mode="edit" initialQuiz={quiz} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
