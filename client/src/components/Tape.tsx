import React from 'react';

interface TapeProps {
  angle?: 'left' | 'right' | 'straight';
  className?: string;
}

export function Tape({ angle = 'straight', className = '' }: TapeProps) {
  const rotationClass =
    angle === 'left'
      ? '-rotate-2'
      : angle === 'right'
      ? 'rotate-2'
      : '-rotate-0.5';

  return (
    <div
      className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none ${rotationClass} ${className}`}
      aria-hidden="true"
    >
      <div className="w-14 sm:w-16 h-4 bg-amber-100/70 border-x border-dashed border-amber-300/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-[0.5px]" />
    </div>
  );
}
