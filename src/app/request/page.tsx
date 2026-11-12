'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import {
  Sparkles,
  Wrench,
  Paintbrush,
  Trees,
  Armchair,
  Waves,
  Truck,
  Hammer,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const iconsMap: Record<string, any> = {
  Sparkles,
  Wrench,
  Paintbrush,
  Trees,
  Armchair,
  Waves,
  Truck,
  Hammer,
};

function RequestWizardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useI18n();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Form states
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [urgency, setUrgency] = useState('this_week');
  const [zipCode, setZipCode] = useState(searchParams.get('zip') || '');
  const [zipValidation, setZipValidation] = useState<{ valid: boolean; city?: string; county?: string } | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [notes, setNotes] = useState('');

  // Submission results
  const [submitting, setSubmitting] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const [copiedReviewLink, setCopiedReviewLink] = useState(false);

  // Load categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          const initialCatSlug = searchParams.get('category');
          if (initialCatSlug) {
            const found = data.categories.find((c: any) => c.slug === initialCatSlug);
            if (found) {
              setSelectedCategory(found);
              setCurrentStep(2);
            }
          }
        }
        setLoading(false);
      });
  }, [searchParams]);

  // Validate ZIP Code live
  useEffect(() => {
    if (zipCode.length === 5) {
      fetch(`/api/geo/zip?zip=${zipCode}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.valid) {
            setZipValidation({ valid: true, city: res.city, county: res.county });
          } else {
            setZipValidation({ valid: false });
          }
        })
        .catch(() => setZipValidation({ valid: false }));
    } else {
      setZipValidation(null);
    }
  }, [zipCode]);

  const parsedQuestions = selectedCategory
    ? JSON.parse(selectedCategory.wizardQuestions || '[]')
    : [];

  const handleNext = () => {
    if (currentStep === 1 && !selectedCategory) return;
    if (currentStep === 4 && (!zipCode || zipValidation?.valid === false)) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedCategory) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          clientName,
          clientEmail,
          clientPhone,
          clientWhatsapp: clientWhatsapp || clientPhone,
          zipCode,
          urgency,
          answers,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.requestId) {
        setCreatedRequestId(data.requestId);
        setCurrentStep(6); // Success Step
      } else {
        alert(data.error || 'Failed to submit request');
      }
    } catch (err) {
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReviewLink = () => {
    if (!createdRequestId) return;
    const url = `${window.location.origin}/review/${createdRequestId}`;
    navigator.clipboard.writeText(url);
    setCopiedReviewLink(true);
    setTimeout(() => setCopiedReviewLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading Florida services...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Step Indicator */}
      {currentStep < 6 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            <span>{t.wizard.step} {currentStep} {t.wizard.of} 5</span>
            <span className="text-[#F26419]">
              {currentStep === 1 && t.wizard.step1Title}
              {currentStep === 2 && t.wizard.step2Title}
              {currentStep === 3 && t.wizard.step3Title}
              {currentStep === 4 && t.wizard.step4Title}
              {currentStep === 5 && t.wizard.step5Title}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#F26419] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl shadow-gray-200/50">
        
        {/* Step 1: Select Category */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-black text-[#2B2D2F]">
                {t.wizard.step1Title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose the service you are looking for in Florida.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const Icon = iconsMap[cat.icon] || Sparkles;
                const isSelected = selectedCategory?.id === cat.id;
                const catName = language === 'pt' ? cat.namePt : language === 'es' ? cat.nameEs : cat.nameEn;
                const catDesc = language === 'pt' ? cat.descriptionPt : language === 'es' ? cat.descriptionEs : cat.descriptionEn;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                    }}
                    className={`p-4 rounded-2xl border text-left transition flex items-start gap-4 ${
                      isSelected
                        ? 'border-[#F26419] bg-orange-50/50 ring-2 ring-orange-400'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="p-3 rounded-xl bg-orange-100 text-[#F26419] shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{catName}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{catDesc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!selectedCategory}
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#F26419] hover:bg-[#FF7722] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-md transition"
              >
                <span>{t.wizard.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Dynamic Questions for Selected Category */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-[#F26419] uppercase tracking-wider">
                {language === 'pt' ? selectedCategory.namePt : language === 'es' ? selectedCategory.nameEs : selectedCategory.nameEn}
              </span>
              <h2 className="text-2xl font-black text-[#2B2D2F] mt-1">
                {t.wizard.step2Title}
              </h2>
            </div>

            <div className="space-y-6">
              {parsedQuestions.map((q: any) => {
                const label = language === 'pt' ? q.labelPt : language === 'es' ? q.labelEs : q.labelEn;
                return (
                  <div key={q.id} className="space-y-3">
                    <label className="block text-sm font-bold text-gray-800">
                      {label}
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((opt: any) => {
                        const optLabel = language === 'pt' ? opt.labelPt : language === 'es' ? opt.labelEs : opt.labelEn;
                        const isChosen = answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                            className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                              isChosen
                                ? 'border-[#F26419] bg-orange-50 text-orange-950 ring-1 ring-orange-400'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50'
                            }`}
                          >
                            <span>{optLabel}</span>
                            {isChosen && <CheckCircle className="w-4 h-4 text-[#F26419]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 font-bold px-4 py-2 hover:bg-gray-100 rounded-xl transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.wizard.back}</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white font-bold px-6 py-3 rounded-xl shadow-md transition text-sm"
              >
                <span>{t.wizard.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Urgency */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#2B2D2F]">
                {t.wizard.urgencyTitle}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                This helps local Tigers plan their schedule.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'urgent', title: t.wizard.urgencyUrgent, desc: 'Needs immediate dispatch within 24-48 hours' },
                { value: 'this_week', title: t.wizard.urgencyWeek, desc: 'Can be scheduled in the next 3 to 7 days' },
                { value: 'flexible', title: t.wizard.urgencyFlexible, desc: 'Planning ahead, flexible date' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setUrgency(item.value)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                    urgency === item.value
                      ? 'border-[#F26419] bg-orange-50/70 ring-2 ring-orange-400'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  {urgency === item.value && <CheckCircle className="w-5 h-5 text-[#F26419]" />}
                </button>
              ))}
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 font-bold px-4 py-2 hover:bg-gray-100 rounded-xl transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.wizard.back}</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white font-bold px-6 py-3 rounded-xl shadow-md transition text-sm"
              >
                <span>{t.wizard.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Florida ZIP Code */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#2B2D2F]">
                {t.wizard.step4Title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t.wizard.zipHelp}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {t.wizard.zipLabel}
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 32835"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:outline-hidden focus:border-orange-500 transition"
                  />
                </div>
              </div>

              {/* ZIP Validation Display */}
              {zipValidation && zipValidation.valid && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Location matched: <strong>{zipValidation.city}, FL ({zipValidation.county} County)</strong>
                  </span>
                </div>
              )}

              {zipValidation && !zipValidation.valid && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
                  Note: GetTigers currently operates exclusively in Florida (ZIPs starting with 32, 33, or 34). Please ensure you entered a valid Florida ZIP code.
                </div>
              )}
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 font-bold px-4 py-2 hover:bg-gray-100 rounded-xl transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.wizard.back}</span>
              </button>
              <button
                type="button"
                disabled={!zipCode || zipValidation?.valid === false}
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#F26419] hover:bg-[#FF7722] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-md transition text-sm"
              >
                <span>{t.wizard.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Contact Info & Notes */}
        {currentStep === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#2B2D2F]">
                {t.wizard.step5Title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Tigers will contact you directly. We do not spam or share your info.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.wizard.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Michael Smith / Ana Paula"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {t.wizard.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+1 (407) 000-0000"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    {t.wizard.whatsappLabel}
                  </label>
                  <input
                    type="tel"
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    placeholder="e.g. +1407... or +5511..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.wizard.emailLabel}
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t.wizard.notesLabel}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.wizard.notesPlaceholder}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 font-bold px-4 py-2 hover:bg-gray-100 rounded-xl transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.wizard.back}</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition text-sm disabled:opacity-50"
              >
                <span>{submitting ? t.wizard.submitting : t.wizard.submit}</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 6: Success Screen & Direct Review Link */}
        {currentStep === 6 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#2B2D2F]">
                {t.wizard.successTitle}
              </h2>
              <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                {t.wizard.successDesc}
              </p>
            </div>

            {/* Direct Review Link Box */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 text-left max-w-lg mx-auto space-y-3">
              <div className="flex items-center gap-2 text-[#F26419] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.wizard.reviewDirectNotice}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/review/${createdRequestId}` : ''}
                  className="w-full text-xs text-gray-700 bg-transparent focus:outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={copyReviewLink}
                  className="flex items-center gap-1.5 bg-[#2B2D2F] hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedReviewLink ? t.wizard.copied : t.wizard.copyLink}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Return to Home
              </Link>
              <Link
                href="/pros"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F26419] text-white text-sm font-bold shadow-md hover:bg-[#FF7722] transition"
              >
                Browse Florida Tigers
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold">Loading...</div>}>
      <RequestWizardContent />
    </Suspense>
  );
}
