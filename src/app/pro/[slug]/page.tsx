import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  Star,
  ShieldCheck,
  MapPin,
  Globe,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default async function ProProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const pro = await prisma.proProfile.findUnique({
    where: { slug },
    include: {
      categories: {
        include: { category: true },
      },
      portfolio: {
        orderBy: { createdAt: 'desc' },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!pro) {
    notFound();
  }

  const spokenLanguages = pro.languages.split(',').map((l) => l.trim());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8">
        
        {/* Avatar */}
        <div className="relative w-28 h-28 sm:w-36 sm:aspect-square rounded-3xl overflow-hidden border-4 border-orange-500 shadow-lg shrink-0">
          <Image
            src={pro.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
            alt={pro.businessName}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-3xl font-black text-[#2B2D2F]">
              {pro.businessName}
            </h1>
            {pro.verified && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Tiger
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-gray-600">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-gray-900 font-bold">{pro.ratingAverage.toFixed(1)}</span>
              <span className="text-gray-400">({pro.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{pro.baseCity}, FL ({pro.baseZipCode}) • Up to {pro.serviceRadiusMiles} miles</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 max-w-2xl leading-relaxed pt-1">
            {pro.bio}
          </p>

          {/* Languages Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-bold text-gray-400 mr-1">Languages:</span>
            {spokenLanguages.map((lang) => (
              <span
                key={lang}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200"
              >
                {lang === 'EN' ? '🇺🇸 English' : lang === 'PT' ? '🇧🇷 Português' : '🇪🇸 Español'}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Action Box */}
        <div className="shrink-0 w-full md:w-56 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col gap-2.5">
          <Link
            href={`/request?zip=${pro.baseZipCode}`}
            className="w-full flex items-center justify-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white text-xs font-bold py-3 rounded-xl shadow-md transition"
          >
            <span>Request a Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={`https://wa.me/${pro.whatsapp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(pro.businessName)},%20I%20found%20your%20profile%20on%20GetTigers.net`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Before & After Portfolio Showcase */}
      {pro.portfolio.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-[#2B2D2F]">
              Before & After Portfolio
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Real jobs completed by {pro.businessName} in Florida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pro.portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-md space-y-4"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={item.beforeImgUrl}
                      alt="Before"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      BEFORE
                    </span>
                  </div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border-2 border-emerald-500">
                    <Image
                      src={item.afterImgUrl}
                      alt="After"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      AFTER
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#2B2D2F]">
              Verified Client Reviews
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Feedback from Florida homeowners and businesses.
            </p>
          </div>
        </div>

        {pro.reviews.length === 0 ? (
          <p className="text-sm text-gray-400">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pro.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{rev.clientName}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-gray-400 block pt-1">
                  Verified GetTigers Customer • {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
