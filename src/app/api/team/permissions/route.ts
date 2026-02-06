
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/team/permissions
 * List available permissions.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return static list or fetch from DB if dynamic
    const permissions = [
        { id: 'workflow.create', name: 'Create Workflows', description: 'Can create new workflows' },
        { id: 'workflow.edit', name: 'Edit Workflows', description: 'Can edit existing workflows' },
        { id: 'workflow.delete', name: 'Delete Workflows', description: 'Can delete workflows' },
        { id: 'team.manage', name: 'Manage Team', description: 'Can invite/remove members' },
        { id: 'billing.manage', name: 'Manage Billing', description: 'Can update billing info' },
    ]

    return NextResponse.json(permissions)
}
