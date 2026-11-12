'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import {
  Search,
  MapPin,
  Sparkles,
  Wrench,
  Paintbrush,
  Trees,
  Armchair,
  Waves,
  Truck,
  Hammer,
  CheckCircle2,
  Star,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Languages,
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  Sparkles,
  Wrench,
  Paintbrush,
  Trees,
  Armchair,
  Waves,
  Truck,
  Hammer,
};

export default function HomePage() {
  const { language, t } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [zipInput, setZipInput] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (zipInput) params.set('zip', zipInput);
    router.push(`/request?${params.toString()}`);
  };

  const categories = [
    {
      slug: 'house-cleaning',
      name: language === 'pt' ? 'Limpeza & Airbnb' : language === 'es' ? 'Limpieza de Casas' : 'House & Airbnb Cleaning',
      desc: language === 'pt' ? 'Deep cleaning e turnover de casas de temporada' : language === 'es' ? 'Limpieza profunda y alquiler vacacional' : 'Deep clean, regular turnover for homes & rentals',
      icon: Sparkles,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      slug: 'handyman',
      name: language === 'pt' ? 'Handyman & Reparos' : language === 'es' ? 'Handyman & Reparaciones' : 'Handyman & Repairs',
      desc: language === 'pt' ? 'Drywall, fechaduras, suporte de TV e consertos' : language === 'es' ? 'Drywall, cerraduras, colgar TV y arreglos' : 'Drywall, door locks, TV mounting & fixtures',
      icon: Wrench,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      slug: 'painting',
      name: language === 'pt' ? 'Pintura & Drywall' : language === 'es' ? 'Pintura & Drywall' : 'Painting & Drywall',
      desc: language === 'pt' ? 'Pintura interna, externa e acabamento fino' : language === 'es' ? 'Pintura interior, exterior y acabados' : 'Interior, exterior, doors & drywall repair',
      icon: Paintbrush,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      slug: 'landscaping',
      name: language === 'pt' ? 'Jardinagem & Grama' : language === 'es' ? 'Jardinería & Césped' : 'Lawn & Landscaping',
      desc: language === 'pt' ? 'Corte de grama, poda de palmeiras e mulch' : language === 'es' ? 'Corte de césped, palmeras y mulch' : 'Mowing, palm tree trimming, weed & mulch',
      icon: Trees,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      slug: 'furniture-assembly',
      name: language === 'pt' ? 'Montagem de Móveis' : language === 'es' ? 'Armado de Muebles' : 'Furniture Assembly',
      desc: language === 'pt' ? 'IKEA, Wayfair, camas, racks e mesas' : language === 'es' ? 'IKEA, Wayfair, camas, escritorios' : 'IKEA, Wayfair, bed frames, desks & sets',
      icon: Armchair,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      slug: 'pool-maintenance',
      name: language === 'pt' ? 'Piscina & Química' : language === 'es' ? 'Mantenimiento Piscinas' : 'Pool Service',
      desc: language === 'pt' ? 'Equilíbrio químico, aspiração e bombas' : language === 'es' ? 'Químicos semanales, aspiración y bombas' : 'Weekly balancing, vacuuming & pump checks',
      icon: Waves,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    },
    {
      slug: 'moving',
      name: language === 'pt' ? 'Mudanças & Frete' : language === 'es' ? 'Mudanzas & Carga' : 'Moving & Hauling',
      desc: language === 'pt' ? 'Carga de caminhão, descarte e mudanças locais' : language === 'es' ? 'Mudanzas locales, carga y descarga' : 'Local moves, heavy lifting & junk haul away',
      icon: Truck,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      slug: 'flooring-remodeling',
      name: language === 'pt' ? 'Pisos & Reformas' : language === 'es' ? 'Pisos & Remodelación' : 'Flooring & Remodeling',
      desc: language === 'pt' ? 'Piso vinílico LVP, laminados e pequenos reparos' : language === 'es' ? 'Pisos vinílicos LVP y reformas' : 'Luxury Vinyl Plank, laminate & refreshes',
      icon: Hammer,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-gray-50/50 pt-12 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Smart Lead Wizard Bar */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#F26419] font-bold text-xs shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#F26419] animate-pulse"></span>
                {t.hero.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2B2D2F] tracking-tight leading-[1.15]">
                {t.hero.titleStart}{' '}
                <span className="relative inline-block text-[#F26419]">
                  {t.hero.titleHighlight}
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 250 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9C60 3 190 3 247 9" stroke="#F26419" strokeWidth="5" strokeLinecap="round" opacity="0.35"/>
                  </svg>
                </span>{' '}
                {t.hero.titleEnd}
              </h1>

              <p className="text-base sm:text-lg text-[#4F5459] max-w-2xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* High-Conversion Search Box */}
              <div className="bg-white p-3 rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-200 max-w-2xl">
                <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:bg-white focus-within:border-orange-500 transition">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder={t.hero.servicePlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-hidden placeholder-gray-400"
                    />
                  </div>

                  <div className="sm:w-48 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:bg-white focus-within:border-orange-500 transition">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                    <input
                      type="text"
                      maxLength={5}
                      placeholder={t.hero.zipPlaceholder}
                      value={zipInput}
                      onChange={(e) => setZipInput(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-hidden placeholder-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-orange-500/25 transition shrink-0"
                  >
                    <span>{t.hero.searchBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.hero.trust1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.hero.trust2}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{t.hero.trust3}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Mascot Display with Live Trust Card */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-72 sm:w-88 md:w-96 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <Image
                  src="/mascot.jpg"
                  alt="Tiger in Blazer Mascot"
                  fill
                  className="object-cover object-top"
                  priority
                />
                
                {/* Floating Badge on Mascot */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-gray-100 shadow-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-xs font-black text-gray-800 ml-1">4.9 / 5.0</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-700 mt-0.5">Top-Rated Florida Handymen & Pros</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-[#2B2D2F] tracking-tight">
            {t.categories.title}
          </h2>
          <p className="text-[#4F5459] text-base mt-2">
            {t.categories.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/request?category=${cat.slug}`}
                className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-500 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.color} mb-4 transition group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#F26419] transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#F26419]">
                  <span>{t.categories.requestQuote}</span>
                  <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it Works (3 Steps) */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-[#2B2D2F] tracking-tight">
              {t.howItWorks.title}
            </h2>
            <p className="text-[#4F5459] text-base mt-2">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 relative">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-[#F26419] font-black flex items-center justify-center text-lg mb-4">
                1
              </span>
              <h3 className="text-lg font-bold text-[#2B2D2F] mb-2">{t.howItWorks.step1Title}</h3>
              <p className="text-sm text-[#4F5459] leading-relaxed">{t.howItWorks.step1Desc}</p>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 relative">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-[#F26419] font-black flex items-center justify-center text-lg mb-4">
                2
              </span>
              <h3 className="text-lg font-bold text-[#2B2D2F] mb-2">{t.howItWorks.step2Title}</h3>
              <p className="text-sm text-[#4F5459] leading-relaxed">{t.howItWorks.step2Desc}</p>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-gray-100 relative">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-[#F26419] font-black flex items-center justify-center text-lg mb-4">
                3
              </span>
              <h3 className="text-lg font-bold text-[#2B2D2F] mb-2">{t.howItWorks.step3Title}</h3>
              <p className="text-sm text-[#4F5459] leading-relaxed">{t.howItWorks.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Florida Pros Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#2B2D2F] tracking-tight">
              {t.topTigers.title}
            </h2>
            <p className="text-[#4F5459] text-base mt-1">
              {t.topTigers.subtitle}
            </p>
          </div>
          <Link
            href="/pros"
            className="inline-flex items-center gap-2 font-bold text-sm text-[#F26419] hover:text-[#FF7722]"
          >
            <span>{t.categories.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500">
                  <Image
                    src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80"
                    alt="Carlos Silva"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Carlos Silva</h3>
                  <p className="text-xs text-gray-500">Silva Handyman & Remodeling</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9 (38 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                Drywall patching, TV mounting, door lock change, vinyl plank flooring in MetroWest & Celebration.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">Orlando, FL (32835)</span>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">EN • PT • ES</span>
              </div>
            </div>
            <Link
              href="/pro/silva-handyman-orlando"
              className="w-full text-center py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
            >
              {t.topTigers.viewProfile}
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
                    alt="Mariana Santos"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Mariana Santos</h3>
                  <p className="text-xs text-gray-500">Sparkle Tiger Cleaning</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0 (52 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                Especialista em limpeza de casas de temporada (Airbnb) e deep cleaning em Kissimmee e Orlando.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">Kissimmee, FL (34747)</span>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">EN • PT</span>
              </div>
            </div>
            <Link
              href="/pro/sparkle-tiger-cleaning"
              className="w-full text-center py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
            >
              {t.topTigers.viewProfile}
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                    alt="Mateo Hernandez"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Mateo Hernandez</h3>
                  <p className="text-xs text-gray-500">Miami Sun Landscaping</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.8 (29 reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                Corte de césped, poda de palmeras y mantenimiento de jardines en Doral, Kendall y Miami-Dade.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">Doral / Miami (33178)</span>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">ES • EN</span>
              </div>
            </div>
            <Link
              href="/pro/mateo-landscaping-miami"
              className="w-full text-center py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
            >
              {t.topTigers.viewProfile}
            </Link>
          </div>
        </div>
      </section>

      {/* Pro CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2B2D2F] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
              {language === 'pt' ? 'Para Trabalhadores e Autônomos' : language === 'es' ? 'Para Trabajadores Independientes' : 'For Independent Florida Workers'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {t.cta.title}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {t.cta.subtitle}
            </p>
            <div className="pt-2">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-orange-500/30"
              >
                <span>{t.cta.btn}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Decorative Mascot Background Slice */}
          <div className="hidden lg:block absolute -right-8 -bottom-10 w-96 h-96 opacity-30 pointer-events-none rounded-full overflow-hidden">
            <Image
              src="/mascot.jpg"
              alt="Tiger Background"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
