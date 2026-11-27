'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/shared/form-field';
import { useRegisterMutation } from '@/hooks/use-auth';
import { Bot, Loader2 } from 'lucide-react';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { mutate: registerUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="w-full max-w-sm border border-neutral-200 bg-white p-8 rounded-md shadow-none">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-9 w-9 rounded bg-neutral-900 text-white flex items-center justify-center mb-3">
          <Bot className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
          Create Admin Account
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Set up administrative access for IVR management
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Full Name"
          htmlFor="name"
          error={errors.name?.message}
          required
        >
          <Input
            id="name"
            type="text"
            placeholder="Admin User"
            autoComplete="name"
            disabled={isPending}
            {...register('name')}
          />
        </FormField>

        <FormField
          label="Email address"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            disabled={isPending}
            {...register('email')}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          helperText="Must be at least 8 characters"
          required
        >
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...register('password')}
          />
        </FormField>

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-center text-xs text-neutral-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-neutral-900 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
