import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  businessApi,
  CreateBusinessInput,
  UpdateBusinessInput,
} from '@/features/business/api/business.api';
import { getApiErrorMessage } from '@/lib/api/axios';
import { queryKeys } from '@/lib/query-client';

export function useBusinessProfile() {
  return useQuery({
    queryKey: queryKeys.business.profile,
    queryFn: () => businessApi.getProfile(),
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBusinessInput) =>
      businessApi.createProfile(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.business.profile,
      });
      toast.success(`Business profile "${data.name}" created successfully`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBusinessInput) =>
      businessApi.updateProfile(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.business.profile,
      });
      toast.success(`Business profile "${data.name}" updated successfully`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
