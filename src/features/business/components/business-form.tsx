'use client';

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/shared/form-field';
import { cn } from '@/lib/utils';
import {
  businessSchema,
  BusinessFormValues,
  STRATEGY_CONTEXT_MAX_LENGTH,
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
    control,
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

  const strategyValue =
    useWatch({
      control,
      name: 'strategyDescription',
    }) ?? '';
  const strategyLength = strategyValue.length;
  const strategyRemaining = STRATEGY_CONTEXT_MAX_LENGTH - strategyLength;
  const strategyUsagePct = Math.min(
    100,
    Math.round((strategyLength / STRATEGY_CONTEXT_MAX_LENGTH) * 100),
  );
  const isApproachingStrategyLimit =
    strategyLength >= STRATEGY_CONTEXT_MAX_LENGTH * 0.9 &&
    strategyLength < STRATEGY_CONTEXT_MAX_LENGTH;
  const isAtStrategyLimit = strategyLength === STRATEGY_CONTEXT_MAX_LENGTH;
  const isOverStrategyLimit = strategyLength > STRATEGY_CONTEXT_MAX_LENGTH;

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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 rounded-md bg-neutral-100 p-1.5 text-neutral-700 shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <label
                htmlFor="strategyDescription"
                className="block text-base font-semibold text-neutral-900 cursor-pointer"
              >
                Business Strategy &amp; Context
              </label>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Provide detailed information about your business, services, pricing,
                policies, target customers, FAQs, sales approach, and instructions
                that will help your AI agent handle conversations accurately.
              </p>
            </div>
          </div>

          <div
            aria-live="polite"
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium tabular-nums border transition-colors self-start shrink-0',
              isOverStrategyLimit || errors.strategyDescription
                ? 'bg-red-50 text-red-700 border-red-200'
                : isAtStrategyLimit
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : isApproachingStrategyLimit
                    ? 'bg-amber-50/70 text-amber-700 border-amber-200'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200',
            )}
          >
            {strategyLength.toLocaleString()} /{' '}
            {STRATEGY_CONTEXT_MAX_LENGTH.toLocaleString()}
          </div>
        </div>

        <div className="space-y-2.5">
          <Textarea
            id="strategyDescription"
            rows={12}
            placeholder="Enter business overview, product/service details, pricing rules, FAQs, tone guidelines, escalation instructions, and anything the AI receptionist should know..."
            className={cn(
              'min-h-[280px] max-h-[520px] resize-y overflow-y-auto px-3.5 py-3 text-sm leading-6 transition-colors',
              (isOverStrategyLimit || errors.strategyDescription) &&
                'border-red-400 focus-visible:ring-red-600 focus-visible:border-red-600',
              !isOverStrategyLimit &&
                !errors.strategyDescription &&
                (isApproachingStrategyLimit || isAtStrategyLimit) &&
                'border-amber-300 focus-visible:ring-amber-500 focus-visible:border-amber-500',
            )}
            disabled={isSubmitting}
            {...register('strategyDescription')}
          />

          {/* Subtle progress bar */}
          <div className="h-1 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-150',
                isOverStrategyLimit || errors.strategyDescription
                  ? 'bg-red-600'
                  : isApproachingStrategyLimit || isAtStrategyLimit
                    ? 'bg-amber-500'
                    : 'bg-neutral-800',
              )}
              style={{ width: `${strategyUsagePct}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs">
            {errors.strategyDescription?.message || isOverStrategyLimit ? (
              <p className="inline-flex items-center gap-1.5 text-red-600 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {errors.strategyDescription?.message ||
                    `Character limit exceeded by ${Math.abs(strategyRemaining).toLocaleString()} characters. Please keep it within 20,000 characters.`}
                </span>
              </p>
            ) : isAtStrategyLimit ? (
              <p className="inline-flex items-center gap-1.5 text-amber-800 font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Character limit reached (20,000 / 20,000). Remove characters to add more text.
                </span>
              </p>
            ) : isApproachingStrategyLimit ? (
              <p className="text-amber-700">
                Approaching the 20,000 character limit ({strategyRemaining.toLocaleString()} remaining).
              </p>
            ) : (
              <p className="text-neutral-500">
                Supports detailed multi-section context, product guides, and pasted FAQs.
              </p>
            )}

            <span
              className={cn(
                'tabular-nums shrink-0',
                isOverStrategyLimit
                  ? 'text-red-600 font-medium'
                  : isApproachingStrategyLimit || isAtStrategyLimit
                    ? 'text-amber-700 font-medium'
                    : 'text-neutral-400',
              )}
            >
              {isOverStrategyLimit
                ? `${Math.abs(strategyRemaining).toLocaleString()} over limit`
                : `${strategyRemaining.toLocaleString()} remaining`}
            </span>
          </div>
        </div>
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
