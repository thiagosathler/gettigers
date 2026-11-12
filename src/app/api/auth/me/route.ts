import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      proProfile: {
        select: {
          id: true,
          slug: true,
          businessName: true,
          baseCity: true,
          baseZipCode: true,
          verified: true,
        },
      },
    },
  });

  return NextResponse.json({ authenticated: true, user });
}
