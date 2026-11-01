'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tape } from './Tape';

interface PolaroidGalleryProps {
  images: string[];
  title: string;
}

export function PolaroidGallery({ images, title }: PolaroidGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        ];

  const currentImage = displayImages[activeIndex] || displayImages[0];

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Polaroid Frame */}
      <div className="relative w-full max-w-lg bg-white p-4 sm:p-5 pb-8 sm:pb-10 rounded-sm shadow-polaroid border border-stone-200 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
        <Tape angle="straight" className="top-2 left-1/2 -translate-x-1/2 opacity-80" />

        {/* Polaroid Picture Canvas */}
        <div className="relative aspect-[4/3] w-full bg-stone-900 rounded-sm overflow-hidden mb-3 border border-stone-200/50">
          <Image
            src={currentImage}
            alt={`${title} - Photo ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
          />

          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Polaroid bottom caption / handwriting strip */}
        <div className="flex items-center justify-between px-1">
          <span className="font-hand text-base sm:text-lg text-stone-700 tracking-wide truncate">
            {title}
          </span>
          {displayImages.length > 1 && (
            <span className="font-hand text-sm text-stone-500 whitespace-nowrap ml-2">
              [{activeIndex + 1} / {displayImages.length}]
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails if multiple images */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2 mt-4 overflow-x-auto p-1 max-w-full">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 rounded border overflow-hidden transition-all ${
                idx === activeIndex
                  ? 'border-vermilion ring-2 ring-vermilion/40 scale-105'
                  : 'border-stone-300 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
