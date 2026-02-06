
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/templates/popular
 * Get popular workflow templates.
 */
export async function GET(request: NextRequest) {
    try {
        const templates = await prisma.workflowTemplate.findMany({
            where: { isPublic: true },
            take: 10,
            orderBy: { usageCount: 'desc' }
        })

        return NextResponse.json(templates)
    } catch (error: any) {
        logger.error('Fetch popular templates failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
