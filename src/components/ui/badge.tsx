import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium transition-colors border',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-900 text-white',
        secondary:
          'border-neutral-200 bg-neutral-100 text-neutral-800',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-800',
        danger:
          'border-red-200 bg-red-50 text-red-800',
        outline:
          'border-neutral-200 text-neutral-700 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
