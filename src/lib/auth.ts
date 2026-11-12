import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'tiger-secret-florida-2026-key';

export interface AuthSession {
  userId: string;
  email: string;
  role: string;
  name: string;
  proProfileId?: string;
}

export function signToken(payload: AuthSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): AuthSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSession;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('tiger_token')?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Check if ProProfile ID exists if user is PRO
  if (!decoded.proProfileId) {
    const pro = await prisma.proProfile.findUnique({
      where: { userId: decoded.userId },
      select: { id: true },
    });
    if (pro) {
      decoded.proProfileId = pro.id;
    }
  }

  return decoded;
}
