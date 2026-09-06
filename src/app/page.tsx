'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { ColumnMappingModal } from '@/components/ColumnMappingModal';
import { ThresholdControls } from '@/components/ThresholdControls';
import { MetricsOverview } from '@/components/MetricsOverview';
import { BeforeAfterCharts } from '@/components/BeforeAfterCharts';
import { SubscriberTable } from '@/components/SubscriberTable';
import { AiWinBackModal } from '@/components/AiWinBackModal';
import { ExportActions } from '@/components/ExportActions';

import { CSVParseResult, parseCSVText } from '@/lib/csvParser';
import { SamplePreset } from '@/lib/sampleData';
import {
  Subscriber,
  ColumnMapping,
  ThresholdConfig,
  BucketType,
} from '@/types/subscriber';
import {
  processSubscribers,
  calculateBucketStats,
  calculateDeliverabilityMetrics,
  DEFAULT_THRESHOLDS,
} from '@/lib/scoringEngine';

export default function Home() {
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [showThresholdControls, setShowThresholdControls] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const [activePresetId, setActivePresetId] = useState<string | undefined>();
  const [overrides, setOverrides] = useState<Record<string, BucketType>>({});

  // 1. Handle File Upload
  const handleFileParsed = (result: CSVParseResult, fileName: string) => {
    setActivePresetId(undefined);
    setParseResult(result);

    // If email column is detected, proceed immediately; else open mapping modal
    if (result.suggestedMapping.email) {
      setColumnMapping(result.suggestedMapping);
    } else {
      setColumnMapping(result.suggestedMapping);
      setShowMappingModal(true);
    }
  };

  // 2. Handle Preset Dataset Click
  const handleSelectPreset = (preset: SamplePreset) => {
    setActivePresetId(preset.id);
    const result = parseCSVText(preset.csvContent);
    setParseResult(result);
    setColumnMapping(result.suggestedMapping);
    setOverrides({});
  };

  // 3. Process Subscribers with Engine
  const subscribers: Subscriber[] = useMemo(() => {
    if (!parseResult || !columnMapping) return [];
    const processed = processSubscribers(parseResult.rows, columnMapping, thresholds);
    
    // Apply manual overrides if any
    return processed.map((sub) => {
      if (overrides[sub.id]) {
        return { ...sub, manualOverrideBucket: overrides[sub.id] };
      }
      return sub;
    });
  }, [parseResult, columnMapping, thresholds, overrides]);

  const stats = useMemo(() => calculateBucketStats(subscribers), [subscribers]);
  const metrics = useMemo(() => calculateDeliverabilityMetrics(subscribers), [subscribers]);

  const handleOverrideBucket = (subscriberId: string, newBucket: BucketType) => {
    setOverrides((prev) => ({ ...prev, [subscriberId]: newBucket }));
  };

  const handleReset = () => {
    setParseResult(null);
    setColumnMapping(null);
    setShowMappingModal(false);
    setActivePresetId(undefined);
    setOverrides({});
  };

  const hasData = subscribers.length > 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* Navigation Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onOpenThresholds={() => setShowThresholdControls(!showThresholdControls)}
        onReset={handleReset}
        hasData={hasData}
        activePresetId={activePresetId}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 space-y-8">
        {!hasData ? (
          <FileUpload
            onParsed={handleFileParsed}
            onSelectPreset={handleSelectPreset}
          />
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Threshold Tuning Drawer */}
            {showThresholdControls && (
              <ThresholdControls
                thresholds={thresholds}
                onChange={setThresholds}
                onClose={() => setShowThresholdControls(false)}
              />
            )}

            {/* Metrics Overview Cards */}
            <MetricsOverview
              metrics={metrics}
              stats={stats}
              onOpenAiModal={() => setShowAiModal(true)}
            />

            {/* Before vs After Charts */}
            <BeforeAfterCharts metrics={metrics} stats={stats} />

            {/* Export Action CSV Buttons */}
            <ExportActions subscribers={subscribers} metrics={metrics} stats={stats} />

            {/* Subscriber Data Table & Manual Override Controls */}
            <SubscriberTable
              subscribers={subscribers}
              onOverrideBucket={handleOverrideBucket}
            />
          </div>
        )}
      </main>

      {/* Column Mapping Modal */}
      {showMappingModal && parseResult && columnMapping && (
        <ColumnMappingModal
          headers={parseResult.headers}
          initialMapping={columnMapping}
          onConfirm={(mapping) => {
            setColumnMapping(mapping);
            setShowMappingModal(false);
          }}
          onCancel={() => {
            setShowMappingModal(false);
            if (!columnMapping?.email) handleReset();
          }}
        />
      )}

      {/* AI Win-Back Generator Studio Modal */}
      {showAiModal && (
        <AiWinBackModal
          stats={stats}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Re-Engage &copy; {new Date().getFullYear()} — Smart Email Deliverability & List Cleanup</span>
          <span className="text-neutral-400">Protects Domain Reputation • Zero Email Sending Risk</span>
        </div>
      </footer>
    </div>
  );
}
