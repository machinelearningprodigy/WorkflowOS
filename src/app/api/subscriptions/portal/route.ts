// Subscription portal API - Create Stripe customer portal session
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { stripe } from '@/lib/services/stripe.service';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { returnUrl } = body;

    try {
        const subscription = await prisma.subscription.findFirst({
            where: { userId },
        });

        if (!subscription) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
