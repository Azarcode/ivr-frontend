import { apiClient } from '@/lib/api/axios';

export interface BusinessProfile {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  businessHours: string | null;
  strategyDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessInput {
  name: string;
  category?: string | null;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  businessHours?: string | null;
  strategyDescription?: string | null;
}

export type UpdateBusinessInput = Partial<CreateBusinessInput>;

export const businessApi = {
  getProfile: async (): Promise<BusinessProfile | null> => {
    const { data } = await apiClient.get<BusinessProfile | null | ''>(
      '/business',
    );
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      return null;
    }
    return data as BusinessProfile;
  },

  createProfile: async (
    payload: CreateBusinessInput,
  ): Promise<BusinessProfile> => {
    const { data } = await apiClient.post<BusinessProfile>('/business', payload);
    return data;
  },

  updateProfile: async (
    payload: UpdateBusinessInput,
  ): Promise<BusinessProfile> => {
    const { data } = await apiClient.patch<BusinessProfile>(
      '/business',
      payload,
    );
    return data;
  },
};
