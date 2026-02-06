
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: DELETE /api/team/members/[id]
 * Remove a member from the team.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Validation: Verify if user has permissions to remove members
        // ...

        await prisma.organizationMember.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Member removed' })
    } catch (error: any) {
        logger.error('Remove member failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
