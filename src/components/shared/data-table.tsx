import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  pagination?: PaginationProps;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  pagination,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="overflow-x-auto rounded-md border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50/75 text-xs uppercase text-neutral-600 font-semibold tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn('px-4 py-3', col.headerClassName)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-neutral-50/60 transition-colors"
              >
                {columns.map((col, idx) => (
                  <td key={idx} className={cn('px-4 py-3 text-sm text-neutral-800', col.className)}>
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-1 text-xs text-neutral-500">
          <div>
            Showing page <span className="font-semibold text-neutral-900">{pagination.page}</span> of{' '}
            <span className="font-semibold text-neutral-900">{pagination.totalPages}</span> ({pagination.total} total)
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.hasPreviousPage}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="h-8 gap-1 px-2.5 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="h-8 gap-1 px-2.5 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
