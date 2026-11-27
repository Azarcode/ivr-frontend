'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { useBusinessProfile } from '@/features/business/hooks/use-business';
import { BusinessForm } from '@/features/business/components/business-form';
import { getApiErrorMessage } from '@/lib/api/axios';

export function BusinessProfilePage() {
  const { data, isLoading, isError, error, refetch } = useBusinessProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Business Profile"
          description="Manage company details and context for your AI conversational assistant"
        />
        <LoadingState message="Fetching business profile..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Business Profile"
          description="Manage company details and context for your AI conversational assistant"
        />
        <ErrorState
          title="Unable to load business profile"
          message={getApiErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Profile"
        description="Configure your core business identity, contact channels, and AI conversational strategy context"
      />
      <BusinessForm initialData={data} />
    </div>
  );
}
