'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  MapPin,
  Clock,
  Unlock,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Camera,
  Share2,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'leads' | 'unlocked' | 'profile'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  const fetchLeads = () => {
    fetch('/api/requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) {
          setLeads(data.requests);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          window.location.href = '/login';
        } else {
          setUser(data.user);
          fetchLeads();
        }
      });
  }, []);

  const handleUnlock = async (requestId: string) => {
    setUnlockingId(requestId);
    try {
      const res = await fetch('/api/requests/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh leads list to reveal customer phone
        fetchLeads();
      } else {
        alert(data.error || 'Failed to unlock lead');
      }
    } catch {
      alert('Error unlocking lead.');
    } finally {
      setUnlockingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm font-medium">Loading your Florida opportunities...</p>
      </div>
    );
  }

  const openLeads = leads.filter((l) => !l.isUnlockedByMe);
  const unlockedLeads = leads.filter((l) => l.isUnlockedByMe);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Top Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-xs">
            <Image
              src="/mascot.jpg"
              alt="Tiger Profile"
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#2B2D2F]">
                {user?.proProfile?.businessName || user?.name}
              </h1>
              {user?.proProfile?.verified && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Base: {user?.proProfile?.baseCity}, FL ({user?.proProfile?.baseZipCode})</span>
              <span>•</span>
              <span className="font-semibold text-emerald-600">MVP Free Tier (Unlimited Unlocks)</span>
            </p>
          </div>
        </div>

        {user?.proProfile?.slug && (
          <Link
            href={`/pro/${user.proProfile.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>View Public Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4">
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'border-[#F26419] text-[#F26419]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>{t.dashboard.leadsTab}</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800">
            {openLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('unlocked')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'unlocked'
              ? 'border-[#F26419] text-[#F26419]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span>{t.dashboard.myUnlockedTab}</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
            {unlockedLeads.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Open Leads Feed */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Showing verified homeowner & vacation rental requests within your Florida radius.</span>
            <span className="font-bold text-[#F26419]">{openLeads.length} Available</span>
          </div>

          {openLeads.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No open leads in your radius right now</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Check back soon or expand your service radius in your profile settings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {openLeads.map((lead) => {
                const categoryTitle =
                  language === 'pt' ? lead.categoryNamePt : language === 'es' ? lead.categoryNameEs : lead.categoryName;

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 shadow-xs transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                          {categoryTitle}
                        </span>
                        <h3 className="font-bold text-base text-gray-900 mt-1">
                          {lead.clientName} in {lead.city}, FL ({lead.zipCode})
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {lead.distanceMiles !== null && (
                          <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                            📍 {lead.distanceMiles} {t.dashboard.distance}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Answers Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-gray-400 font-medium block">Urgency:</span>
                        <span className="font-bold text-gray-800 uppercase">
                          {lead.urgency === 'urgent' ? '🔴 Urgent' : lead.urgency === 'this_week' ? '🟡 This Week' : '🟢 Flexible'}
                        </span>
                      </div>
                      {Object.entries(lead.answers || {}).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-gray-400 font-medium block capitalize">{k}:</span>
                          <span className="font-bold text-gray-800 capitalize">{String(v).replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                    </div>

                    {lead.notes && (
                      <p className="text-xs text-gray-600 italic">
                        "{lead.notes}"
                      </p>
                    )}

                    {/* Unlock Action Footer */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs text-gray-500">
                        {lead.slotsLeft > 0 ? (
                          <span className="text-emerald-600 font-bold">
                            🟢 {lead.slotsLeft} of 4 {t.dashboard.slotsLeft}
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold">
                            🔴 {t.dashboard.slotsFull}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={unlockingId === lead.id || lead.slotsLeft === 0}
                        onClick={() => handleUnlock(lead.id)}
                        className="flex items-center justify-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{unlockingId === lead.id ? 'Unlocking...' : t.dashboard.unlockFree}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Unlocked Leads */}
      {activeTab === 'unlocked' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500">
            Contacts you have unlocked. Connect immediately via WhatsApp or SMS.
          </div>

          {unlockedLeads.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <Unlock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">You haven't unlocked any leads yet</h3>
              <p className="text-xs text-gray-500 mt-1">
                Go to the New Opportunities tab to unlock customer phone numbers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {unlockedLeads.map((lead) => {
                const categoryTitle =
                  language === 'pt' ? lead.categoryNamePt : language === 'es' ? lead.categoryNameEs : lead.categoryName;
                
                const cleanPhone = (lead.clientPhone || '').replace(/\D/g, '');
                const whatsappNumber = (lead.clientWhatsapp || lead.clientPhone || '').replace(/\D/g, '');
                
                const whatsappGreeting = encodeURIComponent(
                  `Hello ${lead.clientName}! I saw your request for ${categoryTitle} on GetTigers.net. I'm available in ${lead.city} and would love to provide a quick quote.`
                );

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Unlocked • {categoryTitle}
                        </span>
                        <h3 className="font-bold text-lg text-gray-900 mt-1">
                          {lead.clientName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {lead.city}, FL ({lead.zipCode}) {lead.distanceMiles !== null ? `• ${lead.distanceMiles} miles away` : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-gray-900 font-mono">
                          {lead.clientPhone}
                        </span>
                        {lead.clientEmail && (
                          <p className="text-xs text-gray-400">{lead.clientEmail}</p>
                        )}
                      </div>
                    </div>

                    {lead.notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                        "{lead.notes}"
                      </p>
                    )}

                    {/* Direct Contact Buttons (WhatsApp & SMS) */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappGreeting}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        <span>{t.dashboard.sendWhatsapp}</span>
                      </a>

                      {/* SMS Text Message Button */}
                      <a
                        href={`sms:${cleanPhone}`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#2B2D2F] hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{t.dashboard.sendSms}</span>
                      </a>

                      {/* Call Phone Button */}
                      <a
                        href={`tel:${cleanPhone}`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-3 rounded-xl transition"
                      >
                        <span>{t.dashboard.callPhone}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
