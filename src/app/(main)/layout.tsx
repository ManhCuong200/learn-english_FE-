'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/app/(auth)/_hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

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
      {children}
    </ProtectedRoute>
  );
};

export default MainLayout;
