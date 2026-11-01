'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, ArrowLeft, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { userApi } from '@/lib/api';
import { Listing } from '@/lib/types';
import { ListingCard } from '@/components/ListingCard';
import { Pin } from '@/components/Pin';
import { Tape } from '@/components/Tape';

export default function SavedItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [savedItems, setSavedItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await userApi.getSaved();
      if (res.success && res.data.savedListings) {
        setSavedItems(res.data.savedListings);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to load saved slips', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSaved();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center">
        <p className="font-hand text-lg text-stone-500">
          Unpinning your saved notices...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#FAF6EE] border-2 border-dashed border-stone-300 rounded-xl shadow-sm">
        <Pin color="vermilion" className="mb-2" />
        <h2 className="font-display font-bold text-2xl text-ink mb-2">
          Saved Board Locked
        </h2>
        <p className="text-xs text-ink-subtle mb-6">
          Sign in to bookmark campus gear, textbooks, and cycles for later.
        </p>
        <Link
          href="/login"
          className="px-4 py-2 rounded bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-hover shadow-sm"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Notice Board</span>
      </Link>

      {/* Header */}
      <div className="relative bg-[#FAF6EE] border border-stone-300 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
        <Tape angle="straight" className="top-0 left-1/2 -translate-x-1/2 opacity-75" />

        <div className="flex items-center gap-3">
          <div className="p-3 bg-vermilion-light text-vermilion rounded-lg border border-vermilion/30">
            <Bookmark className="w-6 h-6 fill-vermilion" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink">
              Your Saved Notices
            </h1>
            <p className="text-xs text-stone-600 font-body mt-0.5">
              Notices you bookmarked from the mess board.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] bg-[#FCFBF8] border border-stone-200 rounded-md"
            />
          ))}
        </div>
      ) : savedItems.length === 0 ? (
        <div className="bg-[#FAF6EE] border-2 border-dashed border-stone-300 rounded-xl p-8 text-center my-8 max-w-lg mx-auto">
          <Pin color="brass" className="mb-2" />
          <h3 className="font-display font-bold text-xl text-ink mb-2">
            No notices saved yet.
          </h3>
          <p className="text-xs text-stone-600 mb-6 font-body leading-relaxed">
            Click the bookmark ribbon on any index card on the main board to save
            it here for easy tracking before mid-terms.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Browse Notice Board
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {savedItems.map((item) => (
            <ListingCard key={item._id} listing={item} />
          ))}
        </div>
      )}
    </div>
  );
}
