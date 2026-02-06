
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/templates/[id]
 * Get specific template details.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const template = await prisma.workflowTemplate.findUnique({
            where: { id: params.id },
            include: {
                steps: true
            }
        })

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 })
        }

        return NextResponse.json(template)
    } catch (error: any) {
        logger.error('Fetch template failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
