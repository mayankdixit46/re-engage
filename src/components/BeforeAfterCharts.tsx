'use client';

import React from 'react';
import { DeliverabilityMetrics, BucketStats } from '@/types/subscriber';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, ShieldCheck } from 'lucide-react';

interface BeforeAfterChartsProps {
  metrics: DeliverabilityMetrics;
  stats: BucketStats;
}

export const BeforeAfterCharts: React.FC<BeforeAfterChartsProps> = ({ metrics, stats }) => {
  const { before, after } = metrics;

  // Comparison Bar Chart Data
  const comparisonData = [
    {
      metric: 'List Size (Contacts)',
      Before: before.listSize,
      After: after.listSize,
    },
    {
      metric: 'Open Rate (%)',
      Before: before.projectedOpenRate,
      After: after.projectedOpenRate,
    },
    {
      metric: 'Inbox Placement (%)',
      Before: before.inboxPlacementPct,
      After: after.inboxPlacementPct,
    },
  ];

  // Bucket Pie Chart Data
  const pieData = [
    { name: 'Active (Keep)', value: stats.activeCount, color: '#10b981' },
    { name: 'At-Risk (Win-Back)', value: stats.atRiskCount, color: '#f59e0b' },
    { name: 'Inactive (Sunset)', value: stats.inactiveCount, color: '#ef4444' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Recharts Before vs After Impact Bar Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-neutral-100">Deliverability Transformation (Before vs. After)</h4>
          </div>
          <span className="text-[11px] font-medium text-emerald-400">
            +{after.openRateBoostPct}% Open Boost
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="metric" stroke="#737373" fontSize={12} tickLine={false} />
              <YAxis stroke="#737373" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  borderColor: '#404040',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="Before" fill="#525252" radius={[6, 6, 0, 0]} name="Before Cleanup" />
              <Bar dataKey="After" fill="#10b981" radius={[6, 6, 0, 0]} name="After Re-Engage" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center space-x-6 text-xs text-neutral-400 pt-1">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-sm bg-neutral-600"></span>
            <span>Before Cleanup (Raw List)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-sm bg-emerald-500"></span>
            <span>After Cleanup (Healthiest Segments)</span>
          </div>
        </div>
      </div>

      {/* Right: Subscriber Distribution Breakdown */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <PieIcon className="h-4 w-4 text-amber-400" />
            <h4 className="text-sm font-bold text-neutral-100">List Health Segmentation</h4>
          </div>
          <span className="text-[11px] text-neutral-400">3 Buckets</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#171717" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  borderColor: '#404040',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 pt-1 text-xs">
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-medium">Active (Keep)</span>
            </div>
            <span className="font-mono font-bold">{stats.activeCount} ({stats.activePct}%)</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-amber-300">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="font-medium">At-Risk (Win-Back)</span>
            </div>
            <span className="font-mono font-bold">{stats.atRiskCount} ({stats.atRiskPct}%)</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-rose-300">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span>
              <span className="font-medium">Inactive (Sunset)</span>
            </div>
            <span className="font-mono font-bold">{stats.inactiveCount} ({stats.inactivePct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
