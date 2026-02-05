// Subscription create API - Create Stripe checkout session
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { stripe } from '@/lib/services/stripe.service';

export async function POST(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    try {
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: { userId },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
