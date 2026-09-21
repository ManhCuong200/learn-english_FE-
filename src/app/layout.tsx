import QueryProvider from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toast';
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
            <Toaster>
              {children}
            </Toaster>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
