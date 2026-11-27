import { useQuery } from '@tanstack/react-query';
import { usageApi } from '@/lib/api/usage.api';
import { queryKeys } from '@/lib/query-client';

export function useUsage() {
  return useQuery({
    queryKey: queryKeys.usage,
    queryFn: () => usageApi.getUsage(),
    refetchInterval: 10000,
  });
}
