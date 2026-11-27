'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AiVoicePage } from '@/features/ai-voice/components/AiVoicePage';

export default function AiVoiceDashboardPage() {
  return (
    <DashboardLayout>
      <AiVoicePage />
    </DashboardLayout>
  );
}
