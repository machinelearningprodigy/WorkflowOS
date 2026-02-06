
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: PUT /api/team/members/[id]/role
 * Update team member role.
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { role } = await request.json()

        // Validation: Cannot update own role usually, or check if admin
        const member = await prisma.organizationMember.findUnique({
            where: { id: params.id }
        })

        if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        await prisma.organizationMember.update({
            where: { id: params.id },
            data: { role }
        })

        return NextResponse.json({ message: 'Role updated' })
    } catch (error: any) {
        logger.error('Update role failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
