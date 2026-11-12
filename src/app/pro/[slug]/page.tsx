import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProProfileClient from './ProProfileClient';

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

  return <ProProfileClient pro={pro} />;
}
