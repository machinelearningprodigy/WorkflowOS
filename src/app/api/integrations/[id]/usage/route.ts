import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/integrations/[id]/usage
 * Returns usage statistics for an integration.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const providerId = params.id

    try {
        const orgId = user.id

        // Count workflows using this integration
        const workflowCount = await prisma.workflowStep.count({
            where: {
                provider: providerId,
                workflow: {
                    creatorId: user.id
                }
            }
        })

        // Count executions
        const executionCount = await prisma.workflowRun.count({
            where: {
                workflow: {
                    creatorId: user.id,
                    steps: {
                        some: {
                            provider: providerId
                        }
                    }
                }
            }
        })

        return NextResponse.json({
            providerId,
            workflowsUsing: workflowCount,
            totalExecutions: executionCount
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
