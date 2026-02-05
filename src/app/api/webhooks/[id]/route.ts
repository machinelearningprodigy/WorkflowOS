// Generic webhook receiver for workflow triggers
// Allows users to create custom webhook URLs for their workflows

import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    // TODO: Implement webhook validation and workflow triggering
    return NextResponse.json({ received: true });
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    // TODO: Return webhook information
    return NextResponse.json({ webhookId: params.id });
}
