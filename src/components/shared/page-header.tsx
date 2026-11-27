import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 pb-6 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 mb-6',
        className,
      )}
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
