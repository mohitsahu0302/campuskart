import React from 'react';
import Link from 'next/link';
import { PlusCircle, RotateCcw } from 'lucide-react';
import { Pin } from './Pin';

interface EmptyNoticeBoardProps {
  isFiltered?: boolean;
  onReset?: () => void;
}

export function EmptyNoticeBoard({
  isFiltered = false,
  onReset,
}: EmptyNoticeBoardProps) {
  return (
    <div className="relative mx-auto max-w-lg my-12 p-8 text-center bg-[#FAF6EE] border-2 border-dashed border-stone-300 rounded-xl shadow-sm">
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <Pin color="vermilion" />
      </div>

      {/* Hand-drawn empty notice graphic SVG */}
      <svg
        className="w-24 h-24 mx-auto mb-4 text-stone-300"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="15"
          y="20"
          width="70"
          height="65"
          rx="4"
          fill="#FFFDF9"
          stroke="#DCD3C4"
          strokeWidth="2"
          transform="rotate(-2 50 50)"
        />
        <line
          x1="25"
          y1="35"
          x2="75"
          y2="35"
          stroke="#DCD3C4"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <line
          x1="25"
          y1="48"
          x2="65"
          y2="48"
          stroke="#DCD3C4"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <line
          x1="25"
          y1="61"
          x2="55"
          y2="61"
          stroke="#DCD3C4"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <circle cx="50" cy="18" r="4" fill="#D4421E" />
      </svg>

      <h3 className="font-display font-bold text-2xl text-ink mb-2">
        {isFiltered
          ? 'No matching slips on the board'
          : 'Nothing pinned here yet.'}
      </h3>

      <p className="text-sm text-ink-subtle mb-6 max-w-sm mx-auto leading-relaxed">
        {isFiltered
          ? 'Try loosening your price filters or checking other hostel wings. Notices rotate quickly after mid-terms!'
          : 'Be the first student to tack an index card on this board. Got a spare cycle, textbook, or kettle?'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-vermilion" />
            Clear filters
          </button>
        )}

        <Link
          href="/sell"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded bg-vermilion text-white hover:bg-vermilion-hover shadow-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Pin a new notice
        </Link>
      </div>
    </div>
  );
}
