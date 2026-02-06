import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/organization
 * Returns organization details.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const orgId = user.id // In production, get from user's org membership

        const organization = await prisma.organization.findUnique({
            where: { id: orgId },
            include: {
                _count: {
                    select: {
                        members: true,
                        workflows: true
                    }
                }
            }
        }).catch(() => null)

        if (!organization) {
            // Return default org data
            return NextResponse.json({
                id: orgId,
                name: user.email?.split('@')[0] || 'My Organization',
                memberCount: 1,
                workflowCount: 0
            })
        }

        return NextResponse.json({
            id: organization.id,
            name: organization.name,
            logo: organization.logo,
            domain: organization.domain,
            settings: organization.settings,
            memberCount: organization._count.members,
            workflowCount: organization._count.workflows,
            createdAt: organization.createdAt
        })
    } catch (error: any) {
        logger.error('Failed to fetch organization:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: PATCH /api/organization
 * Updates organization details.
 */
export async function PATCH(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, logo, domain, settings } = body

        const orgId = user.id

        const organization = await prisma.organization.upsert({
            where: { id: orgId },
            create: {
                id: orgId,
                name: name || 'My Organization',
                logo,
                domain,
                settings: settings || {}
            },
            update: {
                ...(name && { name }),
                ...(logo !== undefined && { logo }),
                ...(domain && { domain }),
                ...(settings && { settings }),
                updatedAt: new Date()
            }
        }).catch(() => null)

        if (!organization) {
            return NextResponse.json({
                error: 'Failed to update organization'
            }, { status: 500 })
        }

        logger.info(`Organization updated: ${orgId}`)

        return NextResponse.json(organization)
    } catch (error: any) {
        logger.error('Failed to update organization:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
