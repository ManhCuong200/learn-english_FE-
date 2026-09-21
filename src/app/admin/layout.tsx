'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AdminAuthProvider } from '@/providers/AdminAuthProvider';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { useAdminAuthContext } from '@/providers/AdminAuthProvider';

const AdminLayoutInner = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, router]);

  return (
    <AdminProtectedRoute
      isAuthenticated={isAuthenticated}
      loadingText="Checking admin access..."
    >
      {children}
    </AdminProtectedRoute>
  );
};

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
};

export default AdminLayout;
