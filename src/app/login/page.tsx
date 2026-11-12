'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = data.user.role === 'ADMIN' ? '/admin' : '/dashboard';
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          name: provider === 'google' ? 'Google Pro User' : 'Apple Pro User',
          email: `${provider}.user@gettigers.net`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = '/dashboard';
      } else {
        setError('Social sign in failed.');
      }
    } catch {
      setError('Social sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#F26419] font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Tiger Pro Portal</span>
          </div>
          <h1 className="text-2xl font-black text-[#2B2D2F]">
            {language === 'pt' ? 'Entrar na sua conta' : language === 'es' ? 'Acceder a tu cuenta' : 'Log in to GetTigers'}
          </h1>
          <p className="text-xs text-gray-500">
            Access your Florida leads feed and unlocked contacts.
          </p>
        </div>

        {/* Social Logins */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.14C3.25 21.27 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.01-3.14z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.73 1.27 6.6l4.01 3.14c.95-2.84 3.6-4.99 6.72-4.99z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('apple')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.58-2.91-7.66-7.85-12.24-14.82-6.86-10.45-12.2-22.18-16.02-35.17-3.83-13-5.74-25.04-5.74-36.14 0-14.44 3.65-26.68 10.95-36.72 7.3-10.04 16.58-15.19 27.84-15.45 4.35 0 9.29 1.17 14.81 3.52 5.53 2.34 9.4 3.58 11.64 3.71 1.74-.24 5.76-1.5 12.06-3.79 6.3-2.29 11.39-3.26 15.27-2.9 14.33.98 25.12 6.64 32.37 16.98-12.75 7.74-18.96 18.23-18.63 31.48.33 10.34 4.3 18.94 11.91 25.8 7.61 6.85 16.71 10.82 27.3 11.89-2.28 6.84-4.89 13.55-7.83 20.12zm-32.99-106.31c0-7.84 2.82-15.13 8.46-21.87 5.64-6.74 12.56-10.95 20.76-12.63.43 2.17.65 4.23.65 6.19 0 7.84-3.05 15.34-9.15 22.5-6.1 7.17-13.3 11.41-21.6 12.72-.22-2.17-.32-4.08-.32-5.71z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 absolute">
              or with email
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. carlos.handyman@gettigers.net"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition disabled:opacity-50 text-sm"
          >
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials Tip */}
        <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-[11px] text-orange-950 space-y-1">
          <p className="font-bold">⚡ Demo Test Accounts:</p>
          <p>Tiger: <code className="bg-white px-1 py-0.5 rounded font-mono">carlos.handyman@gettigers.net</code> (Pass: <code className="bg-white px-1 py-0.5 rounded font-mono">Tiger123!</code>)</p>
          <p>Admin: <code className="bg-white px-1 py-0.5 rounded font-mono">admin@gettigers.net</code> (Pass: <code className="bg-white px-1 py-0.5 rounded font-mono">Tiger123!</code>)</p>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link href="/join" className="text-[#F26419] font-bold hover:underline">
            Register as a Tiger
          </Link>
        </p>

      </div>
    </div>
  );
}
