
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/organization/logo
 * Updates the organization's logo.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Need to check if user belongs to an organization first
        const userOrg = await prisma.organizationMember.findFirst({
            where: { userId: user.id },
            include: { organization: true }
        })

        if (!userOrg) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }

        const formData = await request.formData()
        const file = formData.get('logo') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const filePath = `org-logos/${userOrg.organization.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('public')
            .upload(filePath, file)

        if (uploadError) {
            throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
            .from('public')
            .getPublicUrl(filePath)

        // Update organization record
        const org = await prisma.organization.update({
            where: { id: userOrg.organization.id },
            data: { logoUrl: publicUrl }
        })

        return NextResponse.json({ logoUrl: publicUrl })
    } catch (error: any) {
        logger.error('Logo upload failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
