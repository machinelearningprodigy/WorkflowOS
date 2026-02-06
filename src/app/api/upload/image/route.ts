
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { nanoid } from 'nanoid'

/**
 * Route: POST /api/upload/image
 * Generic image upload endpoint.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const ext = file.name.split('.').pop()
        const path = `uploads/${user.id}/${nanoid()}.${ext}`

        const { error } = await supabase.storage.from('public').upload(path, file)
        if (error) throw error

        const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(path)

        // Track upload in DB
        const upload = await prisma.uploadedFile.create({
            data: {
                userId: user.id,
                path: path,
                url: publicUrl,
                originalName: file.name,
                mimeType: file.type,
                size: file.size
            }
        })

        return NextResponse.json(upload)
    } catch (error: any) {
        logger.error('Upload image failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
