import QueryProvider from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toast';
import { AppErrorBoundary } from '@/components/error-boundary/AppErrorBoundary';
import './globals.css';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <AppErrorBoundary>
              <Toaster>
                {children}
              </Toaster>
            </AppErrorBoundary>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
