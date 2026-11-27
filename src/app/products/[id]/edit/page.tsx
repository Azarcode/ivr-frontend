'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { ProductForm } from '@/features/products/product-form';
import { useProduct } from '@/hooks/use-products';

export default function EditProductPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  const { data: product, isLoading, isError, refetch } = useProduct(id);

  return (
    <DashboardLayout>
      <PageHeader
        title="Edit Product"
        description="Modify existing product attributes, pricing, or availability"
        action={
          <Link href="/products">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <LoadingState message="Loading product information..." className="py-12" />
      ) : isError || !product ? (
        <ErrorState
          title="Product not found"
          message="Could not load the requested product from the database."
          onRetry={() => refetch()}
        />
      ) : (
        <ProductForm initialData={product} isEdit />
      )}
    </DashboardLayout>
  );
}
