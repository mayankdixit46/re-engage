'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Sliders, Zap, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '@/lib/sampleData';

interface HeaderProps {
  onSelectPreset: (preset: SamplePreset) => void;
  onOpenThresholds: () => void;
  onReset: () => void;
  hasData: boolean;
  activePresetId?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onOpenThresholds,
  onReset,
  hasData,
  activePresetId,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-neutral-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-950">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-200 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                Re-Engage
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Deliverability Guardian MVP
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Email List Health, Engagement Scoring & Win-Back AI Studio
            </p>
          </div>
        </div>

        {/* Action Controls & Sample Loaders */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!hasData && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" /> 1-Click Demo:
              </span>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                    activePresetId === preset.id
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{preset.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {hasData && (
            <>
              <button
                onClick={onOpenThresholds}
                className="flex items-center space-x-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-all hover:border-emerald-500/40 hover:bg-neutral-800 hover:text-white"
              >
                <Sliders className="h-3.5 w-3.5 text-emerald-400" />
                <span>Adjust Thresholds</span>
              </button>

              <button
                onClick={onReset}
                className="flex items-center space-x-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New List</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
