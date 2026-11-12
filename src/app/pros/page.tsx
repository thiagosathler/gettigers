'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Star, ShieldCheck, MapPin, Search, Filter, ArrowRight } from 'lucide-react';

export default function ProsDirectoryPage() {
  const { language } = useI18n();
  const [pros, setPros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLang, setFilterLang] = useState<string>('');
  const [filterCity, setFilterCity] = useState<string>('');

  useEffect(() => {
    let url = '/api/pros';
    const params = new URLSearchParams();
    if (filterLang) params.set('lang', filterLang);
    if (params.toString()) url += `?${params.toString()}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.pros) {
          setPros(data.pros);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filterLang]);

  const filteredPros = filterCity
    ? pros.filter((p) => p.baseCity.toLowerCase().includes(filterCity.toLowerCase()))
    : pros;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Directory Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-[#2B2D2F]">
          Florida Tigers Directory
        </h1>
        <p className="text-sm text-gray-500">
          Find top-rated independent professionals, handymen, and cleaners across Orlando, Miami, Tampa and beyond. Filter by language spoken.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* City Quick Filter */}
        <div className="relative w-full sm:w-72">
          <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by city (e.g. Orlando, Miami)"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
          />
        </div>

        {/* Spoken Language Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-500 shrink-0">Language:</span>
          <div className="flex gap-1.5 overflow-x-auto">
            {[
              { code: '', label: 'All Languages' },
              { code: 'EN', label: '🇺🇸 English' },
              { code: 'PT', label: '🇧🇷 Português' },
              { code: 'ES', label: '🇪🇸 Español' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setFilterLang(item.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterLang === item.code
                    ? 'bg-[#2B2D2F] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tigers Cards Grid */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400">Loading Tigers...</div>
      ) : filteredPros.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8">
          <p className="text-gray-500 text-sm font-medium">No Tigers found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPros.map((pro) => {
            const langs = pro.languages.split(',');
            return (
              <div
                key={pro.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-orange-400 shadow-xs hover:shadow-xl transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-500 shrink-0">
                      <Image
                        src={pro.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80'}
                        alt={pro.businessName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                        {pro.businessName}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        <span>{pro.baseCity}, FL ({pro.baseZipCode})</span>
                      </p>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{pro.ratingAverage.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({pro.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {pro.bio}
                  </p>

                  {/* Languages Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {langs.map((l: string) => (
                      <span
                        key={l}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200"
                      >
                        {l.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/pro/${pro.slug}`}
                    className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-orange-500 hover:text-white text-xs font-bold text-gray-800 text-center transition flex items-center justify-center gap-2 group"
                  >
                    <span>View Profile & Work</span>
                    <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
