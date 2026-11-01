'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
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

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const id = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Books' as CategoryType,
    condition: 'Good' as ConditionType,
    price: '',
    hostelArea: HOSTEL_OPTIONS[0],
    description: '',
    contactMethod: 'whatsapp' as 'whatsapp' | 'email' | 'phone',
    contactInfo: '',
    images: [] as string[],
    status: 'active' as 'active' | 'sold',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await listingsApi.getListing(id);
        if (res.success && res.data.listing) {
          const l = res.data.listing;
          setFormData({
            title: l.title,
            category: l.category,
            condition: l.condition,
            price: l.price.toString(),
            hostelArea: l.hostelArea,
            description: l.description,
            contactMethod: l.contactMethod || 'whatsapp',
            contactInfo: l.contactInfo || '',
            images: l.images || [],
            status: l.status,
          });
        }
      } catch (err: any) {
        setError(err.message || 'Could not load listing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (authLoading || loading) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center">
        <p className="font-hand text-lg text-stone-500">
          Loading notice slip...
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (formData.images.length === 0) {
      setError('Please keep at least 1 image.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await listingsApi.updateListing(id, {
        ...formData,
        price: Number(formData.price),
      });

      if (res.success) {
        toast('Notice updated successfully!', 'success');
        router.push(`/item/${id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update notice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-10 px-2 pb-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Pinned Notices</span>
      </Link>

      <div className="relative bg-[#FAF6EE] border border-stone-300 rounded-xl p-6 sm:p-8 shadow-sm">
        <Tape angle="straight" className="top-0 left-1/2 -translate-x-1/2 opacity-80" />

        <div className="text-center mb-6">
          <div className="inline-block mb-1">
            <Pin color="brass" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink">
            Edit Pinned Notice
          </h1>
          <p className="text-xs text-ink-subtle mt-1 font-body">
            Update pricing, photos, or condition notes for campus buyers.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-vermilion" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photos */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5 font-display uppercase tracking-wider">
              Photos (Max 5) *
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
                Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
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
              Description & Notes *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
            />
          </div>

          {/* Listing Status Radio */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5 font-display uppercase tracking-wider">
              Notice Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={() => setFormData({ ...formData, status: 'active' })}
                  className="accent-vermilion"
                />
                <span>Active (Accepting inquiries)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="sold"
                  checked={formData.status === 'sold'}
                  onChange={() => setFormData({ ...formData, status: 'sold' })}
                  className="accent-red-600"
                />
                <span>Marked as SOLD</span>
              </label>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-lg">
            <span className="font-hand text-sm text-stone-700 block mb-2 font-bold">
              📞 Preferred Contact Info
            </span>
            <input
              type="text"
              required
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-md bg-stone-900 text-white font-display font-bold text-base hover:bg-stone-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving changes...' : 'Save Updated Notice'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
