import React from 'react';
import { formatPrice } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({ price, className = '', size = 'md' }: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-lg px-3.5 py-1.5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#FAF3E0] text-[#191512] font-semibold border border-[#D5C7B0] rounded shadow-sm relative pl-4 select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Punched hole */}
      <span
        className="w-2 h-2 rounded-full bg-[#E5DCB8] border border-[#BCB09C] absolute left-1.5 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <span className="font-display font-bold tracking-tight text-vermilion">
        {formatPrice(price)}
      </span>
    </div>
  );
}
