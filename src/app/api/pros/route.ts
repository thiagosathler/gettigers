import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getFloridaZip, calculateDistanceMiles } from '@/lib/geo';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const zip = searchParams.get('zip');
    const language = searchParams.get('lang'); // 'EN', 'PT', 'ES'

    let where: any = {};

    if (categorySlug) {
      where.categories = {
        some: {
          category: {
            slug: categorySlug,
          },
        },
      };
    }

    if (language) {
      where.languages = {
        contains: language.toUpperCase(),
      };
    }

    const pros = await prisma.proProfile.findMany({
      where,
      include: {
        categories: {
          include: { category: true },
        },
        portfolio: {
          take: 2,
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: [
        { verified: 'desc' },
        { ratingAverage: 'desc' },
      ],
    });

    let clientCoord: { lat: number; lng: number } | null = null;
    if (zip) {
      const zipData = await getFloridaZip(zip);
      if (zipData) {
        clientCoord = { lat: zipData.lat, lng: zipData.lng };
      }
    }

    // Attach distance if client ZIP provided
    const enrichedPros = await Promise.all(
      pros.map(async (pro) => {
        let distanceMiles: number | null = null;
        if (clientCoord) {
          const proZip = await getFloridaZip(pro.baseZipCode);
          if (proZip) {
            distanceMiles = calculateDistanceMiles(
              clientCoord.lat,
              clientCoord.lng,
              proZip.lat,
              proZip.lng
            );
          }
        }
        return {
          ...pro,
          distanceMiles,
        };
      })
    );

    return NextResponse.json({ pros: enrichedPros });
  } catch (err: any) {
    console.error('API Pros error:', err);
    return NextResponse.json({ error: 'Failed to load Tigers' }, { status: 500 });
  }
}
