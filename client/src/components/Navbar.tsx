'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PlusCircle,
  Bookmark,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Pin } from './Pin';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, savedListings } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const savedCount = savedListings.length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b-2 border-stone-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with notice-board cork vibe */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="relative">
              <Pin color="vermilion" className="transform -rotate-12" />
            </div>
            <div>
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink group-hover:text-vermilion transition-colors">
                CampusKart
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-hand text-stone-500 tracking-wide">
                • Hostel Mess Notice Board
              </span>
            </div>
          </Link>

          {/* Desktop Right Actions */}
          <nav className="hidden md:flex items-center gap-4">
            {/* Saved Wishlist */}
            <Link
              href="/saved"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                pathname === '/saved'
                  ? 'bg-amber-100/80 border-amber-300 text-stone-900 font-semibold'
                  : 'bg-white/80 border-stone-300/80 text-stone-700 hover:bg-white hover:text-stone-900'
              }`}
            >
              <Bookmark className="w-4 h-4 text-vermilion" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-xs font-bold bg-vermilion text-white rounded-full">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* Post Notice CTA */}
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-vermilion text-white font-body font-semibold text-sm hover:bg-vermilion-hover shadow-[0_2px_6px_rgba(212,66,30,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pin a Notice</span>
            </Link>

            {/* User Session Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-stone-300 text-sm font-medium text-stone-800 hover:bg-stone-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-vermilion-light text-vermilion font-display font-bold flex items-center justify-center text-xs border border-vermilion/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-[#FAF6EE] rounded-lg shadow-lg border border-stone-300 py-1.5 z-50 animate-in fade-in-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-200">
                      <p className="text-xs text-stone-500 font-hand">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {user.email}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        📍 {user.hostelArea}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-100/60 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-stone-500" />
                      <span>My Pinned Notices</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-sm font-semibold rounded bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
                >
                  Join Board
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/sell"
              className="p-2 rounded bg-vermilion text-white shadow-sm"
              aria-label="Pin a notice"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-stone-300 text-stone-700 bg-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-300 flex flex-col gap-3 animate-in fade-in-50">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-200/50 rounded"
            >
              Browse All Notices
            </Link>

            <Link
              href="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-200/50 rounded"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-vermilion" />
                <span>Saved Items</span>
              </div>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-vermilion text-white rounded-full">
                  {savedCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-200/50 rounded"
                >
                  <LayoutDashboard className="w-4 h-4 text-stone-500" />
                  <span>My Pinned Notices</span>
                </Link>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between px-3">
                  <span className="text-xs text-stone-500 truncate">
                    {user.email}
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="text-xs font-semibold text-vermilion"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium rounded border border-stone-300 bg-white text-stone-800"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold rounded bg-stone-900 text-stone-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
