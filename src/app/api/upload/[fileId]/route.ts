
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: DELETE /api/upload/[fileId]
 * Delete an uploaded file.
 */
export async function DELETE(request: NextRequest, { params }: { params: { fileId: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const file = await prisma.uploadedFile.findUnique({
            where: { id: params.fileId }
        })

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        if (file.userId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { error } = await supabase.storage
            .from('public')
            .remove([file.path])

        if (error) {
            throw error
        }

        await prisma.uploadedFile.delete({
            where: { id: params.fileId }
        })

        return NextResponse.json({ message: 'File deleted' })
    } catch (error: any) {
        logger.error('File delete failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
