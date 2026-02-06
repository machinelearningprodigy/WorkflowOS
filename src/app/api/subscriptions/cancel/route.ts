import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/services/stripe.service';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const subscription = await prisma.subscription.findFirst({
            where: { userId: user.id, status: 'active' },
        });

        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
        }

        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

        await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'canceled' },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

