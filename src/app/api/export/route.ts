import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/export
 * Exports all user data in JSON format (GDPR compliance).
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Fetch all user data
        const [userProfile, workflows, runs, integrations, notifications] = await Promise.all([
            prisma.user.findUnique({ where: { id: user.id } }),
            prisma.workflow.findMany({
                where: { creatorId: user.id },
                include: { steps: true }
            }),
            prisma.workflowRun.findMany({
                where: { workflow: { creatorId: user.id } },
                take: 1000 // Limit for performance
            }),
            prisma.orgCredential.findMany({
                where: { orgId: user.id },
                select: {
                    id: true,
                    providerId: true,
                    name: true,
                    createdAt: true
                    // Exclude sensitive data
                }
            }),
            prisma.notification.findMany({
                where: { userId: user.id },
                take: 500
            })
        ])

        const exportData = {
            exportedAt: new Date().toISOString(),
            user: userProfile,
            workflows: workflows.map(w => ({
                ...w,
                steps: w.steps
            })),
            executionHistory: runs,
            connectedIntegrations: integrations,
            notifications
        }

        logger.info(`Data export requested by user ${user.id}`)

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="workflowos-export-${Date.now()}.json"`
            }
        })
    } catch (error: any) {
        logger.error('Data export failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
