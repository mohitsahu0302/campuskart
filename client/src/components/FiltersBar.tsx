'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Tag,
  MapPin,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { CategoryType, ConditionType, SortType } from '@/lib/types';
import { Tape } from './Tape';

const CATEGORIES: CategoryType[] = [
  'All',
  'Books',
  'Cycles',
  'Gadgets',
  'Hostel Essentials',
  'Furniture',
  'Other',
];

const CONDITIONS: ConditionType[] = ['All', 'New', 'Like new', 'Good', 'Fair'];

const HOSTEL_OPTIONS = [
  'All',
  'Hostel 4',
  'Hostel 9',
  'Sarojini Bhawan',
  'Kasturba Bhawan',
  'Hostel 7',
  'Main Academic Block',
  'Faculty Enclave',
];

export function FiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query values
  const urlQ = searchParams.get('q') || '';
  const urlCategory = (searchParams.get('category') as CategoryType) || 'All';
  const urlCondition = (searchParams.get('condition') as ConditionType) || 'All';
  const urlHostel = searchParams.get('hostelArea') || 'All';
  const urlMinPrice = searchParams.get('minPrice') || '';
  const urlMaxPrice = searchParams.get('maxPrice') || '';
  const urlSort = (searchParams.get('sort') as SortType) || 'newest';
  const urlStatus = searchParams.get('status') || 'active';

  const [searchTerm, setSearchTerm] = useState(urlQ);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);

  // Sync state with URL when back/forward is used
  useEffect(() => {
    setSearchTerm(urlQ);
  }, [urlQ]);

  // Update URL helper
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination to page 1 whenever filters change
    params.delete('page');

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'All') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ q: searchTerm.trim() || null });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    urlQ ||
      (urlCategory && urlCategory !== 'All') ||
      (urlCondition && urlCondition !== 'All') ||
      (urlHostel && urlHostel !== 'All') ||
      urlMinPrice ||
      urlMaxPrice ||
      urlSort !== 'newest' ||
      urlStatus !== 'active'
  );

  return (
    <div className="w-full mb-8">
      {/* Category Tabs (Index Card Dividers) */}
      <div className="flex items-end gap-1 sm:gap-2 overflow-x-auto pb-0 pt-2 px-1 scrollbar-none border-b-2 border-stone-300">
        {CATEGORIES.map((cat) => {
          const isActive = urlCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => updateQuery({ category: cat })}
              className={`relative px-3 sm:px-4 py-2 font-display text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-t border-x whitespace-nowrap select-none ${
                isActive
                  ? 'bg-[#FAF6EE] text-vermilion border-stone-300 font-bold -mb-[2px] pb-2.5 z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.04)] border-b-2 border-b-[#FAF6EE]'
                  : 'bg-[#EBE2D3]/80 text-stone-600 border-stone-300/80 hover:bg-[#F2ECE0] hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Filter Strip (Paper Note) */}
      <div className="bg-[#FAF6EE] border-x border-b border-stone-300 p-4 sm:p-5 rounded-b-lg shadow-sm">
        {/* Search & Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar styled like paper note with tape */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 flex items-center bg-white border border-stone-300 rounded shadow-inner"
          >
            <Tape angle="straight" className="hidden sm:block opacity-60" />
            <Search className="w-4 h-4 text-stone-400 ml-3.5 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notices (e.g. 'CLRS', 'Hero sprint', 'Kettle', 'Router')..."
              className="w-full py-2.5 px-3 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 font-body focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  updateQuery({ q: null });
                }}
                className="p-1 mr-2 text-stone-400 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-stone-100 font-body text-xs sm:text-sm font-semibold hover:bg-vermilion transition-colors rounded-r"
            >
              Search
            </button>
          </form>

          {/* Toggle More Filters */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFiltersSheet(!showFiltersSheet)}
              className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded border text-xs sm:text-sm font-medium transition-colors ${
                showFiltersSheet || hasActiveFilters
                  ? 'bg-amber-100/70 border-amber-300 text-stone-900'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-vermilion" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-vermilion" />
              )}
            </button>

            {/* Quick Sort Dropdown */}
            <div className="relative">
              <select
                value={urlSort}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="appearance-none bg-white border border-stone-300 py-2.5 pl-3 pr-8 rounded text-xs sm:text-sm text-stone-800 font-body cursor-pointer focus:outline-none focus:border-vermilion"
                aria-label="Sort listings"
              >
                <option value="newest">Latest pinned</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="oldest">Oldest pinned</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="p-2.5 text-stone-500 hover:text-vermilion transition-colors"
                title="Reset all filters"
                aria-label="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Detailed Filters Drawer / Dropdown */}
        {showFiltersSheet && (
          <div className="mt-4 pt-4 border-t border-stone-300/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in-50 duration-200">
            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider font-display">
                Condition
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CONDITIONS.map((cond) => {
                  const isActive = urlCondition === cond;
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => updateQuery({ condition: cond })}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                        isActive
                          ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hostel / Campus Area */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider font-display">
                Hostel / Area
              </label>
              <div className="relative">
                <select
                  value={urlHostel}
                  onChange={(e) => updateQuery({ hostelArea: e.target.value })}
                  className="w-full appearance-none bg-white border border-stone-300 py-1.5 pl-3 pr-8 rounded text-xs text-stone-800 font-body focus:outline-none"
                >
                  {HOSTEL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <MapPin className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider font-display">
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={urlMinPrice}
                  onChange={(e) => updateQuery({ minPrice: e.target.value })}
                  className="w-1/2 bg-white border border-stone-300 py-1 px-2.5 rounded text-xs text-stone-800 focus:outline-none"
                  min="0"
                />
                <span className="text-stone-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={urlMaxPrice}
                  onChange={(e) => updateQuery({ maxPrice: e.target.value })}
                  className="w-1/2 bg-white border border-stone-300 py-1 px-2.5 rounded text-xs text-stone-800 focus:outline-none"
                  min="0"
                />
              </div>
            </div>

            {/* Listing Status Toggle */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider font-display">
                Status
              </label>
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    updateQuery({
                      status: urlStatus === 'all' ? 'active' : 'all',
                    })
                  }
                  className={`text-xs px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
                    urlStatus === 'all'
                      ? 'bg-amber-700 text-white border-amber-800'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>
                    {urlStatus === 'all'
                      ? 'Showing All (incl. Sold)'
                      : 'Active Only'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
