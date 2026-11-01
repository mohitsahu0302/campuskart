'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, MapPin, Sparkles } from 'lucide-react';
import { Listing } from '@/lib/types';
import { formatDate, getCardRotation, getCardBackground } from '@/lib/utils';
import { Pin } from './Pin';
import { Tape } from './Tape';
import { PriceTag } from './PriceTag';
import { RubberStamp } from './RubberStamp';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export function ListingCard({ listing, priority = false }: ListingCardProps) {
  const { user, savedListings, setSavedListings } = useAuth();
  const { toast } = useToast();

  const isSaved = savedListings.includes(listing._id);
  const isSold = listing.status === 'sold';
  const rotationClass = getCardRotation(listing._id);
  const bgClass = getCardBackground(listing._id);

  // Use either pin or tape alternatively based on id
  const useTape = listing._id.charCodeAt(listing._id.length - 1) % 2 === 0;

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast('Please log in with your campus email to save notices.', 'info');
      return;
    }

    try {
      const res = await userApi.toggleSaved(listing._id);
      if (res.success) {
        setSavedListings(res.data.savedListings);
        toast(res.message, 'success');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to update saved items', 'error');
    }
  };

  const mainImage =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      className={`relative group paper-card rounded-md p-3.5 sm:p-4 flex flex-col justify-between ${bgClass} ${rotationClass}`}
    >
      {/* Top Attachment: Push Pin or Washi Tape */}
      {useTape ? (
        <Tape angle="left" />
      ) : (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Pin color={isSold ? 'ink' : 'vermilion'} />
        </div>
      )}

      {/* Rubber Stamp if sold */}
      {isSold && <RubberStamp text="SOLD" variant="sold" />}

      {/* Main card content */}
      <Link
        href={`/item/${listing._id}`}
        className="block group-hover:no-underline focus:outline-none"
      >
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-stone-100 border border-stone-200/60 mb-3 shadow-inner">
          <Image
            src={mainImage}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              isSold ? 'grayscale-[50%] opacity-80' : ''
            }`}
          />

          {/* Quick Condition Tag */}
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide bg-stone-900/80 text-stone-100 backdrop-blur-sm border border-stone-700/50">
            {listing.condition}
          </span>

          {/* Category Stamp */}
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF5EB] text-ink border border-[#DCD3C4] shadow-sm">
            {listing.category}
          </span>
        </div>

        {/* Title & Price Row */}
        <div className="mb-2">
          <h3 className="font-display font-bold text-lg sm:text-xl text-ink leading-snug line-clamp-2 group-hover:text-vermilion transition-colors">
            {listing.title}
          </h3>
        </div>

        {/* Short handwritten-style note */}
        <p className="text-xs sm:text-sm text-ink-subtle line-clamp-2 mb-3 font-body leading-relaxed">
          {listing.description}
        </p>
      </Link>

      {/* Bottom Footer Section: Price & Details */}
      <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between gap-2 mt-auto">
        <div className="flex flex-col">
          <PriceTag price={listing.price} size="sm" />
          <span className="font-hand text-xs text-ink-subtle flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-vermilion inline" />
            {listing.hostelArea}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Wishlist Button */}
          <button
            onClick={handleSaveToggle}
            aria-label={isSaved ? 'Remove from saved' : 'Save notice'}
            className={`p-2 rounded-full border transition-all ${
              isSaved
                ? 'bg-vermilion text-white border-vermilion shadow-sm'
                : 'bg-white/90 text-stone-600 border-stone-300 hover:text-vermilion hover:border-vermilion/50'
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
