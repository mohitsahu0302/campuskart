'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Phone,
  Mail,
  Lock,
  UserCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Pin } from './Pin';

interface ContactSellerBoxProps {
  sellerName: string;
  hostelArea: string;
  contactMethod?: 'whatsapp' | 'email' | 'phone' | null;
  contactInfo?: string | null;
  canViewContact?: boolean;
  listingTitle: string;
  isOwner?: boolean;
  isSold?: boolean;
}

export function ContactSellerBox({
  sellerName,
  hostelArea,
  contactMethod = 'whatsapp',
  contactInfo,
  canViewContact = false,
  listingTitle,
  isOwner = false,
  isSold = false,
}: ContactSellerBoxProps) {
  const { user } = useAuth();

  const cleanPhone = contactInfo ? contactInfo.replace(/[^\d+]/g, '') : '';
  const waPhone = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hi ${sellerName}, saw your CampusKart listing for "${listingTitle}". Is it still available for hostel pickup?`
  )}`;

  return (
    <div className="relative bg-[#FCFBF8] border-2 border-dashed border-stone-300 rounded-lg p-5 shadow-sm">
      <div className="absolute -top-3 left-6">
        <Pin color="brass" />
      </div>

      <div className="flex items-center justify-between mb-3 pt-1">
        <div>
          <span className="font-hand text-xs text-stone-500 uppercase tracking-wider block">
            Seller Business Slip
          </span>
          <h3 className="font-display font-bold text-lg text-ink">
            {sellerName}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
          <UserCheck className="w-3 h-3" />
          Campus Verified
        </span>
      </div>

      <p className="text-xs text-stone-600 mb-4 flex items-center gap-1.5 font-body">
        <MapPin className="w-3.5 h-3.5 text-vermilion" />
        Hostel / Pickup Point: <span className="font-medium text-stone-900">{hostelArea}</span>
      </p>

      {/* State A: Owner of this listing */}
      {isOwner ? (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-center">
          <p className="text-xs font-semibold text-amber-900">
            This is your own pinned notice.
          </p>
          <Link
            href="/dashboard"
            className="text-xs text-vermilion underline font-medium hover:text-vermilion-hover mt-1 inline-block"
          >
            Manage in your Seller Dashboard →
          </Link>
        </div>
      ) : isSold ? (
        <div className="p-3 bg-stone-100 border border-stone-200 rounded text-center">
          <p className="text-xs font-semibold text-stone-700">
            This item has been marked as SOLD.
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            The seller is no longer accepting campus inquiries.
          </p>
        </div>
      ) : user && canViewContact && contactInfo ? (
        /* State B: Logged in & contact info revealed */
        <div className="space-y-2">
          {contactMethod === 'whatsapp' && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1EBE5D] transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          )}

          {contactMethod === 'phone' && (
            <a
              href={`tel:${contactInfo}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {contactInfo}</span>
            </a>
          )}

          {contactMethod === 'email' && (
            <a
              href={`mailto:${contactInfo}?subject=${encodeURIComponent(
                `CampusKart: Inquiry for ${listingTitle}`
              )}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Email: {contactInfo}</span>
            </a>
          )}

          {/* Backup info tag */}
          <div className="p-2 bg-stone-50 border border-stone-200 rounded text-center">
            <span className="text-[11px] text-stone-500 font-mono">
              Direct Contact: <strong className="text-stone-800">{contactInfo}</strong>
            </span>
          </div>
        </div>
      ) : (
        /* State C: Logged out - login gate required */
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-md text-center">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 border border-amber-300">
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-stone-800 mb-1">
            Seller Contact Locked
          </p>
          <p className="text-[11px] text-stone-600 mb-3 leading-relaxed">
            To prevent spam & external calls, contact numbers and WhatsApp links are visible only to verified campus students.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            <span>Log In to Reveal Contact</span>
          </Link>
        </div>
      )}
    </div>
  );
}
