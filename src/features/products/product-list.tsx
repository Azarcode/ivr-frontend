'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, Column } from '@/components/shared/data-table';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { LoadingState } from '@/components/shared/loading-state';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ProductFilter } from './product-filter';
import { useProducts, useDeleteProduct } from '@/hooks/use-products';
import { Product } from '@/lib/api/products.api';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ProductList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | undefined>();
  const [isActive, setIsActive] = useState<boolean | undefined>();

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useProducts({
    page,
    limit: 10,
    search,
    isActive,
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleFilterChange = (filters: { search?: string; isActive?: boolean }) => {
    setSearch(filters.search);
    setIsActive(filters.isActive);
    setPage(1);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id, {
      onSuccess: () => {
        setProductToDelete(null);
      },
    });
  };

  const columns: Column<Product>[] = [
    {
      header: 'Product Name',
      cell: (product) => (
        <div>
          <div className="font-semibold text-neutral-900">{product.name}</div>
          {product.description && (
            <p className="text-xs text-neutral-500 line-clamp-1">
              {product.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Price',
      cell: (product) => (
        <span className="font-medium text-neutral-900">
          {formatCurrency(product.price)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (product) => (
        <Badge variant={product.isActive ? 'success' : 'secondary'}>
          {product.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Created',
      cell: (product) => (
        <span className="text-xs text-neutral-500">
          {formatDate(product.createdAt)}
        </span>
      ),
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (product) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/products/${product.id}/edit`}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-500 hover:text-neutral-900"
              title="Edit product"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setProductToDelete(product)}
            className="h-8 w-8 text-neutral-500 hover:text-red-600"
            title="Delete product"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <ProductFilter
        initialSearch={search}
        initialIsActive={isActive}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <LoadingState message="Loading products..." className="my-8" />
      ) : isError ? (
        <ErrorState
          title="Could not load products"
          message="Failed to fetch products from backend API."
          onRetry={() => refetch()}
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title={search || isActive !== undefined ? 'No matching products' : 'No products found'}
          description={
            search || isActive !== undefined
              ? 'Try modifying your search query or status filter.'
              : 'Get started by creating your first product.'
          }
          actionLabel={search || isActive !== undefined ? undefined : 'Add Product'}
          onAction={() => router.push('/products/new')}
        />
      ) : (
        <DataTable
          columns={columns}
          data={data.data}
          keyExtractor={(item) => item.id}
          pagination={{
            page: data.meta.page,
            totalPages: data.meta.totalPages,
            total: data.meta.total,
            hasNextPage: data.meta.hasNextPage,
            hasPreviousPage: data.meta.hasPreviousPage,
            onPageChange: (newPage) => setPage(newPage),
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
