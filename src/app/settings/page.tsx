'use client';

import React from 'react';
import { Bot, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingState } from '@/components/shared/loading-state';
import { ErrorState } from '@/components/shared/error-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUsage } from '@/hooks/use-usage';
import { UsageLimitCardData } from '@/lib/api/usage.api';

interface UsageCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  data: UsageLimitCardData;
}

function UsageCard({ title, icon: Icon, data }: UsageCardProps) {
  const { isConfigured, used, limit, remaining, percentage, unit, isExceeded } = data;

  return (
    <div className="border border-neutral-200 bg-white rounded-lg p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
              <p className="text-[11px] text-neutral-500 capitalize">{unit} tracking</p>
            </div>
          </div>
          {isConfigured ? (
            isExceeded ? (
              <Badge variant="danger">Limit Exceeded</Badge>
            ) : (
              <Badge variant="success">Active</Badge>
            )
          ) : (
            <Badge variant="secondary">Unconfigured</Badge>
          )}
        </div>

        {/* Card Body */}
        {isConfigured && limit !== null && remaining !== null && percentage !== null ? (
          <div className="mt-5 space-y-5">
            {/* Prominent Remaining Banner */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-md p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Remaining Quota
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-neutral-900">
                  {remaining.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  {unit} available
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="border border-neutral-100 bg-white p-3 rounded-md">
                <span className="text-[11px] text-neutral-500 block">Used</span>
                <span className="text-lg font-semibold text-neutral-900 mt-0.5 block">
                  {used.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-neutral-500">{unit}</span>
                </span>
              </div>

              <div className="border border-neutral-100 bg-white p-3 rounded-md">
                <span className="text-[11px] text-neutral-500 block">Total Limit</span>
                <span className="text-lg font-semibold text-neutral-900 mt-0.5 block">
                  {limit.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-neutral-500">{unit}</span>
                </span>
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-neutral-700">Usage Progress</span>
                <span className="font-semibold text-neutral-900">{percentage}%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    percentage >= 95
                      ? 'bg-red-500'
                      : percentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-neutral-900'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>0 {unit}</span>
                <span>
                  {used} of {limit} {unit} ({percentage}%)
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Unconfigured State */
          <div className="mt-5 p-6 rounded-md border border-dashed border-neutral-200 bg-neutral-50/50 text-center">
            <AlertCircle className="h-5 w-5 text-neutral-400 mx-auto mb-2" />
            <h3 className="text-xs font-semibold text-neutral-800">
              Limit Not Configured
            </h3>
            <p className="mt-1 text-[11px] text-neutral-500 max-w-xs mx-auto">
              No ceiling has been defined in the backend environment. Usage is currently
              unrestricted.
            </p>
            <div className="mt-4 pt-3 border-t border-neutral-200/60 flex justify-around text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Current Used
                </span>
                <span className="font-semibold text-neutral-900">
                  {used} {unit}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">
                  Ceiling
                </span>
                <span className="font-semibold text-neutral-900">Unlimited</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useUsage();

  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Monitor resource consumption and usage limits in real time"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
            />
            <span>Refresh</span>
          </Button>
        }
      />

      <div className="mt-6">
        {isLoading ? (
          <LoadingState message="Fetching real-time usage data..." />
        ) : isError || !data ? (
          <ErrorState
            title="Unable to load usage data"
            message={
              error instanceof Error
                ? error.message
                : 'Failed to connect to the usage limits service.'
            }
            onRetry={() => refetch()}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: AI Usage */}
            <UsageCard title="AI Usage" icon={Bot} data={data.ai} />

            {/* Card 2: Plivo Usage */}
            <UsageCard title="Plivo Usage" icon={Phone} data={data.plivo} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
