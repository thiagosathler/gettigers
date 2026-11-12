import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name, provider } = body;

    // 1. Social Auth (Google / Apple ID)
    if (provider === 'google' || provider === 'apple') {
      const socialEmail = email || `user_${Date.now()}@${provider}.auth`;
      const socialName = name || (provider === 'google' ? 'Google Tiger User' : 'Apple Tiger User');

      let user = await prisma.user.findUnique({
        where: { email: socialEmail },
        include: { proProfile: true },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: socialEmail,
            name: socialName,
            role: 'PRO',
          },
          include: { proProfile: true },
        });

        // Create default profile for new social user
        const slug = socialName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
        await prisma.proProfile.create({
          data: {
            userId: user.id,
            slug,
            businessName: socialName,
            phone: '+1 (407) 000-0000',
            whatsapp: '14070000000',
            languages: 'EN,PT,ES',
            baseZipCode: '32835',
            baseCity: 'Orlando',
            serviceRadiusMiles: 25,
            verified: false,
          },
        });
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        proProfileId: user.proProfile?.id,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });

      response.cookies.set('tiger_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    // 2. Email / Password Register
    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Please provide name, email, and password.' }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'PRO',
        },
      });

      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
      const pro = await prisma.proProfile.create({
        data: {
          userId: user.id,
          slug,
          businessName: body.businessName || name,
          phone: body.phone || '+1 (407) 000-0000',
          whatsapp: body.whatsapp || '14070000000',
          languages: body.languages || 'EN,PT',
          baseZipCode: body.baseZipCode || '32835',
          baseCity: body.baseCity || 'Orlando',
          serviceRadiusMiles: Number(body.serviceRadiusMiles) || 25,
          verified: false,
        },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        proProfileId: pro.id,
      });

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });

      response.cookies.set('tiger_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    // 3. Email / Password Login
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { proProfile: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      proProfileId: user.proProfile?.id,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set('tiger_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err: any) {
    console.error('Auth API error:', err);
    return NextResponse.json({ error: err.message || 'Authentication error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('tiger_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
