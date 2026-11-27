import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5 text-left', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className={cn(error && 'text-red-600')}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      </div>
      {children}
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
}
