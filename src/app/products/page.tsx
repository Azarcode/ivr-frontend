'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { ProductList } from '@/features/products/product-list';

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Products"
        description="Manage product catalog, pricing (INR / ₹), and active states"
        action={
          <Link href="/products/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </Link>
        }
      />
      <ProductList />
    </DashboardLayout>
  );
}
