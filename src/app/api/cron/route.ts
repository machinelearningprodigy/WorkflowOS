// Cron jobs - Scheduled tasks
// Runs periodic maintenance, cleanup, reports

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/services/email.service';

// Verify cron secret
function verifyCronSecret(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: NextRequest) {
    if (!verifyCronSecret(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = request.nextUrl.searchParams.get('task');

    switch (task) {
        case 'cleanup':
            await cleanupOldData();
            break;
        case 'reports':
            await sendMonthlyReports();
            break;
        case 'reminders':
            await sendReminders();
            break;
        default:
            return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}

async function cleanupOldData() {
    // Delete old workflow runs (older than 90 days)
    await prisma.workflowRun.deleteMany({
        where: {
            createdAt: {
                lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
            },
        },
    });
}

async function sendMonthlyReports() {
    // Send monthly usage reports to all users
    const users = await prisma.user.findMany();

    for (const user of users) {
        // Calculate stats and send email
        await sendEmail({
            to: user.email,
            template: 'monthly-report',
            data: { /* stats */ },
        });
    }
}

async function sendReminders() {
    // Send reminders for failed workflows, expiring subscriptions, etc.
}
