import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/workflows/tags
 * Returns all unique tags used in workflows with usage counts.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get all workflows with tags
        const workflows = await prisma.workflow.findMany({
            where: { creatorId: user.id },
            select: { tags: true }
        })

        // Aggregate tags
        const tagCounts: Record<string, number> = {}

        workflows.forEach(workflow => {
            if (workflow.tags && Array.isArray(workflow.tags)) {
                workflow.tags.forEach((tag: string) => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1
                })
            }
        })

        // Convert to array and sort by count
        const tags = Object.entries(tagCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)

        return NextResponse.json({ tags })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
