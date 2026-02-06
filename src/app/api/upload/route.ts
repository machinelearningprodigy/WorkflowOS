
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/upload
 * List uploaded files for user.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const files = await prisma.uploadedFile.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        })

        return NextResponse.json(files)
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
