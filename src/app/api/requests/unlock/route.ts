import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.proProfileId) {
      return NextResponse.json({ error: 'Unauthorized. Please login as a Tiger.' }, { status: 401 });
    }

    const { requestId } = await request.json();
    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const req = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        unlockedBy: true,
      },
    });

    if (!req) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Check if already unlocked by this pro
    const alreadyUnlocked = req.unlockedBy.some((u) => u.proProfileId === session.proProfileId);
    if (alreadyUnlocked) {
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        lead: {
          clientName: req.clientName,
          clientPhone: req.clientPhone,
          clientWhatsapp: req.clientWhatsapp || req.clientPhone,
          clientEmail: req.clientEmail,
        },
      });
    }

    // Check max unlocks limit (4 Tigers)
    if (req.unlockedBy.length >= req.maxUnlocks) {
      return NextResponse.json(
        { error: 'This lead has already reached the maximum limit of 4 Tigers.' },
        { status: 400 }
      );
    }

    // Free unlock in MVP
    await prisma.leadUnlock.create({
      data: {
        serviceRequestId: req.id,
        proProfileId: session.proProfileId,
      },
    });

    await prisma.serviceRequest.update({
      where: { id: req.id },
      data: {
        unlockCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      lead: {
        clientName: req.clientName,
        clientPhone: req.clientPhone,
        clientWhatsapp: req.clientWhatsapp || req.clientPhone,
        clientEmail: req.clientEmail,
      },
    });
  } catch (err: any) {
    console.error('Unlock Lead error:', err);
    return NextResponse.json({ error: 'Failed to unlock lead' }, { status: 500 });
  }
}
