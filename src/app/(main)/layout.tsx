'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/app/(auth)/_hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Header from '@/components/common/Header';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <ProtectedRoute
      isLoading={isLoading}
      isAuthenticated={isAuthenticated}
      redirectTo="/login"
      loadingText="Loading your library..."
    >
      <div className="flex min-h-screen flex-col">
        <Header variant="app" />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MainLayout;
