// API key create API - Generate new API key
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/security';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, permissions, expiresAt } = body;

    // Generate API key
    const key = `wos_${crypto.randomBytes(32).toString('hex')}`;
    const hashedKey = await encrypt(key);

    // Save to database
    const apiKey = await prisma.apiKey.create({
        data: {
            name,
            key: hashedKey,
            userId,
            permissions,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
    });

    // Return key only once
    return NextResponse.json({
        success: true,
        apiKey: {
            ...apiKey,
            key, // Plain key shown only once
        },
    });
}
