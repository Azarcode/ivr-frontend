'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Package, CheckCircle2, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/shared/loading-state';
import { useAuth } from '@/providers/auth-provider';
import { useProducts } from '@/hooks/use-products';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { admin } = useAuth();

  // Fetch recent products (page 1, limit 5)
  const { data: recentProductsData, isLoading: isLoadingRecent } = useProducts({
    page: 1,
    limit: 5,
  });

  // Fetch count of active products
  const { data: activeProductsData, isLoading: isLoadingActive } = useProducts({
    isActive: true,
    limit: 1,
  });

  const totalProducts = recentProductsData?.meta.total ?? 0;
  const activeProducts = activeProductsData?.meta.total ?? 0;
  const recentProducts = recentProductsData?.data ?? [];

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome back, ${admin?.name || 'Admin'}`}
        description="Overview of your IVR product catalog and administrative operations"
        action={
          <Link href="/products/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </Link>
        }
      />

      {/* Real Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-neutral-200 bg-white p-5 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Products
            </span>
            <Package className="h-4 w-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-neutral-900">
            {isLoadingRecent ? '...' : totalProducts}
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Total items registered in the database catalog
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-5 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Active Products
            </span>
            <CheckCircle2 className="h-4 w-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-neutral-900">
            {isLoadingActive ? '...' : activeProducts}
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Products currently enabled for IVR routing and sales
          </p>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="border border-neutral-200 bg-white rounded-md">
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Recent Products
            </h2>
            <p className="text-xs text-neutral-500">
              Latest items added to the catalog
            </p>
          </div>
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {isLoadingRecent ? (
          <LoadingState message="Loading recent products..." className="py-8" />
        ) : recentProducts.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No products found. Use the &quot;Add Product&quot; button above to create one.
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
              >
                <div className="min-w-0 pr-4">
                  <div className="font-medium text-sm text-neutral-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                    <span>Added {formatDate(product.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-semibold text-sm text-neutral-900">
                    {formatCurrency(product.price)}
                  </span>
                  <Badge variant={product.isActive ? 'success' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Link href={`/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
