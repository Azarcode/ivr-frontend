import { apiClient } from '@/lib/api/axios';

export interface UsageLimitCardData {
  used: number;
  limit: number | null;
  remaining: number | null;
  percentage: number | null;
  unit: string;
  isConfigured: boolean;
  isExceeded: boolean;
}

export interface UsageResponse {
  ai: UsageLimitCardData;
  plivo: UsageLimitCardData;
}

export const usageApi = {
  getUsage: async (): Promise<UsageResponse> => {
    try {
      const response = await apiClient.get<
        { success?: boolean; data?: UsageResponse; ai?: UsageLimitCardData; plivo?: UsageLimitCardData } | UsageResponse
      >('/usage');

      const body = response.data;
      if (body && typeof body === 'object') {
        if ('data' in body && body.data && 'ai' in body.data && 'plivo' in body.data) {
          return body.data as UsageResponse;
        }
        if ('ai' in body && 'plivo' in body && body.ai && body.plivo) {
          return body as UsageResponse;
        }
      }
      throw new Error('Unexpected usage response structure');
    } catch {
      // Direct fetch fallback in case Axios interceptors encounter issues
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const fallbackUrl = `${baseUrl.replace(/\/+$/, '')}/usage`;

      const res = await fetch(fallbackUrl, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Usage service returned status HTTP ${res.status}`);
      }

      const body = await res.json();
      if (body?.data?.ai && body?.data?.plivo) {
        return body.data as UsageResponse;
      }
      if (body?.ai && body?.plivo) {
        return body as UsageResponse;
      }

      throw new Error('Invalid usage data payload');
    }
  },
};
