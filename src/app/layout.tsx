import QueryProvider from '@/providers/QueryProvider';
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
          <Toaster>
            {children}
          </Toaster>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
