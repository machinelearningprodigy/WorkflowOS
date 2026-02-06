
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/workflows/[id]/export
 * Export a workflow as JSON.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const workflow = await prisma.workflow.findUnique({
            where: { id: params.id, creatorId: user.id },
            include: { steps: true }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        // Sanitize for export (remove IDs, creator info, specific webhook slugs usually)
        const exportData = {
            type: 'workflow',
            version: '1.0',
            data: {
                name: workflow.name,
                description: workflow.description,
                steps: workflow.steps.map(s => ({
                    type: s.type,
                    provider: s.provider,
                    config: s.config
                }))
            }
        }

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${workflow.name.replace(/\s+/g, '-')}.json"`
            }
        })
    } catch (error: any) {
        logger.error('Export workflow failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
