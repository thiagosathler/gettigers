import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { proProfileId, serviceRequestId, rating, comment, clientName } = await request.json();

    if (!proProfileId || !rating || !comment || !clientName) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        proProfileId,
        serviceRequestId: serviceRequestId || null,
        clientName,
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment,
      },
    });

    // Recompute Pro rating average
    const allReviews = await prisma.review.findMany({
      where: { proProfileId },
      select: { rating: true },
    });

    const avg = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await prisma.proProfile.update({
      where: { id: proProfileId },
      data: {
        ratingAverage: Math.round(avg * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    console.error('Review error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
