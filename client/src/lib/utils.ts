import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
}

// Deterministic rotation based on item ID to prevent hydration mismatch
export function getCardRotation(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const tilts = [
    '-rotate-[1.2deg]',
    'rotate-[1deg]',
    '-rotate-[0.8deg]',
    'rotate-[1.5deg]',
    '-rotate-[1.4deg]',
    'rotate-[0.7deg]',
  ];
  const index = Math.abs(hash) % tilts.length;
  return tilts[index];
}

export function getCardBackground(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 3) + id.charCodeAt(i);
  }
  const shades = [
    'bg-[#FCFBF7]',
    'bg-[#FAF6EE]',
    'bg-[#FDFCF8]',
    'bg-[#F8F3E9]',
  ];
  return shades[Math.abs(hash) % shades.length];
}
