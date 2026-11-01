'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Eye,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { listingsApi } from '@/lib/api';
import { Listing } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Pin } from '@/components/Pin';
import { Tape } from '@/components/Tape';

export default function SellerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sold'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await listingsApi.getMyListings();
      if (res.success && res.data.listings) {
        setMyListings(res.data.listings);
      }
    } catch (err: any) {
      toast(err.message || 'Failed to load your pinned notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto my-12 text-center">
        <p className="font-hand text-lg text-stone-500">
          Loading your student board...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#FAF6EE] border-2 border-dashed border-stone-300 rounded-xl shadow-sm">
        <Pin color="vermilion" className="mb-2" />
        <h2 className="font-display font-bold text-2xl text-ink mb-2">
          Dashboard Locked
        </h2>
        <p className="text-xs text-ink-subtle mb-6">
          Please log in to manage your pinned notices and monitor views.
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

  const handleToggleSold = async (id: string) => {
    try {
      const res = await listingsApi.toggleSold(id);
      if (res.success && res.data.listing) {
        setMyListings((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: res.data.listing.status } : item
          )
        );
        toast(res.message, 'success');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to tear down this notice from the board?'
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await listingsApi.deleteListing(id);
      if (res.success) {
        setMyListings((prev) => prev.filter((item) => item._id !== id));
        toast('Notice removed from the campus board.', 'success');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to delete listing', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredListings = myListings.filter((item) => {
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'sold') return item.status === 'sold';
    return true;
  });

  const activeCount = myListings.filter((i) => i.status === 'active').length;
  const soldCount = myListings.filter((i) => i.status === 'sold').length;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Profile Notice Board Header */}
      <div className="relative bg-[#FAF6EE] border border-stone-300 rounded-xl p-6 sm:p-8 mb-8 shadow-sm">
        <Tape angle="straight" className="top-0 left-1/2 -translate-x-1/2 opacity-75" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-hand text-xs text-stone-500 uppercase tracking-wider">
                Seller Slip Board
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink">
              {user.name}&apos;s Dashboard
            </h1>
            <p className="text-xs text-stone-600 font-body mt-1">
              🎓 {user.email} • 📍 {user.hostelArea}
            </p>
          </div>

          <Link
            href="/sell"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-vermilion text-white font-body font-semibold text-sm hover:bg-vermilion-hover shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pin Another Notice</span>
          </Link>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-stone-300/80">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold font-display transition-colors ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Notices ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded text-xs font-semibold font-display transition-colors ${
              activeTab === 'active'
                ? 'bg-emerald-800 text-white'
                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-3 py-1.5 rounded text-xs font-semibold font-display transition-colors ${
              activeTab === 'sold'
                ? 'bg-red-800 text-white'
                : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            Marked Sold ({soldCount})
          </button>
        </div>
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-[#FCFBF8] border border-stone-200 rounded-lg p-4"
            />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-[#FAF6EE] border-2 border-dashed border-stone-300 rounded-xl p-8 text-center my-8">
          <Pin color="vermilion" className="mb-2" />
          <h3 className="font-display font-bold text-xl text-ink mb-1">
            No notices found in this folder.
          </h3>
          <p className="text-xs text-stone-600 mb-4 font-body">
            {activeTab === 'all'
              ? 'Got a cycle, textbooks, or room equipment you want to sell?'
              : `You have no ${activeTab} notices.`}
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-hover shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pin your first item</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((item) => {
            const isSold = item.status === 'sold';
            const img =
              item.images && item.images.length > 0
                ? item.images[0]
                : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item._id}
                className={`relative bg-[#FCFBF8] border rounded-lg p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isSold
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-stone-300 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                    <Image
                      src={img}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className={`object-cover ${isSold ? 'grayscale-[60%]' : ''}`}
                    />
                    {isSold && (
                      <span className="absolute inset-0 bg-red-900/40 text-white font-display font-bold text-[10px] tracking-widest flex items-center justify-center uppercase">
                        SOLD
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-stone-500 font-hand flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="text-[10px] text-stone-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.viewsCount} views
                      </span>
                    </div>

                    <Link
                      href={`/item/${item._id}`}
                      className="font-display font-bold text-base sm:text-lg text-ink hover:text-vermilion transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>

                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="font-display font-bold text-sm text-vermilion">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-xs text-stone-500">
                        Condition: <strong>{item.condition}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Mark as sold toggle button */}
                  <button
                    onClick={() => handleToggleSold(item._id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                      isSold
                        ? 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                        : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    }`}
                    title={isSold ? 'Re-activate notice' : 'Mark notice as sold'}
                  >
                    {isSold ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                        <span>Re-list</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Mark Sold</span>
                      </>
                    )}
                  </button>

                  {/* Edit button */}
                  <Link
                    href={`/edit/${item._id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="p-1.5 rounded text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete notice"
                    aria-label="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
