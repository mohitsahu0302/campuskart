'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Pin } from '@/components/Pin';
import { Tape } from '@/components/Tape';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      toast('Welcome back to CampusKart notice board!', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('campuspassword123');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto my-8 sm:my-12 px-2">
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
            Log In to CampusKart
          </h1>
          <p className="text-xs text-ink-subtle mt-1 font-body">
            Access seller contact links, save notices, and pin your own items.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-vermilion" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
              Campus Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@campus.edu"
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-vermilion"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 font-display uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded text-sm text-stone-900 focus:outline-none focus:border-vermilion"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-md bg-vermilion text-white font-semibold text-sm hover:bg-vermilion-hover disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Checking board...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Credentials Autofill Block */}
        <div className="mt-6 pt-5 border-t border-stone-200/80">
          <p className="font-hand text-xs text-stone-500 mb-2 text-center">
            ⚡ Quick Demo Accounts (One-Click Fill):
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoFill('aravind@campus.edu')}
              className="text-left text-xs px-2.5 py-1.5 rounded bg-white/80 border border-stone-200 hover:bg-amber-100/50 hover:border-amber-300 transition-colors flex items-center justify-between"
            >
              <span>
                <strong>Aravind Sharma</strong> (Hostel 4)
              </span>
              <span className="text-[11px] text-stone-400 font-mono">Fill</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('ananya.r@campus.edu')}
              className="text-left text-xs px-2.5 py-1.5 rounded bg-white/80 border border-stone-200 hover:bg-amber-100/50 hover:border-amber-300 transition-colors flex items-center justify-between"
            >
              <span>
                <strong>Ananya Rao</strong> (Sarojini Bhawan)
              </span>
              <span className="text-[11px] text-stone-400 font-mono">Fill</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-stone-600 font-body">
          Don&apos;t have an account on this noticeboard?{' '}
          <Link
            href="/signup"
            className="font-semibold text-vermilion hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
