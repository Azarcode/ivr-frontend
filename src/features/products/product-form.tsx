'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/shared/form-field';
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-products';
import { Product } from '@/lib/api/products.api';
import { Loader2 } from 'lucide-react';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name is too long'),
  description: z.string().optional(),
  price: z.number({ message: 'Price must be a valid number' }).positive('Price must be greater than 0'),
  isActive: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(
    initialData?.id ?? '',
  );

  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ? Number(initialData.price) : 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      price: data.price,
      isActive: data.isActive,
    };

    if (isEdit && initialData) {
      updateProduct(payload);
    } else {
      createProduct(payload);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl border border-neutral-200 bg-white p-6 rounded-md space-y-5"
    >
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-base font-semibold text-neutral-900">
          {isEdit ? 'Edit Product Details' : 'Product Information'}
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          {isEdit
            ? 'Update the product parameters and pricing'
            : 'Fill in the information to add a new product to the catalog'}
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Product Name"
          htmlFor="name"
          error={errors.name?.message}
          required
        >
          <Input
            id="name"
            placeholder="e.g. AI Customer Care Assistant"
            disabled={isSubmitting}
            {...register('name')}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          helperText="Optional detailed description of the product or service"
        >
          <Textarea
            id="description"
            placeholder="Describe features, capabilities, or pricing tier details..."
            rows={3}
            disabled={isSubmitting}
            {...register('description')}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Price (INR / ₹)"
            htmlFor="price"
            error={errors.price?.message}
            required
          >
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="99.99"
              disabled={isSubmitting}
              {...register('price', { valueAsNumber: true })}
            />
          </FormField>

          <div className="space-y-1.5 pt-4 sm:pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                disabled={isSubmitting}
                {...register('isActive')}
              />
              <span>Mark product as Active</span>
            </label>
            <p className="text-[11px] text-neutral-500 pl-6">
              Active products are visible and available for IVR call flows
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <Link href="/products">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Link>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? 'Saving changes...' : 'Creating product...'}
            </>
          ) : isEdit ? (
            'Save Changes'
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
}
