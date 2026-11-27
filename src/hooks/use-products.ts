import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  CreateProductPayload,
  productsApi,
  QueryProductsParams,
  UpdateProductPayload,
} from '@/lib/api/products.api';
import { getApiErrorMessage } from '@/lib/api/axios';
import { queryKeys } from '@/lib/query-client';

export function useProducts(params?: QueryProductsParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.createProduct(payload),
    onSuccess: (newProduct) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success(`Product "${newProduct.name}" created successfully`);
      router.push('/products');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: UpdateProductPayload) => productsApi.updateProduct(id, payload),
    onSuccess: (updatedProduct) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      toast.success(`Product "${updatedProduct.name}" updated successfully`);
      router.push('/products');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
