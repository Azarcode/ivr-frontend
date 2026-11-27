import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center text-neutral-500',
        className,
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-neutral-600 mb-2" />
      <p className="text-xs font-medium text-neutral-600">{message}</p>
    </div>
  );
}
