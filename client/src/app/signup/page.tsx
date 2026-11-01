'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Pin } from '@/components/Pin';
import { Tape } from '@/components/Tape';

const HOSTEL_OPTIONS = [
  'Hostel 4 (C-Block)',
  'Hostel 9 (Mess Side)',
  'Sarojini Bhawan (Block B)',
  'Kasturba Bhawan',
  'Hostel 7 (Boys)',
  'Hostel 12 (New Wing)',
  'Faculty & Scholar Apartments',
  'Campus Day Scholar',
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hostelArea: HOSTEL_OPTIONS[0],
    roomNumber: '',
    phone: '',
    whatsappNumber: '',
    preferredContactMethod: 'whatsapp' as 'whatsapp' | 'email' | 'phone',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(formData);
      toast('Welcome to CampusKart! Your student slip is active.', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 sm:my-10 px-2">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Notice Board</span>
      </Link>

      <div className="relative bg-[#FAF6EE] border-2 border-stone-300 rounded-xl p-6 sm:p-8 shadow-md">
        <Tape angle="straight" className="top-0 left-1/2 -translate-x-1/2 opacity-80" />

        <div className="text-center mb-6">
          <div className="inline-block mb-1">
            <Pin color="vermilion" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink">
            Join the Campus Board
          </h1>
          <p className="text-xs text-ink-subtle mt-1 font-body">
            Create your student profile to buy and pin second-hand goods.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-vermilion" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Rohan Verma"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Campus Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="rohan@campus.edu"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
              Password (min. 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Hostel / Area *
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

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Room Number (optional)
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                placeholder="e.g. 314"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900 focus:outline-none focus:border-vermilion"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
              Preferred Contact Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, preferredContactMethod: method })
                  }
                  className={`py-1.5 px-2 rounded border text-xs capitalize transition-colors ${
                    formData.preferredContactMethod === method
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-md bg-vermilion text-white font-semibold text-sm hover:bg-vermilion-hover disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating profile...' : 'Join Noticeboard'}</span>
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-600 font-body">
          Already registered on the board?{' '}
          <Link
            href="/login"
            className="font-semibold text-vermilion hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
