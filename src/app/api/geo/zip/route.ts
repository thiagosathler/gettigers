import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getFloridaZip } from '@/lib/geo';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');

  if (!zip) {
    return NextResponse.json({ error: 'ZIP code required' }, { status: 400 });
  }

  const zipData = await getFloridaZip(zip);
  if (!zipData) {
    return NextResponse.json({ valid: false, message: 'Invalid or non-Florida ZIP' });
  }

  return NextResponse.json({
    valid: true,
    city: zipData.city,
    county: zipData.county,
    zip: zipData.zip,
  });
}
