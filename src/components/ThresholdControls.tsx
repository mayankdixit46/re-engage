'use client';

import React from 'react';
import { ThresholdConfig } from '@/types/subscriber';
import { Sliders, X, CheckCircle2, AlertTriangle, UserX } from 'lucide-react';

interface ThresholdControlsProps {
  thresholds: ThresholdConfig;
  onChange: (newThresholds: ThresholdConfig) => void;
  onClose: () => void;
}

export const ThresholdControls: React.FC<ThresholdControlsProps> = ({
  thresholds,
  onChange,
  onClose,
}) => {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-neutral-900/90 backdrop-blur-xl p-5 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-100">Engagement Threshold Tuning</h3>
            <p className="text-[11px] text-neutral-400">
              Customize day cutoffs to tune list segmentation logic in real time
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Threshold Slider */}
        <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">Active Subscriber Cutoff</span>
            </div>
            <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300">
              ≤ {thresholds.activeDays} days
            </span>
          </div>

          <input
            type="range"
            min="30"
            max="120"
            step="5"
            value={thresholds.activeDays}
            onChange={(e) =>
              onChange({ ...thresholds, activeDays: parseInt(e.target.value, 10) })
            }
            className="w-full accent-emerald-400 cursor-pointer"
          />

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Subscribers who opened or clicked an email within the last <strong>{thresholds.activeDays} days</strong> are safe to keep emailing.
          </p>
        </div>

        {/* At-Risk Threshold Slider */}
        <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">At-Risk Win-Back Cutoff</span>
            </div>
            <span className="rounded-lg bg-amber-500/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-300">
              {thresholds.activeDays + 1} to {thresholds.atRiskDays} days
            </span>
          </div>

          <input
            type="range"
            min={thresholds.activeDays + 10}
            max="365"
            step="10"
            value={thresholds.atRiskDays}
            onChange={(e) =>
              onChange({ ...thresholds, atRiskDays: parseInt(e.target.value, 10) })
            }
            className="w-full accent-amber-400 cursor-pointer"
          />

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Subscribers last active between <strong>{thresholds.activeDays + 1}</strong> and <strong>{thresholds.atRiskDays} days</strong> will receive the AI win-back re-engagement sequence.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-xs text-neutral-300">
        <div className="flex items-center space-x-2">
          <UserX className="h-4 w-4 text-rose-400" />
          <span>
            <strong>Inactive Sunset Rule:</strong> Anyone inactive for &gt; <strong>{thresholds.atRiskDays} days</strong> or who never opened an email will be automatically suppressed.
          </span>
        </div>
        <button
          onClick={() => onChange({ activeDays: 90, atRiskDays: 180, minOpensForActive: 1 })}
          className="text-[11px] text-emerald-400 hover:underline"
        >
          Reset Defaults
        </button>
      </div>
    </div>
  );
};
