'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/features/products/product-form';

export default function NewProductPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Create Product"
        description="Add a new product offering to the IVR voice catalog"
        action={
          <Link href="/products">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
          </Link>
        }
      />
      <ProductForm />
    </DashboardLayout>
  );
}
