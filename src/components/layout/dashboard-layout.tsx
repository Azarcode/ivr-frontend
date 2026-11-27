'use client';

import React from 'react';
import { AuthGuard } from './auth-guard';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-white text-neutral-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 p-6 w-full max-w-7xl mx-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
