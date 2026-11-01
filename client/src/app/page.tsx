'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, ArrowDownCircle, RefreshCw } from 'lucide-react';
import { Listing, Pagination, FilterState, CategoryType, ConditionType, SortType } from '@/lib/types';
import { listingsApi } from '@/lib/api';
import { ListingCard } from '@/components/ListingCard';
import { FiltersBar } from '@/components/FiltersBar';
import { EmptyNoticeBoard } from '@/components/EmptyNoticeBoard';
import { NoticeBoardSkeleton } from '@/components/NoticeBoardSkeleton';
import { Pin } from '@/components/Pin';

function NoticeBoardFeed() {
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract filter parameters from URL
  const q = searchParams.get('q') || '';
  const category = (searchParams.get('category') as CategoryType) || 'All';
  const condition = (searchParams.get('condition') as ConditionType) || 'All';
  const hostelArea = searchParams.get('hostelArea') || 'All';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = (searchParams.get('sort') as SortType) || 'newest';
  const status = (searchParams.get('status') as 'active' | 'sold' | 'all') || 'active';

  const fetchListings = useCallback(
    async (pageToLoad = 1, append = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const filterPayload: Partial<FilterState> = {
          q: q || undefined,
          category: category !== 'All' ? category : undefined,
          condition: condition !== 'All' ? condition : undefined,
          hostelArea: hostelArea !== 'All' ? hostelArea : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          status,
        };

        const res = await listingsApi.getListings(filterPayload, pageToLoad, 12);
        if (res.success) {
          if (append) {
            setListings((prev) => [...prev, ...res.data.items]);
          } else {
            setListings(res.data.items);
          }
          setPagination(res.data.pagination);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load notices from board');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [q, category, condition, hostelArea, minPrice, maxPrice, sort, status]
  );

  useEffect(() => {
    fetchListings(1, false);
  }, [fetchListings]);

  const handleLoadMore = () => {
    if (pagination && pagination.hasNext && !loadingMore) {
      fetchListings(pagination.page + 1, true);
    }
  };

  const isFiltered = Boolean(
    q ||
      category !== 'All' ||
      condition !== 'All' ||
      hostelArea !== 'All' ||
      minPrice ||
      maxPrice ||
      sort !== 'newest' ||
      status !== 'active'
  );

  return (
    <>
      {/* Filter and Search Bar with URL Query State */}
      <FiltersBar />

      {/* Notice Board Feed Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
            Pinned Notices
          </h2>
          {pagination && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100/90 text-stone-800 border border-amber-300 font-body">
              {pagination.total} {pagination.total === 1 ? 'slip' : 'slips'}
            </span>
          )}
        </div>

        <button
          onClick={() => fetchListings(1, false)}
          className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors rounded hover:bg-stone-200/50"
          title="Refresh notice board"
          aria-label="Refresh notice board"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Board Grid or Loading/Empty State */}
      {loading ? (
        <NoticeBoardSkeleton />
      ) : error ? (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-semibold mb-2">{error}</p>
          <button
            onClick={() => fetchListings(1, false)}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : listings.length === 0 ? (
        <EmptyNoticeBoard
          isFiltered={isFiltered}
          onReset={() => fetchListings(1, false)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {listings.map((item, index) => (
              <ListingCard
                key={item._id}
                listing={item}
                priority={index < 4}
              />
            ))}
          </div>

          {/* Load More Button */}
          {pagination && pagination.hasNext && (
            <div className="text-center mt-12 mb-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF5EB] text-ink font-display font-bold text-sm sm:text-base border-2 border-stone-300 rounded-lg shadow-sm hover:bg-[#F3ECE0] hover:border-stone-400 hover:shadow-md transition-all active:translate-y-0.5 disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-vermilion" />
                    <span>Pulling more slips from the board...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownCircle className="w-5 h-5 text-vermilion" />
                    <span>Load More Pinned Slips</span>
                  </>
                )}
              </button>
              <p className="text-xs text-stone-500 font-hand mt-2">
                Showing {listings.length} of {pagination.total} notices
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function NoticeBoardPage() {
  return (
    <div className="w-full">
      {/* Hero Notice Banner */}
      <section className="relative mb-8 text-center sm:text-left bg-[#FAF6EE] p-6 sm:p-8 rounded-xl border border-stone-300 shadow-sm overflow-hidden">
        <div className="absolute top-2 right-4 hidden sm:block">
          <Pin color="brass" />
        </div>
        <div className="absolute top-2 left-4 hidden sm:block">
          <Pin color="vermilion" />
        </div>

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-vermilion" />
            <span>Campus Notice Board</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-ink tracking-tight leading-[1.1] mb-3">
            Semester clearout season.{' '}
            <span className="text-vermilion squiggle-underline">
              Second-hand,
            </span>{' '}
            first-class.
          </h1>

          <p className="text-sm sm:text-base text-ink-subtle font-body max-w-xl leading-relaxed mb-4">
            Passed down from graduating seniors to freshers. Cycles, engineering books,
            heaters, and room gear pinned straight to the board with zero commissions.
          </p>

          <div className="flex flex-wrap items-center gap-3 font-hand text-base text-stone-600">
            <span className="px-2 py-0.5 bg-white border border-stone-300 rounded transform -rotate-1">
              ✏️ In-person hostel handovers
            </span>
            <span className="px-2 py-0.5 bg-white border border-stone-300 rounded transform rotate-1">
              ⚡ Instant WhatsApp chat
            </span>
            <span className="px-2 py-0.5 bg-white border border-stone-300 rounded transform -rotate-0.5">
              🎓 Verified student emails only
            </span>
          </div>
        </div>
      </section>

      {/* Feed wrapped in Suspense for useSearchParams */}
      <Suspense fallback={<NoticeBoardSkeleton />}>
        <NoticeBoardFeed />
      </Suspense>
    </div>
  );
}
