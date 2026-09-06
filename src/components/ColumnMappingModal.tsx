'use client';

import React, { useState } from 'react';
import { ColumnMapping } from '@/types/subscriber';
import { Sliders, CheckCircle, HelpCircle } from 'lucide-react';

interface ColumnMappingModalProps {
  headers: string[];
  initialMapping: ColumnMapping;
  onConfirm: (mapping: ColumnMapping) => void;
  onCancel: () => void;
}

export const ColumnMappingModal: React.FC<ColumnMappingModalProps> = ({
  headers,
  initialMapping,
  onConfirm,
  onCancel,
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>(initialMapping);

  const fields: { key: keyof ColumnMapping; label: string; required: boolean; hint: string }[] = [
    { key: 'email', label: 'Email Address', required: true, hint: 'The subscriber email column' },
    { key: 'firstName', label: 'First Name', required: false, hint: 'Used for personalization in AI win-back drafts' },
    { key: 'lastName', label: 'Last Name', required: false, hint: 'Subscriber last name' },
    { key: 'signupDate', label: 'Signup / Joined Date', required: false, hint: 'Date contact was added to your ESP' },
    { key: 'lastOpenedDate', label: 'Last Opened Date', required: false, hint: 'Date of last email open' },
    { key: 'lastClickedDate', label: 'Last Clicked Date', required: false, hint: 'Date of last link click' },
    { key: 'openCount', label: 'Total Opens Count', required: false, hint: 'Number of recorded email opens' },
    { key: 'clickCount', label: 'Total Clicks Count', required: false, hint: 'Number of recorded link clicks' },
    { key: 'totalEmailsSent', label: 'Total Emails Sent', required: false, hint: 'Total emails sent to this contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">Confirm Column Mapping</h3>
            <p className="text-xs text-neutral-400">
              Verify how your CSV headers match Re-Engage analysis fields.
            </p>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col space-y-1.5 rounded-xl border border-neutral-800 bg-neutral-950/50 p-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-200 flex items-center space-x-1.5">
                  <span>{field.label}</span>
                  {field.required ? (
                    <span className="text-rose-400 font-normal">*Required</span>
                  ) : (
                    <span className="text-neutral-400 font-normal text-[10px]">(Optional)</span>
                  )}
                </label>
                <span className="text-[11px] text-neutral-400">{field.hint}</span>
              </div>

              <select
                value={mapping[field.key] || ''}
                onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">-- None / Skip --</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-neutral-800">
          <button
            onClick={onCancel}
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-400 hover:border-neutral-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(mapping)}
            className="flex items-center space-x-2 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Confirm & Process CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
