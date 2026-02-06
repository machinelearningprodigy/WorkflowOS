
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/utils/logger'
import { validation } from '@/utils/validation'

/**
 * Route: POST /api/settings/password
 * Update user password.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { password } = body

        const validPassword = validation.password.safeParse(password)
        if (!validPassword.success) {
            return NextResponse.json({ error: validPassword.error.errors[0].message }, { status: 400 })
        }

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            throw error
        }

        return NextResponse.json({ message: 'Password updated successfully' })
    } catch (error: any) {
        logger.error('Password update failed:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
