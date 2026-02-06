
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { validation } from '@/utils/validation'

/**
 * Route: POST /api/import
 * Import workflows or other data entities.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { type, data } = body

        if (!type || !data) {
            return NextResponse.json({ error: 'Missing type or data' }, { status: 400 })
        }

        if (type === 'workflow') {
            // Import workflow
            const workflow = await prisma.workflow.create({
                data: {
                    ...data,
                    creatorId: user.id,
                    status: 'draft',
                    importedFrom: 'file',
                    webhookSlug: Math.random().toString(36).substring(2, 12),
                }
            })

            logger.info(`Workflow imported: ${workflow.id} by ${user.id}`)
            return NextResponse.json(workflow, { status: 201 })
        }

        return NextResponse.json({ error: 'Invalid import type' }, { status: 400 })

    } catch (error: any) {
        logger.error('Import failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
