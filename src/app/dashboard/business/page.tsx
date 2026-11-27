'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { BusinessProfilePage } from '@/features/business/components/business-profile-page';

export default function BusinessDashboardPage() {
  return (
    <DashboardLayout>
      <BusinessProfilePage />
    </DashboardLayout>
  );
}
