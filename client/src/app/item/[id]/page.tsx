'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Flag,
  Eye,
  Calendar,
  Sparkles,
  MapPin,
  Tag,
} from 'lucide-react';
import { Listing } from '@/lib/types';
import { listingsApi, userApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { PolaroidGallery } from '@/components/PolaroidGallery';
import { ContactSellerBox } from '@/components/ContactSellerBox';
import { PriceTag } from '@/components/PriceTag';
import { RubberStamp } from '@/components/RubberStamp';
import { ReportModal } from '@/components/ReportModal';
import { Tape } from '@/components/Tape';
import { Pin } from '@/components/Pin';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, savedListings, setSavedListings } = useAuth();
  const { toast } = useToast();

  const id = params.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await listingsApi.getListing(id);
        if (res.success && res.data.listing) {
          setListing(res.data.listing);
        }
      } catch (err: any) {
        setError(err.message || 'Notice not found on the board.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const isSaved = listing ? savedListings.includes(listing._id) : false;
  const isSold = listing?.status === 'sold';

  const handleSaveToggle = async () => {
    if (!listing) return;
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

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast('Link copied to clipboard! Share it in your hostel group.', 'success');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center animate-pulse">
        <div className="h-8 w-48 bg-stone-300 rounded mx-auto mb-6" />
        <div className="h-96 w-full max-w-lg bg-stone-200 rounded mx-auto mb-6" />
        <div className="h-6 w-3/4 bg-stone-200 rounded mx-auto mb-3" />
        <div className="h-4 w-1/2 bg-stone-200 rounded mx-auto" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#FAF6EE] border border-stone-300 rounded-xl shadow-sm">
        <Pin color="vermilion" className="mb-2" />
        <h2 className="font-display font-bold text-2xl text-ink mb-2">
          Notice Not Found
        </h2>
        <p className="text-sm text-ink-subtle mb-6">
          {error || 'This slip might have been torn off or removed by the seller.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-stone-900 text-stone-100 text-sm font-semibold hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notice Board</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Top Back & Quick Actions bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-700 hover:text-vermilion transition-colors px-3 py-1.5 rounded-md bg-white border border-stone-300 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Board</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-stone-300 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-900 shadow-sm transition-colors"
            title="Share listing link"
          >
            <Share2 className="w-3.5 h-3.5 text-vermilion" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleSaveToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border shadow-sm transition-colors ${
              isSaved
                ? 'bg-vermilion text-white border-vermilion'
                : 'bg-white border-stone-300 text-stone-700 hover:text-vermilion'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save Notice'}</span>
          </button>
        </div>
      </div>

      {/* Main Notice Card */}
      <div className="relative bg-[#FAF6EE] border border-stone-300 rounded-xl p-6 sm:p-8 shadow-sm">
        <Tape angle="straight" className="top-0 left-1/2 -translate-x-1/2 opacity-75" />

        {isSold && <RubberStamp text="SOLD OUT" variant="sold" />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Polaroid Photo Gallery (5 cols) */}
          <div className="lg:col-span-5">
            <PolaroidGallery images={listing.images} title={listing.title} />
          </div>

          {/* Right Column: Listing Details & Seller Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & Condition tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#EFE6D5] text-stone-800 text-xs font-semibold border border-stone-300 font-display">
                  <Tag className="w-3 h-3 text-vermilion" />
                  {listing.category}
                </span>

                <span className="px-2.5 py-1 rounded bg-stone-900 text-white text-xs font-medium tracking-wide">
                  Condition: {listing.condition}
                </span>

                <span className="text-xs text-stone-500 font-hand ml-auto flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Pinned {formatDate(listing.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-2xl sm:text-3xl text-ink leading-tight mb-4">
                {listing.title}
              </h1>

              {/* Price & Location Ribbon */}
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-stone-200">
                <PriceTag price={listing.price} size="lg" />

                <div className="font-hand text-sm text-stone-700 flex items-center gap-1.5 bg-amber-100/60 px-3 py-1 rounded border border-amber-200">
                  <MapPin className="w-3.5 h-3.5 text-vermilion" />
                  <span>Pickup: <strong>{listing.hostelArea}</strong></span>
                </div>

                <div className="text-xs text-stone-500 flex items-center gap-1 ml-auto">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{listing.viewsCount} views</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-display font-bold text-sm text-stone-900 uppercase tracking-wider mb-2">
                  Item Description & Condition Notes
                </h3>
                <p className="text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line font-body bg-white/70 p-4 rounded-lg border border-stone-200 shadow-inner">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Pinned Contact Card */}
            <div>
              <ContactSellerBox
                sellerName={listing.sellerName}
                hostelArea={listing.hostelArea}
                contactMethod={listing.contactMethod}
                contactInfo={listing.contactInfo}
                canViewContact={listing.canViewContact}
                listingTitle={listing.title}
                isOwner={listing.isOwner}
                isSold={isSold}
              />

              {/* Report button */}
              <div className="mt-4 flex items-center justify-between text-xs text-stone-500 px-1">
                <span>Have a question? WhatsApp the seller directly.</span>
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="inline-flex items-center gap-1 text-stone-500 hover:text-vermilion transition-colors"
                >
                  <Flag className="w-3 h-3" />
                  <span>Report listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        listingId={listing._id}
        listingTitle={listing.title}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
