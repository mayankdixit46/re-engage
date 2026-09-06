'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Sparkles, CheckCircle2, AlertCircle, ShoppingBag, Building2 } from 'lucide-react';
import { parseCSVFile, parseCSVText, CSVParseResult } from '@/lib/csvParser';
import { SAMPLE_PRESETS, SamplePreset } from '@/lib/sampleData';

interface FileUploadProps {
  onParsed: (result: CSVParseResult, fileName: string) => void;
  onSelectPreset: (preset: SamplePreset) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onParsed, onSelectPreset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setError('Please upload a valid CSV file exported from Mailchimp, Klaviyo, ActiveCampaign, or ConvertKit.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await parseCSVFile(file);
      if (result.rows.length === 0) {
        setError('The uploaded CSV file is empty.');
        setLoading(false);
        return;
      }
      onParsed(result, file.name);
    } catch (err: any) {
      setError(`Failed to parse CSV file: ${err.message || 'Unknown format'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-6">
      {/* Hero Welcome */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Stop Silent Deliverability Poisoning</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
          Clean Your Email List & <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">Skyrocket Inbox Placement</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-neutral-400">
          Sending emails to dead-weight subscribers alerts Gmail & Outlook to flag your entire domain as spam.
          Upload your subscriber CSV to identify ghost subscribers, protect your domain score, and generate AI win-back campaigns.
        </p>
      </div>

      {/* Main Drag-and-Drop Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/20 shadow-xl shadow-emerald-500/10 scale-[1.01]'
            : 'border-neutral-800 bg-neutral-900/50 hover:border-emerald-500/50 hover:bg-neutral-900/80 hover:shadow-lg hover:shadow-emerald-500/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 shadow-inner">
          <UploadCloud className={`h-8 w-8 transition-colors ${isDragging ? 'text-emerald-400' : 'text-neutral-400'}`} />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-neutral-950/80">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
            </div>
          )}
        </div>

        <h3 className="text-base font-semibold text-neutral-200">
          Drop your Mailchimp, Klaviyo, or ConvertKit CSV here
        </h3>
        <p className="mt-1 text-xs text-neutral-400">
          Supports CSV exports containing email, sign-up date, last opened date, or open/click counts
        </p>

        <div className="mt-5 inline-flex items-center space-x-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-colors">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Select CSV File</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Click Demo Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Or test with instant pre-loaded sample datasets</span>
          </div>
          <span className="text-[11px] text-neutral-400">Zero signup needed</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SAMPLE_PRESETS.map((preset) => {
            const Icon = preset.iconName === 'ShoppingBag' ? ShoppingBag : preset.iconName === 'Building2' ? Building2 : Sparkles;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-neutral-800/80 hover:shadow-md hover:shadow-emerald-500/10"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
                      {preset.totalRows} contacts
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-200 group-hover:text-emerald-300 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center space-x-1.5 text-[11px] font-medium text-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Load dataset</span>
                  <span>&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
