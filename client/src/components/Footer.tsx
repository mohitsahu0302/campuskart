import React from 'react';
import Link from 'next/link';
import { Pin } from './Pin';

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-stone-300 bg-[#FAF5EB] text-ink py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Board Motto */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Pin color="vermilion" />
              <h4 className="font-display font-bold text-xl text-ink">
                CampusKart
              </h4>
            </div>
            <p className="text-sm text-ink-subtle leading-relaxed font-body">
              The digital corkboard outside the hostel mess. Buy and sell textbooks,
              second-hand cycles, room coolers, and induction stoves from fellow students
              without brokers, middle-men, or spam.
            </p>
          </div>

          {/* Column 2: Hostel Board Rules */}
          <div className="bg-amber-50/80 p-4 rounded-lg border border-amber-200/80 shadow-sm relative">
            <span className="font-hand font-bold text-base text-vermilion mb-1 block">
              📌 Hostel Mess Board Etiquette
            </span>
            <ul className="text-xs text-stone-700 space-y-1.5 font-body">
              <li>• Once sold, mark your slip as sold so folks stop calling you during lectures.</li>
              <li>• No price gouging on immersion rods during December end-sems.</li>
              <li>• Meet in public campus spots (Nescafe, Central Library, Mess gate) for handovers.</li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h5 className="font-display font-semibold text-sm uppercase tracking-wider text-stone-800 mb-3">
              Campus Corners
            </h5>
            <ul className="space-y-2 text-sm text-stone-600 font-body">
              <li>
                <Link
                  href="/?category=Books"
                  className="hover:text-vermilion transition-colors"
                >
                  Textbooks & Exam Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Cycles"
                  className="hover:text-vermilion transition-colors"
                >
                  Campus Cycles & MTBs
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Hostel%20Essentials"
                  className="hover:text-vermilion transition-colors"
                >
                  Hostel Electronics & Appliances
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  className="hover:text-vermilion transition-colors font-medium text-vermilion"
                >
                  + Pin an item for sale
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-stone-300/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-body gap-2">
          <p>© 2026 CampusKart. Built for students, powered by campus chai.</p>
          <p className="font-hand text-sm text-stone-600">
            Hand-pinned with love outside Mess 2
          </p>
        </div>
      </div>
    </footer>
  );
}
