import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#FCFBF8',
          warm: '#FAF5EB',
          creamy: '#F6EFE2',
          kraft: '#EFE6D5',
        },
        board: {
          DEFAULT: '#F3EFE6',
          dark: '#E7DEC9',
          border: '#D8CCA8',
        },
        ink: {
          DEFAULT: '#191512',
          subtle: '#524B43',
          faint: '#857B6F',
          border: '#DCD3C4',
        },
        vermilion: {
          DEFAULT: '#D4421E',
          hover: '#BD3815',
          light: '#FDF2EE',
          muted: '#C25235',
        },
        marigold: {
          DEFAULT: '#D97706',
          hover: '#B45309',
          light: '#FEF3C7',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'],
      },
      boxShadow: {
        'pin': '0 3px 8px -1px rgba(25, 21, 18, 0.16), 0 1px 3px rgba(25, 21, 18, 0.1)',
        'lift': '0 12px 24px -4px rgba(25, 21, 18, 0.18), 0 4px 8px -2px rgba(25, 21, 18, 0.12)',
        'polaroid': '0 4px 14px 0 rgba(0, 0, 0, 0.12)',
        'sticky': '2px 4px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
      },
      rotate: {
        'pos-1': '1.2deg',
        'pos-2': '2deg',
        'neg-1': '-1.2deg',
        'neg-2': '-2deg',
        'stamp': '-14deg',
      },
    },
  },
  plugins: [],
};

export default config;
