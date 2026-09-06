'use client';

import React from 'react';
import { DeliverabilityMetrics, BucketStats } from '@/types/subscriber';
import { Users, TrendingUp, ShieldAlert, DollarSign, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: DeliverabilityMetrics;
  stats: BucketStats;
  onOpenAiModal: () => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  stats,
  onOpenAiModal,
}) => {
  const { before, after } = metrics;

  const getSpamBadgeClass = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'border-rose-500/40 bg-rose-500/15 text-rose-400';
      case 'High':
        return 'border-amber-500/40 bg-amber-500/15 text-amber-400';
      case 'Medium':
        return 'border-yellow-500/40 bg-yellow-500/15 text-yellow-300';
      default:
        return 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Value Pitch */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/40 p-5 shadow-lg gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-md">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-white">List Health Diagnostics Ready</h3>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-300">
                {stats.total.toLocaleString()} Contacts Analyzed
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
              Suppressing <strong className="text-rose-400">{stats.inactiveCount} dead-weight contacts</strong> will boost projected open rate from <strong className="text-neutral-200">{before.projectedOpenRate}%</strong> to <strong className="text-emerald-400">{after.projectedOpenRate}%</strong> while securing domain deliverability.
            </p>
          </div>
        </div>

        {stats.atRiskCount > 0 && (
          <button
            onClick={onOpenAiModal}
            className="flex items-center space-x-2 shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-emerald-400 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Win-Back Campaign ({stats.atRiskCount} At-Risk)</span>
          </button>
        )}
      </div>

      {/* 4 Primary Key Performance Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: List Size Optimization */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clean List Size</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{after.listSize.toLocaleString()}</span>
            <span className="text-xs text-neutral-400 line-through">{before.listSize.toLocaleString()}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium">{stats.activeCount} Active + {stats.atRiskCount} At-Risk</span>
            <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-rose-400 font-mono font-bold">
              -{stats.inactivePct}% Removed
            </span>
          </div>
        </div>

        {/* Card 2: Open Rate Jump */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Projected Open Rate</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">{after.projectedOpenRate}%</span>
            <span className="text-xs text-neutral-400 line-through">{before.projectedOpenRate}%</span>
          </div>
          <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-emerald-400 font-bold">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{after.openRateBoostPct}% Open Rate Lift</span>
          </div>
        </div>

        {/* Card 3: Spam Risk Score */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Spam Risk Level</span>
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${getSpamBadgeClass(before.spamRiskLevel)}`}>
              Before: {before.spamRiskLevel}
            </span>
            <span className="text-xs text-neutral-400">&rarr;</span>
            <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400">
              Low
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Inbox Placement:</span>
            <span className="text-emerald-400 font-bold">{after.inboxPlacementPct}% Target</span>
          </div>
        </div>

        {/* Card 4: ESP Bill Savings */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-md">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">ESP Monthly Savings</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-400">${after.costSavingsMonthly}</span>
            <span className="text-xs text-neutral-400">/ mo</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Annual ESP Savings:</span>
            <span className="text-emerald-400 font-bold">${after.costSavingsMonthly * 12}/yr</span>
          </div>
        </div>
      </div>
    </div>
  );
};
