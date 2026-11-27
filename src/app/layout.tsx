import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'IVR Admin - AI Voice Management',
  description: 'Enterprise administration dashboard for AI-powered IVR systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white text-neutral-900">
      <body className="min-h-full flex flex-col bg-white">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              theme="light"
              richColors
              closeButton
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
