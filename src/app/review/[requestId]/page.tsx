'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.requestId as string;

  const [pros, setPros] = useState<any[]>([]);
  const [selectedProId, setSelectedProId] = useState('');
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load tigers so client can pick who completed the job
    fetch('/api/pros')
      .then((res) => res.json())
      .then((data) => {
        if (data.pros) {
          setPros(data.pros);
          if (data.pros.length > 0) {
            setSelectedProId(data.pros[0].id);
          }
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !comment || !selectedProId) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequestId: requestId,
          proProfileId: selectedProId,
          clientName,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to submit review');
      }
    } catch {
      setError('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl space-y-6">
        
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Thank you for your review!</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              Your feedback helps fellow Florida homeowners find reliable Tigers and rewards top-notch autonomous workers.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="bg-[#2B2D2F] hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl transition"
              >
                Back to GetTigers Home
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#F26419] font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Job Completed</span>
              </div>
              <h1 className="text-2xl font-black text-[#2B2D2F]">
                Rate Your Tiger Professional
              </h1>
              <p className="text-xs text-gray-500">
                Direct post-service review for request #{requestId ? requestId.slice(0, 8) : 'FL'}. No password required.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Which Tiger completed your service?
                </label>
                <select
                  value={selectedProId}
                  onChange={(e) => setSelectedProId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden focus:border-orange-500"
                >
                  {pros.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.businessName} ({p.baseCity}, FL)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating ? 'fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Jennifer Miller"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Review / Comment *
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the quality of the service, punctuality, and professionalism..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-[#F26419] hover:bg-[#FF7722] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition disabled:opacity-50 text-xs"
              >
                <span>{submitting ? 'Submitting...' : 'Post Verified Review'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
