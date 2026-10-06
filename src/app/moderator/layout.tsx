'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ModeratorAuthProvider } from '@/providers/ModeratorAuthProvider';
import { ModeratorProtectedRoute } from '@/components/moderator/ModeratorProtectedRoute';
import { useModeratorAuthContext } from '@/providers/ModeratorAuthProvider';

const ModeratorLayoutInner = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useModeratorAuthContext();

  useEffect(() => {
    if (pathname !== '/moderator/login' && !isLoading && !isAuthenticated) {
      router.replace('/moderator/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (pathname === '/moderator/login') {
    return <>{children}</>;
  }

  return (
    <ModeratorProtectedRoute
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      loadingText="Checking moderator access..."
    >
      {children}
    </ModeratorProtectedRoute>
  );
};

const ModeratorLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ModeratorAuthProvider>
      <ModeratorLayoutInner>{children}</ModeratorLayoutInner>
    </ModeratorAuthProvider>
  );
};

export default ModeratorLayout;
