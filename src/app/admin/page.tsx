import React from 'react';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShieldAlert, Users, FolderKanban, CheckCircle2, MapPin } from 'lucide-react';

export default async function AdminPage() {
  const session = await getCurrentUser();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const [prosCount, leadsCount, categories, recentLeads, topCities] = await Promise.all([
    prisma.proProfile.count(),
    prisma.serviceRequest.count(),
    prisma.category.findMany({ include: { _count: { select: { requests: true, pros: true } } } }),
    prisma.serviceRequest.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        unlockedBy: { include: { proProfile: true } },
      },
    }),
    prisma.floridaZip.groupBy({
      by: ['city'],
      _count: { zip: true },
      orderBy: {
        _count: {
          zip: 'desc',
        },
      },
      take: 8,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-[#2B2D2F] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">
            Admin Backoffice
          </span>
          <h1 className="text-3xl font-black mt-1">GetTigers Florida Operations</h1>
          <p className="text-xs text-gray-400 mt-1">
            Logged in as {session.email} • Full administrative control
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-xs text-gray-400 block font-semibold">Total Tigers</span>
            <span className="text-2xl font-black text-white">{prosCount}</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-xs text-gray-400 block font-semibold">Total Leads</span>
            <span className="text-2xl font-black text-[#F26419]">{leadsCount}</span>
          </div>
        </div>
      </div>

      {/* Categories & Wizard Overview */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-[#2B2D2F]">
          Active Categories & Wizard Questions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2">
              <span className="text-xs font-bold text-orange-600 block">{c.nameEn}</span>
              <p className="text-[11px] text-gray-500">{c.namePt} / {c.nameEs}</p>
              <div className="flex justify-between text-[11px] font-semibold text-gray-700 pt-2 border-t border-gray-200">
                <span>{c._count.pros} Tigers</span>
                <span className="text-orange-600">{c._count.requests} Leads</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads Live Feed */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-[#2B2D2F]">
          Recent Customer Requests (Leads)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Urgency</th>
                <th className="py-3 px-3">Unlocked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-800">
                    {r.category.nameEn}
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-900">
                    {r.clientName} <br />
                    <span className="text-[11px] text-gray-400">{r.clientPhone}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-600">
                    {r.city}, FL ({r.zipCode})
                  </td>
                  <td className="py-3 px-3">
                    <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded-md bg-orange-50 text-orange-700">
                      {r.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {r.unlockedBy.length === 0 ? (
                      <span className="text-gray-400">0 / 4 Tigers</span>
                    ) : (
                      <span className="font-bold text-emerald-600">
                        {r.unlockedBy.length} / 4 Tigers
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
