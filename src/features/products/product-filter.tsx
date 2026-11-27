'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductFilterProps {
  initialSearch?: string;
  initialIsActive?: boolean;
  onFilterChange: (filters: { search?: string; isActive?: boolean }) => void;
}

export function ProductFilter({
  initialSearch = '',
  initialIsActive,
  onFilterChange,
}: ProductFilterProps) {
  const [search, setSearch] = useState(initialSearch);
  const [isActive, setIsActive] = useState<string>(
    initialIsActive === undefined
      ? 'all'
      : initialIsActive
      ? 'true'
      : 'false',
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerChange(search, isActive);
  };

  const handleStatusChange = (newStatus: string) => {
    setIsActive(newStatus);
    triggerChange(search, newStatus);
  };

  const triggerChange = (currentSearch: string, currentStatus: string) => {
    const activeBool =
      currentStatus === 'true'
        ? true
        : currentStatus === 'false'
        ? false
        : undefined;

    onFilterChange({
      search: currentSearch.trim() || undefined,
      isActive: activeBool,
    });
  };

  const handleReset = () => {
    setSearch('');
    setIsActive('all');
    onFilterChange({ search: undefined, isActive: undefined });
  };

  const hasFilters = search.length > 0 || isActive !== 'all';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
        <Input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 text-xs h-9"
        />
      </form>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1 border border-neutral-200 rounded-md p-1 bg-white text-xs">
          <button
            type="button"
            onClick={() => handleStatusChange('all')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              isActive === 'all'
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('true')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              isActive === 'true'
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange('false')}
            className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
              isActive === 'false'
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            Inactive
          </button>
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-9 px-2 text-xs text-neutral-500 hover:text-neutral-900"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
