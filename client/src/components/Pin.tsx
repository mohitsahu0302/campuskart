import React from 'react';

interface PinProps {
  color?: 'vermilion' | 'brass' | 'slate' | 'ink';
  className?: string;
}

export function Pin({ color = 'vermilion', className = '' }: PinProps) {
  const pinColors = {
    vermilion: {
      head: '#D4421E',
      highlight: '#F87171',
      shadow: '#991B1B',
    },
    brass: {
      head: '#D97706',
      highlight: '#FCD34D',
      shadow: '#92400E',
    },
    slate: {
      head: '#475569',
      highlight: '#94A3B8',
      shadow: '#1E293B',
    },
    ink: {
      head: '#292524',
      highlight: '#78716C',
      shadow: '#0C0A09',
    },
  };

  const selected = pinColors[color] || pinColors.vermilion;

  return (
    <div
      className={`relative inline-block pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]"
      >
        {/* Needle tip */}
        <path
          d="M11 12L11 22"
          stroke="#44403C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Pin head base */}
        <ellipse cx="11" cy="11.5" rx="6" ry="3" fill={selected.shadow} />
        {/* Pin body */}
        <path
          d="M6 7C6 4.79086 8.23858 3 11 3C13.7614 3 16 4.79086 16 7C16 9 14.5 10.5 11 11C7.5 10.5 6 9 6 7Z"
          fill={selected.head}
        />
        {/* Gloss highlight */}
        <ellipse cx="9" cy="5.5" rx="2.5" ry="1.2" fill={selected.highlight} />
      </svg>
    </div>
  );
}
