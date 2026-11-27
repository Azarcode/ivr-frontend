'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AudioWaveform,
  Bot,
  Building2,
  LayoutDashboard,
  Package,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Business Profile',
    href: '/dashboard/business',
    icon: Building2,
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
  },
  // {
  //   title: 'AI Voice Playground',
  //   href: '/dashboard/ai-voice',
  //   icon: AudioWaveform,
  // },
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-neutral-200 bg-white min-h-screen flex flex-col">
      {/* Brand Header */}
      <div className="h-14 border-b border-neutral-200 px-5 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded bg-neutral-900 text-white flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </div>
        <span className="font-semibold text-sm tracking-tight text-neutral-900">
          IVR Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-neutral-600">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'bg-neutral-100 font-semibold text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    'h-4 w-4',
                    isActive ? 'text-neutral-900' : 'text-neutral-500',
                  )}
                />
                <span>{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-neutral-200 text-[11px] text-neutral-600">
        AI-Powered IVR Platform v1.0
      </div>
    </aside>
  );
}
