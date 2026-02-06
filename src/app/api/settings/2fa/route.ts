
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/settings/2fa
 * Enable/Disable 2FA.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { action } = await request.json() // 'enroll' or 'verify' or 'disable'

        // Supabase Auth MFA logic (simplified)
        // In reality, this requires multi-step flows (enroll -> challenge -> verify)

        if (action === 'enroll') {
            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp'
            })

            if (error) throw error
            return NextResponse.json(data)
        }

        return NextResponse.json({ message: 'Action not supported via this simple endpoint yet' }, { status: 400 })

    } catch (error: any) {
        logger.error('2FA action failed:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
