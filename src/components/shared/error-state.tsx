import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-md border border-red-200 bg-red-50/50 p-8 text-center',
        className,
      )}
    >
      <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-xs text-neutral-600 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-4 bg-white hover:bg-neutral-50"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
