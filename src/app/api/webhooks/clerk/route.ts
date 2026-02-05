// Clerk webhook handler for user events
// Handles user.created, user.updated, user.deleted events

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // TODO: Implement Clerk webhook verification and user sync
    return NextResponse.json({ received: true });
}
