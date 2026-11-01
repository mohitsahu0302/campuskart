'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { listingsApi } from '@/lib/api';
import { CategoryType, ConditionType } from '@/lib/types';
import { ImageUploadDropzone } from '@/components/ImageUploadDropzone';
import { Pin } from '@/components/Pin';
import { Tape } from '@/components/Tape';

const CATEGORIES: CategoryType[] = [
  'Books',
  'Cycles',
  'Gadgets',
  'Hostel Essentials',
  'Furniture',
  'Other',
];

const CONDITIONS: ConditionType[] = ['Like new', 'Good', 'Fair', 'New'];

const HOSTEL_OPTIONS = [
  'Hostel 4 (C-Block)',
  'Hostel 9 (Mess Side)',
  'Sarojini Bhawan (Block B)',
  'Kasturba Bhawan',
  'Hostel 7 (Boys)',
  'Hostel 12 (New Wing)',
  'Faculty & Scholar Apartments',
  'Main Academic Block / Nescafe',
  'Campus Day Scholar',
];

export default function SellItemPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0] as CategoryType,
    condition: 'Good' as ConditionType,
    price: '',
    hostelArea: HOSTEL_OPTIONS[0],
    description: '',
    contactMethod: 'whatsapp' as 'whatsapp' | 'email' | 'phone',
    contactInfo: '',
    images: [] as string[],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill user hostel & contact info when user loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        hostelArea: user.hostelArea || HOSTEL_OPTIONS[0],
        contactMethod: user.preferredContactMethod || 'whatsapp',
        contactInfo:
          user.preferredContactMethod === 'whatsapp'
            ? user.whatsappNumber || user.phone || user.email
            : user.preferredContactMethod === 'phone'
            ? user.phone || user.whatsappNumber || user.email
            : user.email,
      }));
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center">
        <p className="font-hand text-lg text-stone-500">
          Checking your campus ID slip...
        </p>
      </div>
    );
  }

  // Not logged in gate
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-[#FAF6EE] border-2 border-dashed border-stone-300 rounded-xl shadow-sm">
        <Pin color="vermilion" className="mb-2" />
        <h2 className="font-display font-bold text-2xl text-ink mb-2">
          Notice Pinning Requires Login
        </h2>
        <p className="text-xs text-ink-subtle mb-6 leading-relaxed">
          To maintain campus safety and prevent spam notices, only authenticated students can pin items for sale.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-hover shadow-sm"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded bg-white border border-stone-300 text-xs font-semibold text-stone-800 hover:bg-stone-50"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (formData.images.length === 0) {
      setError('Please add at least 1 photo of your item.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await listingsApi.createListing({
        ...formData,
        price: Number(formData.price),
      });

      if (res.success && res.data.listing) {
        toast('Notice pinned to the board successfully!', 'success');
        router.push(`/item/${res.data.listing._id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to pin notice. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-10 px-2 pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Notice Board</span>
      </Link>

      <div className="relative bg-[#FAF6EE] border border-stone-300 rounded-xl p-6 sm:p-8 shadow-sm">
        <Tape angle="straight" className="top-0 left-1/2 -translate-x-1/2 opacity-80" />

        <div className="text-center mb-6">
          <div className="inline-block mb-1">
            <Pin color="vermilion" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink">
            Pin a Notice for Sale
          </h1>
          <p className="text-xs text-ink-subtle mt-1 font-body">
            Post an index slip on the campus board. Direct buyer WhatsApp/call.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-vermilion" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photos Upload Section */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5 font-display uppercase tracking-wider">
              Item Photos (Up to 5 images) *
            </label>
            <ImageUploadDropzone
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
              maxImages={5}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
              Notice Title *
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={120}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Hero Sprint 21-speed, 1 yr old with lock"
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-vermilion"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as CategoryType,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as ConditionType,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Expected Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="e.g. 1200"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Hostel / Handover Point *
              </label>
              <select
                value={formData.hostelArea}
                onChange={(e) =>
                  setFormData({ ...formData, hostelArea: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              >
                {HOSTEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
              Description & Notes for Buyers *
            </label>
            <textarea
              required
              rows={4}
              minLength={10}
              maxLength={2500}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="State any wear and tear, whether price is negotiable, pickup timings near mess..."
              className="w-full p-3 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
            />
          </div>

          {/* Contact Details preference */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-lg">
            <span className="font-hand text-sm text-stone-700 block mb-2 font-bold">
              📞 How should interested students reach you?
            </span>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, contactMethod: method })
                  }
                  className={`py-1.5 px-2 rounded border text-xs capitalize transition-colors ${
                    formData.contactMethod === method
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {method === 'whatsapp' ? 'WhatsApp' : method}
                </button>
              ))}
            </div>

            <input
              type="text"
              required
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              placeholder={
                formData.contactMethod === 'whatsapp'
                  ? 'WhatsApp number (e.g. +91 98765 43210)'
                  : formData.contactMethod === 'phone'
                  ? 'Phone number (e.g. +91 98765 43210)'
                  : 'Email address'
              }
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              * Protected: Only visible to signed-in students on campus.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-md bg-vermilion text-white font-display font-bold text-base hover:bg-vermilion-hover disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>
              {submitting ? 'Tacking notice to the board...' : 'Pin Notice to Board'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
