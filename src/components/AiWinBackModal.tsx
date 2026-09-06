'use client';

import React, { useState } from 'react';
import { AiWinBackResponse, BucketStats } from '@/types/subscriber';
import { Sparkles, X, Copy, Check, Lightbulb, RefreshCw } from 'lucide-react';

interface AiWinBackModalProps {
  stats: BucketStats;
  onClose: () => void;
}

export const AiWinBackModal: React.FC<AiWinBackModalProps> = ({ stats, onClose }) => {
  const [brandName, setBrandName] = useState('Our Brand');
  const [industry, setIndustry] = useState('E-Commerce / Creator');
  const [tone, setTone] = useState<'Friendly' | 'Urgent' | 'Value-First' | 'Curiosity' | 'Incentive'>('Friendly');
  const [specialOffer, setSpecialOffer] = useState('20% off your next order or exclusive VIP content');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiWinBackResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/win-back', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          industry,
          tone,
          atRiskCount: stats.atRiskCount,
          topInactivityPeriodDays: 120,
          specialOffer,
        }),
      });

      if (res.ok) {
        const data: AiWinBackResponse = await res.json();
        setResult(data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Serverless route unavailable, utilizing client generator:', err);
    }

    // Client-side fallback generation
    const fallback = generateFallbackWinBack(brandName, tone, specialOffer, 120);
    setResult(fallback);
    setLoading(false);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-amber-500/30 bg-neutral-900 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-md">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-950">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-100">AI Win-Back Re-Engagement Studio</h3>
              <p className="text-xs text-neutral-400">
                Craft high-converting emails tailored for your {stats.atRiskCount} At-Risk subscribers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Parameters Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300">Campaign Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="Friendly">Friendly Check-In</option>
              <option value="Urgent">Urgent Sunset Warning</option>
              <option value="Incentive">Incentive / Discount Offer</option>
              <option value="Value-First">Value-First Update</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-neutral-300">Special Offer / Re-engagement Incentive</label>
            <input
              type="text"
              value={specialOffer}
              onChange={(e) => setSpecialOffer(e.target.value)}
              placeholder="e.g. 20% discount code, free ebook download..."
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-md hover:from-amber-400 hover:to-emerald-400 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Crafting AI Sequence...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{result ? 'Regenerate Sequence' : 'Generate Win-Back Sequence'}</span>
              </>
            )}
          </button>
        </div>

        {/* Output Result View */}
        {result && (
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <div className="flex items-start space-x-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong className="block font-semibold">AI Copy Strategy Rationale:</strong>
                <span>{result.reengagementStrategyNotes}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                Recommended Subject Lines (A/B Test)
              </label>
              <div className="space-y-1.5">
                {result.subjectLines.map((subj, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200"
                  >
                    <span>
                      <strong className="text-amber-400 font-mono mr-2">Option {i + 1}:</strong>
                      {subj}
                    </span>
                    <button
                      onClick={() => copyToClipboard(subj, `subj_${i}`)}
                      className="text-neutral-400 hover:text-amber-300 cursor-pointer"
                    >
                      {copiedField === `subj_${i}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase">Preview Text</span>
                <p className="text-xs text-neutral-200 font-mono">{result.previewText}</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase">Call To Action Button</span>
                <p className="text-xs text-emerald-400 font-bold font-mono">{result.callToAction}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                  Complete Win-Back Email Body
                </label>
                <button
                  onClick={() => copyToClipboard(result.emailBody, 'emailBody')}
                  className="flex items-center space-x-1 text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  {copiedField === 'emailBody' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Copy</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs font-mono text-neutral-200 leading-relaxed whitespace-pre-wrap">
                {result.emailBody}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function generateFallbackWinBack(
  brandName: string,
  tone: string,
  specialOffer: string,
  inactivityDays: number
): AiWinBackResponse {
  if (tone === 'Urgent') {
    return {
      subjectLines: [
        `Should we say goodbye? (Action required for ${brandName})`,
        `We're cleaning house — still want our emails?`,
        `Is this goodbye, {{first_name}}?`,
      ],
      previewText: `Confirm your subscription in 1-click or we'll stop bothering you.`,
      emailBody: `Hey {{first_name|there}},\n\nWe noticed you haven't opened our recent emails over the last ${inactivityDays} days. We respect your inbox space and hate spam as much as you do!\n\nIf you'd like to remain on the ${brandName} list and receive ${specialOffer}, click the button below to confirm.\n\nOtherwise, no action is needed — we will automatically remove you in 48 hours so your inbox stays clean.`,
      callToAction: `Yes, Keep Me Subscribed!`,
      reengagementStrategyNotes: `Urgency paired with an explicit zero-friction opt-out reduces spam complaints while instantly isolating high-intent subscribers.`,
    };
  }

  if (tone === 'Incentive' || tone === 'Value-First') {
    return {
      subjectLines: [
        `We missed you! Here's ${specialOffer}`,
        `A quick gift before we update our list...`,
        `{{first_name}}, here is your exclusive pass back to ${brandName}`,
      ],
      previewText: `Claim your exclusive gift inside — limited time re-engagement offer.`,
      emailBody: `Hi {{first_name|there}},\n\nIt's been a little while since we last connected at ${brandName}. We've published some of our best resources recently and didn't want you to miss out.\n\nTo welcome you back, we've put together a special offer: ${specialOffer}.\n\nClick below to claim your gift and confirm you want to stay in the loop!`,
      callToAction: `Claim My Offer & Stay Connected`,
      reengagementStrategyNotes: `Value-first framing converts passive subscribers by giving immediate tangible incentive before list sunsetting.`,
    };
  }

  return {
    subjectLines: [
      `Are we still on your radar? - ${brandName}`,
      `We noticed it's been a while, {{first_name}}`,
      `Quick question from the ${brandName} team`,
    ],
    previewText: `Let us know if you still want to receive updates, tips, and special offers.`,
    emailBody: `Hey {{first_name|there}},\n\nWe noticed you haven't had a chance to check out our updates recently. We know inboxes get crowded, and we only want to send content you actually look forward to.\n\nIf you still want to hear from us (plus get access to ${specialOffer}), just click below to confirm your interest.\n\nIf not, no worries at all! You can stay unsubscribed and we won't email you again.`,
    callToAction: `Yes! Keep Sending Updates`,
    reengagementStrategyNotes: `A friendly check-in creates low friction and protects deliverability by inviting non-responders to self-segment.`,
  };
}
