'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/shared/form-field';
import {
  businessSchema,
  BusinessFormValues,
} from '@/features/business/schemas/business.schema';
import {
  useCreateBusiness,
  useUpdateBusiness,
} from '@/features/business/hooks/use-business';
import { BusinessProfile } from '@/features/business/api/business.api';

interface BusinessFormProps {
  initialData?: BusinessProfile | null;
}

export function BusinessForm({ initialData }: BusinessFormProps) {
  const isExisting = Boolean(initialData && initialData.id);
  const { mutate: createBusiness, isPending: isCreating } = useCreateBusiness();
  const { mutate: updateBusiness, isPending: isUpdating } = useUpdateBusiness();

  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      category: initialData?.category ?? '',
      description: initialData?.description ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      website: initialData?.website ?? '',
      address: initialData?.address ?? '',
      city: initialData?.city ?? '',
      state: initialData?.state ?? '',
      country: initialData?.country ?? '',
      businessHours: initialData?.businessHours ?? '',
      strategyDescription: initialData?.strategyDescription ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name ?? '',
        category: initialData.category ?? '',
        description: initialData.description ?? '',
        phone: initialData.phone ?? '',
        email: initialData.email ?? '',
        website: initialData.website ?? '',
        address: initialData.address ?? '',
        city: initialData.city ?? '',
        state: initialData.state ?? '',
        country: initialData.country ?? '',
        businessHours: initialData.businessHours ?? '',
        strategyDescription: initialData.strategyDescription ?? '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (values: BusinessFormValues) => {
    const payload = {
      name: values.name.trim(),
      category: values.category?.trim() || null,
      description: values.description?.trim() || null,
      phone: values.phone?.trim() || null,
      email: values.email?.trim() || null,
      website: values.website?.trim() || null,
      address: values.address?.trim() || null,
      city: values.city?.trim() || null,
      state: values.state?.trim() || null,
      country: values.country?.trim() || null,
      businessHours: values.businessHours?.trim() || null,
      strategyDescription: values.strategyDescription?.trim() || null,
    };

    if (isExisting) {
      updateBusiness(payload);
    } else {
      createBusiness(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Section 1: Basic Business Information */}
      <div className="border border-neutral-200 rounded-md p-6 bg-white space-y-6">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Basic Business Information
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            General company details, contact channels, and operational hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Business Name"
            htmlFor="name"
            required
            error={errors.name?.message}
            className="md:col-span-2"
          >
            <Input
              id="name"
              placeholder="e.g. Apex AI Solutions"
              disabled={isSubmitting}
              {...register('name')}
            />
          </FormField>

          <FormField
            label="Business Category"
            htmlFor="category"
            error={errors.category?.message}
          >
            <Input
              id="category"
              placeholder="e.g. Telecommunications & Software"
              disabled={isSubmitting}
              {...register('category')}
            />
          </FormField>

          <FormField
            label="Contact Phone"
            htmlFor="phone"
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              placeholder="e.g. +1 (555) 019-2834"
              disabled={isSubmitting}
              {...register('phone')}
            />
          </FormField>

          <FormField
            label="Contact Email"
            htmlFor="email"
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              placeholder="e.g. contact@apexai.com"
              disabled={isSubmitting}
              {...register('email')}
            />
          </FormField>

          <FormField
            label="Website"
            htmlFor="website"
            error={errors.website?.message}
            helperText="Include http:// or https://"
          >
            <Input
              id="website"
              placeholder="https://apexai.com"
              disabled={isSubmitting}
              {...register('website')}
            />
          </FormField>

          <FormField
            label="Business Description"
            htmlFor="description"
            error={errors.description?.message}
            className="md:col-span-2"
          >
            <Textarea
              id="description"
              placeholder="Brief description of your business and products..."
              className="min-h-[80px]"
              disabled={isSubmitting}
              {...register('description')}
            />
          </FormField>

          <FormField
            label="Address"
            htmlFor="address"
            error={errors.address?.message}
            className="md:col-span-2"
          >
            <Input
              id="address"
              placeholder="e.g. 100 Innovation Way, Suite 400"
              disabled={isSubmitting}
              {...register('address')}
            />
          </FormField>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="City" htmlFor="city" error={errors.city?.message}>
              <Input
                id="city"
                placeholder="San Francisco"
                disabled={isSubmitting}
                {...register('city')}
              />
            </FormField>

            <FormField
              label="State / Province"
              htmlFor="state"
              error={errors.state?.message}
            >
              <Input
                id="state"
                placeholder="CA"
                disabled={isSubmitting}
                {...register('state')}
              />
            </FormField>

            <FormField
              label="Country"
              htmlFor="country"
              error={errors.country?.message}
            >
              <Input
                id="country"
                placeholder="United States"
                disabled={isSubmitting}
                {...register('country')}
              />
            </FormField>
          </div>

          <FormField
            label="Business Hours"
            htmlFor="businessHours"
            error={errors.businessHours?.message}
            className="md:col-span-2"
          >
            <Input
              id="businessHours"
              placeholder="e.g. Mon-Fri 8:00 AM - 6:00 PM PST"
              disabled={isSubmitting}
              {...register('businessHours')}
            />
          </FormField>
        </div>
      </div>

      {/* Section 2: Business Strategy & Context */}
      <div className="border border-neutral-200 rounded-md p-6 bg-white space-y-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Business Strategy & Context
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Foundational knowledge and behavior guidelines for your AI assistant
          </p>
        </div>

        <FormField
          label="Business Strategy & Context"
          htmlFor="strategyDescription"
          error={errors.strategyDescription?.message}
          helperText="This information will be used by your AI assistant to understand your business and respond to customer questions appropriately."
        >
          <Textarea
            id="strategyDescription"
            rows={7}
            placeholder="Describe your business, target customers, main services, business goals, customer support approach, important policies and how you want your AI assistant to represent your business."
            className="min-h-[160px] text-sm leading-relaxed"
            disabled={isSubmitting}
            {...register('strategyDescription')}
          />
        </FormField>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[180px]"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isExisting ? 'Save Changes' : 'Create Business Profile'}
        </Button>
      </div>
    </form>
  );
}
