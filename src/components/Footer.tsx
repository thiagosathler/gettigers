'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#2B2D2F] text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-700/60">
          {/* Brand & Mascot */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-md">
                <Image
                  src="/mascot.jpg"
                  alt="Tiger in Blazer Mascot"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">
                  Get<span className="text-[#F26419]">Tigers</span>
                  <span className="text-xs ml-1 text-orange-400 font-bold">.net</span>
                </span>
                <span className="text-xs text-gray-400">Florida's Autonomous Pro Marketplace</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed">
              Connecting Florida homeowners, vacation rental managers, and local businesses with verified, independent handymen, cleaners, and contractors. Free leads, direct WhatsApp & SMS connection, zero middleman fees.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              Empowering autonomous and informal workers across the Sunshine State.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-4">Top Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/request?category=house-cleaning" className="hover:text-orange-400 transition">House & Airbnb Cleaning</Link></li>
              <li><Link href="/request?category=handyman" className="hover:text-orange-400 transition">Handyman & Repairs</Link></li>
              <li><Link href="/request?category=landscaping" className="hover:text-orange-400 transition">Lawn Care & Landscaping</Link></li>
              <li><Link href="/request?category=painting" className="hover:text-orange-400 transition">Painting & Drywall</Link></li>
              <li><Link href="/request?category=moving" className="hover:text-orange-400 transition">Moving & Hauling</Link></li>
            </ul>
          </div>

          {/* Florida Coverage */}
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-4">Key Florida Regions</h4>
            <p className="text-xs text-gray-300 leading-loose">
              Orlando • Kissimmee • MetroWest • Lake Nona • Miami • Doral • Fort Lauderdale • Boca Raton • Delray Beach • Tampa • St. Petersburg • Jacksonville
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <Link
                href="/join"
                className="inline-block text-xs font-bold text-orange-400 hover:text-orange-300 underline"
              >
                Become a Tiger Pro (Free Onboarding) &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {currentYear} GetTigers.net — All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for the Florida community with</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>in English, Português & Español</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
