'use client';

import React from 'react';
import { Subscriber, DeliverabilityMetrics, BucketStats } from '@/types/subscriber';
import { Download, ShieldCheck, UserX, FileText, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import confetti from 'canvas-confetti';

interface ExportActionsProps {
  subscribers: Subscriber[];
  metrics: DeliverabilityMetrics;
  stats: BucketStats;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  subscribers,
  metrics,
  stats,
}) => {

  const downloadCleanedCSV = () => {
    const cleaned = subscribers.filter((s) => {
      const b = s.manualOverrideBucket || s.bucket;
      return b === 'active' || b === 'at-risk';
    });

    const exportRows = cleaned.map((s) => ({
      Email: s.email,
      'First Name': s.firstName || '',
      'Last Name': s.lastName || '',
      'Engagement Status': (s.manualOverrideBucket || s.bucket).toUpperCase(),
      'Engagement Score': s.engagementScore,
      'Days Inactive': s.daysSinceLastActivity ?? 'Never',
      'Original Signup': s.signupDate || '',
      'Last Opened': s.lastOpenedDate || '',
    }));

    const csv = Papa.unparse(exportRows);
    triggerDownload(csv, `cleaned_active_at_risk_subscribers_${Date.now()}.csv`);
    triggerConfetti();
  };

  const downloadSunsetCSV = () => {
    const inactive = subscribers.filter((s) => {
      const b = s.manualOverrideBucket || s.bucket;
      return b === 'inactive';
    });

    const exportRows = inactive.map((s) => ({
      Email: s.email,
      'First Name': s.firstName || '',
      'Last Name': s.lastName || '',
      'Suppression Reason': 'Inactive > 180 Days / Zero Engagement',
      'Original Signup': s.signupDate || '',
      'Last Opened': s.lastOpenedDate || 'Never',
    }));

    const csv = Papa.unparse(exportRows);
    triggerDownload(csv, `sunset_inactive_suppress_list_${Date.now()}.csv`);
  };

  const downloadAuditReport = () => {
    const reportText = `=====================================================
RE-ENGAGE DELIVERABILITY AUDIT EXECUTIVE REPORT
=====================================================
Date Generated: ${new Date().toLocaleString()}

1. LIST OVERVIEW
- Raw List Total: ${stats.total} contacts
- Active Contacts (Keep): ${stats.activeCount} (${stats.activePct}%)
- At-Risk Contacts (Win Back): ${stats.atRiskCount} (${stats.atRiskPct}%)
- Inactive Contacts (Sunset): ${stats.inactiveCount} (${stats.inactivePct}%)

2. DELIVERABILITY IMPACT PREDICTIONS
- Cleaned List Size: ${metrics.after.listSize} contacts
- Projected Open Rate Before: ${metrics.before.projectedOpenRate}%
- Projected Open Rate After: ${metrics.after.projectedOpenRate}% (+${metrics.after.openRateBoostPct}% Boost)
- Baseline Spam Risk Level: ${metrics.before.spamRiskLevel}
- Optimized Spam Risk Level: ${metrics.after.spamRiskLevel}
- Projected Target Inbox Placement: ${metrics.after.inboxPlacementPct}%

3. FINANCIAL ROI ESTIMATION
- Monthly ESP Cost Savings: $${metrics.after.costSavingsMonthly} / month
- Annual ESP Cost Savings: $${metrics.after.costSavingsMonthly * 12} / year

=====================================================
Status: CLEANED & OPTIMIZED BY RE-ENGAGE
=====================================================`;

    triggerDownload(reportText, `re_engage_audit_report_${Date.now()}.txt`);
  };

  const triggerDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950/30 p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-neutral-100">Export Cleaned Email Assets</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Download production-ready CSVs ready for immediate re-import into Mailchimp, Klaviyo, or ConvertKit.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={downloadAuditReport}
            className="flex items-center space-x-1.5 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs font-semibold text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 transition-all"
          >
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            <span>Audit Report (.txt)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Button 1: Download Cleaned CSV */}
        <button
          onClick={downloadCleanedCSV}
          className="group flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-left hover:border-emerald-400 hover:bg-emerald-500/20 transition-all shadow-md shadow-emerald-500/10"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-neutral-950 font-bold group-hover:scale-105 transition-transform">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-emerald-300">
                Download Cleaned List CSV
              </span>
              <span className="block text-[11px] text-neutral-400">
                {stats.activeCount + stats.atRiskCount} Active & At-Risk Contacts
              </span>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
            &darr;
          </span>
        </button>

        {/* Button 2: Download Sunset Suppress List */}
        <button
          onClick={downloadSunsetCSV}
          className="group flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-left hover:border-rose-400 hover:bg-rose-500/20 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold group-hover:scale-105 transition-transform">
              <UserX className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-rose-300">
                Download Sunset Suppress CSV
              </span>
              <span className="block text-[11px] text-neutral-400">
                {stats.inactiveCount} Inactive Contacts to Suppress
              </span>
            </div>
          </div>
          <span className="text-xs text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform">
            &darr;
          </span>
        </button>
      </div>
    </div>
  );
};
