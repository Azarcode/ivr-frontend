import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';

interface PlaceholderViewProps {
  title: string;
  description: string;
}

export function PlaceholderView({ title, description }: PlaceholderViewProps) {
  return (
    <DashboardLayout>
      <PageHeader title={title} description={description} />
      <div className="rounded-md border border-dashed border-neutral-300 bg-white p-12 text-center">
        <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 mb-3">
          Coming Soon
        </span>
        <h2 className="text-base font-semibold text-neutral-900">
          {title} Module in Development
        </h2>
        <p className="mt-1 text-xs text-neutral-500 max-w-md mx-auto">
          This feature is scheduled for a future release of the AI-powered IVR platform.
          Please check back soon.
        </p>
      </div>
    </DashboardLayout>
  );
}
