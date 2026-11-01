import React from 'react';
import { Tape } from './Tape';

export function NoticeBoardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="relative paper-card rounded-md p-4 bg-[#FCFBF8] border border-stone-200"
        >
          <Tape angle={idx % 2 === 0 ? 'left' : 'right'} />
          <div className="aspect-[4/3] w-full rounded bg-stone-200 mb-3" />
          <div className="h-5 w-3/4 bg-stone-200 rounded mb-2" />
          <div className="h-3 w-full bg-stone-200 rounded mb-1.5" />
          <div className="h-3 w-1/2 bg-stone-200 rounded mb-4" />
          <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
            <div className="h-6 w-16 bg-stone-200 rounded" />
            <div className="h-6 w-6 bg-stone-200 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
