
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: DELETE /api/api-keys/[id]
 * Delete/Revoke an API key.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.apiKey.delete({
            where: { id: params.id, userId: user.id }
        })

        return NextResponse.json({ message: 'API Key deleted' })
    } catch (error: any) {
        logger.error('Delete API key failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
