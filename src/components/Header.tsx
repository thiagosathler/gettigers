'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n, Language } from '@/lib/i18n';
import { Globe, Menu, X, ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';

export default function Header() {
  const { language, setLanguage, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-sm transition group-hover:scale-105">
              <Image
                src="/mascot.jpg"
                alt="GetTigers Mascot"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#2B2D2F] flex items-center">
                Get<span className="text-[#F26419]">Tigers</span>
                <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-[#F26419] font-bold">.net</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#4F5459]">Florida • USA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/#categories"
              className="text-sm font-semibold text-[#4F5459] hover:text-[#F26419] transition"
            >
              {t.nav.services}
            </Link>
            <Link
              href="/pros"
              className="text-sm font-semibold text-[#4F5459] hover:text-[#F26419] transition"
            >
              {t.nav.findPros}
            </Link>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-[#F4F6F8] rounded-full p-1 border border-gray-200">
              <Globe className="w-3.5 h-3.5 text-gray-500 ml-2 mr-1" />
              {(['en', 'pt', 'es'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-full transition uppercase ${
                    language === lang
                      ? 'bg-[#2B2D2F] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* User Session Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#2B2D2F] text-white rounded-xl hover:bg-black transition shadow-sm"
                >
                  <UserIcon className="w-4 h-4 text-orange-400" />
                  {t.nav.dashboard}
                </Link>
                <button
                  onClick={handleLogout}
                  title={t.nav.logout}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-gray-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-bold text-[#2B2D2F] hover:text-[#F26419] px-3 py-2 transition"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/join"
                  className="flex items-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-orange-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {t.nav.becomeTiger}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center bg-[#F4F6F8] rounded-full p-1 border border-gray-200">
              {(['en', 'pt', 'es'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 text-xs font-bold rounded-full transition uppercase ${
                    language === lang ? 'bg-[#2B2D2F] text-white' : 'text-gray-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 rounded-lg hover:bg-gray-50"
          >
            {t.nav.services}
          </Link>
          <Link
            href="/pros"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-gray-800 rounded-lg hover:bg-gray-50"
          >
            {t.nav.findPros}
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-bold text-orange-600 rounded-lg hover:bg-orange-50"
              >
                {t.nav.dashboard}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-bold text-gray-800 rounded-lg hover:bg-gray-50"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-[#F26419] text-white font-bold py-3 rounded-xl shadow-md"
              >
                {t.nav.becomeTiger}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
