import React from 'react';

interface RubberStampProps {
  text: string;
  variant?: 'sold' | 'verified';
  className?: string;
}

export function RubberStamp({
  text,
  variant = 'sold',
  className = '',
}: RubberStampProps) {
  const isSold = variant === 'sold';

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20 ${className}`}
      aria-label={`Status: ${text}`}
    >
      <div
        className={`px-4 py-1.5 border-4 rounded font-display font-black text-2xl tracking-widest uppercase transform rotate-stamp shadow-sm ${
          isSold
            ? 'text-red-700 border-red-700 bg-red-50/70 border-dashed'
            : 'text-emerald-700 border-emerald-700 bg-emerald-50/70 border-double'
        }`}
        style={{
          boxShadow: 'inset 0 0 0 1px currentColor',
        }}
      >
        {text}
      </div>
    </div>
  );
}
