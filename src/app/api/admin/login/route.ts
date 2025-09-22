import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use proper JWT)
    const token = Buffer.from(`${user.id}.${Date.now()}`).toString('base64');

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'admin_login',
        entityType: 'auth',
        metadata: JSON.stringify({
          timestamp: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent')
        }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent')
      }
    });

    // Return user data and token
    return NextResponse.json({
      success: true,
      admin: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: 'super_admin',
        permissions: [
          {
            id: 'perm-1',
            name: 'Full Access',
            resource: 'all',
            actions: ['read', 'write', 'delete', 'approve']
          }
        ],
        createdAt: user.createdAt.toISOString(),
        lastLogin: new Date().toISOString()
      },
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}