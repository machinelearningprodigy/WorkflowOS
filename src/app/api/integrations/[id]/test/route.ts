import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProvider } from '@/lib/integrations/registry'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/integrations/[id]/test
 * Tests an integration connection.
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const providerId = params.id

    try {
        const provider = getProvider(providerId)

        if (!provider) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
        }

        const orgId = user.id

        // Get credentials
        const credential = await prisma.orgCredential.findFirst({
            where: {
                orgId,
                providerId
            }
        })

        if (!credential) {
            return NextResponse.json({
                error: 'Integration not connected'
            }, { status: 404 })
        }

        // Test the connection
        const testResult = await provider.test(credential.credentials as any)

        logger.info(`Integration test successful: ${providerId}`)

        return NextResponse.json({
            success: true,
            message: 'Integration is working correctly',
            result: testResult
        })
    } catch (error: any) {
        logger.error(`Integration test failed for ${providerId}:`, error.message)
        return NextResponse.json({
            success: false,
            error: error.message || 'Connection test failed'
        }, { status: 400 })
    }
}
