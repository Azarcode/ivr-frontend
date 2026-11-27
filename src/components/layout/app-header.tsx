'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/auth-provider';

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Overview';
  if (pathname === '/dashboard/business') return 'Business Profile';
  if (pathname === '/dashboard/ai-voice') return 'AI Voice Playground';
  if (pathname === '/products') return 'Products';
  if (pathname === '/products/new') return 'New Product';
  if (pathname.startsWith('/products/') && pathname.endsWith('/edit'))
    return 'Edit Product';
  if (pathname === '/settings') return 'Settings';
  return 'Admin Dashboard';
}

export function AppHeader() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const title = getPageTitle(pathname);

  return (
    <header className="h-14 border-b border-neutral-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-neutral-500">IVR Admin</span>
        <span className="text-neutral-300">/</span>
        <span className="text-sm font-semibold text-neutral-900">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs text-neutral-800 hover:bg-neutral-50 focus:outline-none cursor-pointer transition-colors">
            <div className="h-5 w-5 rounded bg-neutral-200 text-neutral-700 flex items-center justify-center font-medium text-[10px]">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : <User className="h-3 w-3" />}
            </div>
            <span className="font-medium max-w-[120px] truncate text-left">
              {admin?.name || 'Administrator'}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-neutral-900">
                  {admin?.name}
                </p>
                <p className="text-[11px] leading-none text-neutral-500">
                  {admin?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 gap-2 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
