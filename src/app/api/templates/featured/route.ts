
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/templates/featured
 * Get featured workflow templates.
 */
export async function GET(request: NextRequest) {
    try {
        const templates = await prisma.workflowTemplate.findMany({
            where: { isFeatured: true, isPublic: true },
            take: 6,
            orderBy: { popularity: 'desc' }
        })

        return NextResponse.json(templates)
    } catch (error: any) {
        logger.error('Fetch featured templates failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
