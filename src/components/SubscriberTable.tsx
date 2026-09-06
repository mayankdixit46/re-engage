'use client';

import React, { useState, useMemo } from 'react';
import { Subscriber, BucketType } from '@/types/subscriber';
import { Search, Filter, CheckCircle2, AlertTriangle, UserX, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface SubscriberTableProps {
  subscribers: Subscriber[];
  onOverrideBucket: (subscriberId: string, newBucket: BucketType) => void;
}

export const SubscriberTable: React.FC<SubscriberTableProps> = ({
  subscribers,
  onOverrideBucket,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'at-risk' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const effectiveBucket = sub.manualOverrideBucket || sub.bucket;

      if (activeTab !== 'all' && effectiveBucket !== activeTab) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesEmail = sub.email.toLowerCase().includes(query);
        const matchesName = sub.firstName?.toLowerCase().includes(query) || sub.lastName?.toLowerCase().includes(query);
        if (!matchesEmail && !matchesName) return false;
      }

      return true;
    });
  }, [subscribers, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredSubscribers.length / pageSize) || 1;
  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubscribers.slice(start, start + pageSize);
  }, [filteredSubscribers, currentPage]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getBucketBadge = (bucket: BucketType) => {
    switch (bucket) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Active</span>
          </span>
        );
      case 'at-risk':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>At-Risk</span>
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
            <UserX className="h-3 w-3" />
            <span>Inactive</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-xl space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        {/* Tab Filters */}
        <div className="flex items-center space-x-1 rounded-xl bg-neutral-950 p-1 border border-neutral-800">
          <button
            onClick={() => handleTabChange('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All ({subscribers.length})
          </button>
          <button
            onClick={() => handleTabChange('active')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                : 'text-neutral-400 hover:text-emerald-400'
            }`}
          >
            Active (Keep)
          </button>
          <button
            onClick={() => handleTabChange('at-risk')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'at-risk'
                ? 'bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30'
                : 'text-neutral-400 hover:text-amber-400'
            }`}
          >
            At-Risk (Win Back)
          </button>
          <button
            onClick={() => handleTabChange('inactive')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'inactive'
                ? 'bg-rose-500/20 text-rose-300 shadow-sm border border-rose-500/30'
                : 'text-neutral-400 hover:text-rose-400'
            }`}
          >
            Inactive (Sunset)
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search subscriber email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-mono text-[10px]">
            <tr>
              <th className="px-4 py-3 rounded-l-xl">Subscriber Email</th>
              <th className="px-4 py-3">Engagement Score</th>
              <th className="px-4 py-3">Last Activity</th>
              <th className="px-4 py-3">Opens / Clicks</th>
              <th className="px-4 py-3">Health Status</th>
              <th className="px-4 py-3 text-right rounded-r-xl">Override Bucket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {paginatedSubscribers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-400">
                  No subscribers match your search criteria or tab filter.
                </td>
              </tr>
            ) : (
              paginatedSubscribers.map((sub) => {
                const effectiveBucket = sub.manualOverrideBucket || sub.bucket;
                return (
                  <tr key={sub.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-200">
                      <div>
                        <span>{sub.email}</span>
                        {(sub.firstName || sub.lastName) && (
                          <span className="block text-[11px] text-neutral-400 font-normal">
                            {sub.firstName} {sub.lastName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-1.5 w-16 rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.engagementScore >= 60
                                ? 'bg-emerald-400'
                                : sub.engagementScore >= 30
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${sub.engagementScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-neutral-300 font-semibold">
                          {sub.engagementScore}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-neutral-400 font-mono">
                      {sub.daysSinceLastActivity !== null ? (
                        <span>{sub.daysSinceLastActivity} days ago</span>
                      ) : (
                        <span className="text-rose-400/80">Never</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-neutral-300 font-mono">
                      <span>{sub.openCount} opens / {sub.clickCount} clicks</span>
                    </td>

                    <td className="px-4 py-3">{getBucketBadge(effectiveBucket)}</td>

                    <td className="px-4 py-3 text-right">
                      <select
                        value={effectiveBucket}
                        onChange={(e) => onOverrideBucket(sub.id, e.target.value as BucketType)}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-300 focus:border-emerald-500 focus:outline-none cursor-pointer"
                      >
                        <option value="active">Move to Active</option>
                        <option value="at-risk">Move to At-Risk</option>
                        <option value="inactive">Move to Inactive</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-400">
        <span>
          Showing {filteredSubscribers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
        </span>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center space-x-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1 disabled:opacity-40 hover:bg-neutral-800"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
          <span className="font-mono text-neutral-300">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center space-x-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1 disabled:opacity-40 hover:bg-neutral-800"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
