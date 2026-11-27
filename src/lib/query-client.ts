import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { QueryProductsParams } from './api/products.api';

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export const queryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params?: QueryProductsParams) =>
      [...queryKeys.products.lists(), params ?? {}] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  business: {
    profile: ['business', 'profile'] as const,
  },
  usage: ['usage'] as const,
};
