
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/integrations/[id]/connect
 * Initiate connection flow (usually OAuth redirect).
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    // ID here likely refers to Provider Name (e.g. 'gmail')
    const provider = params.id

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Generate OAuth URL based on provider
        let authUrl = ''
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`

        if (provider === 'google') {
            authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`
        } else if (provider === 'github') {
            authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo user`
        }
        // ... assertions for other providers

        return NextResponse.json({ url: authUrl })
    } catch (error: any) {
        logger.error('Connect integration failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
