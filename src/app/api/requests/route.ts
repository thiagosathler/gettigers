import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getFloridaZip, calculateDistanceMiles } from '@/lib/geo';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Create a new Service Request (Lead) from Client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      categoryId,
      clientName,
      clientEmail,
      clientPhone,
      clientWhatsapp,
      zipCode,
      urgency,
      answers,
      notes,
    } = body;

    if (!categoryId || !clientName || !clientPhone || !zipCode) {
      return NextResponse.json(
        { error: 'Category, Name, Phone and Florida ZIP Code are required.' },
        { status: 400 }
      );
    }

    // Verify Florida ZIP
    const zipData = await getFloridaZip(zipCode);
    const city = zipData ? zipData.city : 'Florida';

    const req = await prisma.serviceRequest.create({
      data: {
        categoryId,
        clientName,
        clientEmail: clientEmail || '',
        clientPhone,
        clientWhatsapp: clientWhatsapp || clientPhone,
        zipCode,
        city,
        urgency: urgency || 'this_week',
        answersJson: JSON.stringify(answers || {}),
        notes: notes || '',
        maxUnlocks: 4,
      },
    });

    return NextResponse.json({
      success: true,
      requestId: req.id,
      city,
    });
  } catch (err: any) {
    console.error('Create Request Error:', err);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}

// Get leads for Pro Dashboard
export async function GET(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.proProfileId) {
      return NextResponse.json({ error: 'Unauthorized Pro' }, { status: 401 });
    }

    const pro = await prisma.proProfile.findUnique({
      where: { id: session.proProfileId },
      include: {
        categories: true,
      },
    });

    if (!pro) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const myCategoryIds = pro.categories.map((c) => c.categoryId);
    const proZipData = await getFloridaZip(pro.baseZipCode);

    // Fetch active open requests in Pro's categories
    const requests = await prisma.serviceRequest.findMany({
      where: {
        categoryId: { in: myCategoryIds.length > 0 ? myCategoryIds : undefined },
        status: 'OPEN',
      },
      include: {
        category: true,
        unlockedBy: {
          select: { proProfileId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Calculate distance and filter or sort by Pro radius
    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        let distanceMiles: number | null = null;
        if (proZipData) {
          const reqZipData = await getFloridaZip(req.zipCode);
          if (reqZipData) {
            distanceMiles = calculateDistanceMiles(
              proZipData.lat,
              proZipData.lng,
              reqZipData.lat,
              reqZipData.lng
            );
          }
        }

        const isUnlockedByMe = req.unlockedBy.some((u) => u.proProfileId === pro.id);
        const slotsLeft = Math.max(0, req.maxUnlocks - req.unlockedBy.length);

        return {
          id: req.id,
          categoryName: req.category.nameEn,
          categoryNamePt: req.category.namePt,
          categoryNameEs: req.category.nameEs,
          city: req.city,
          zipCode: req.zipCode,
          urgency: req.urgency,
          answers: JSON.parse(req.answersJson || '{}'),
          notes: req.notes,
          createdAt: req.createdAt,
          distanceMiles,
          isUnlockedByMe,
          slotsLeft,
          // Only show client details if unlocked
          clientName: isUnlockedByMe ? req.clientName : req.clientName.split(' ')[0] + ' ***',
          clientPhone: isUnlockedByMe ? req.clientPhone : null,
          clientWhatsapp: isUnlockedByMe ? req.clientWhatsapp : null,
          clientEmail: isUnlockedByMe ? req.clientEmail : null,
        };
      })
    );

    return NextResponse.json({ requests: enrichedRequests });
  } catch (err: any) {
    console.error('Get Requests error:', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
