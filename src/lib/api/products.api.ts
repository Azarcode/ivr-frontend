import { apiClient } from './axios';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  sku: string | null;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsListResponse {
  data: Product[];
  meta: ProductsPaginationMeta;
}

export interface QueryProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stock?: number;
  isActive?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
  isActive?: boolean;
}

export const productsApi = {
  getProducts: async (params?: QueryProductsParams): Promise<ProductsListResponse> => {
    const response = await apiClient.get<ProductsListResponse>('/products', {
      params,
    });
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', payload);
    return response.data;
  },

  updateProduct: async (id: string, payload: UpdateProductPayload): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, payload);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<Product> => {
    const response = await apiClient.delete<Product>(`/products/${id}`);
    return response.data;
  },
};
