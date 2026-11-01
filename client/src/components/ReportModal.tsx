'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Send } from 'lucide-react';
import { listingsApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface ReportModalProps {
  listingId: string;
  listingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const REASONS = [
  'Already Sold',
  'Wrong Category',
  'Suspicious or Scam',
  'Inappropriate or Offensive',
  'Duplicate Listing',
  'Other',
];

export function ReportModal({
  listingId,
  listingTitle,
  isOpen,
  onClose,
}: ReportModalProps) {
  const { toast } = useToast();
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await listingsApi.reportListing(
        listingId,
        selectedReason,
        details
      );
      if (res.success) {
        toast('Notice reported. Campus moderators will review it.', 'success');
        onClose();
      }
    } catch (err: any) {
      toast(err.message || 'Failed to submit report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in-50">
      <div className="relative w-full max-w-md bg-[#FAF6EE] rounded-xl border border-stone-300 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-vermilion">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-display font-bold text-lg text-ink">
            Report this Notice
          </h3>
        </div>

        <p className="text-xs text-stone-600 mb-4 line-clamp-1">
          Regarding: <span className="font-semibold">{listingTitle}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2 uppercase tracking-wider font-display">
              Why are you reporting this?
            </label>
            <div className="space-y-2">
              {REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2 rounded bg-white border border-stone-200 cursor-pointer hover:border-amber-300 text-xs text-stone-800 transition-colors"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-vermilion"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 uppercase tracking-wider font-display">
              Additional Details (optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. This cycle was already sold last week, or wrong price listed..."
              className="w-full p-2.5 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              maxLength={500}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-hover disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
