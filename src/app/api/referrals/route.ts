
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/referrals
 * Get user's referral code and stats.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const referral = await prisma.referral.findUnique({
            where: { userId: user.id },
            include: {
                _count: {
                    select: { referrals: true }
                }
            }
        })

        if (!referral) {
            // Create a referral code if one doesn't exist
            const newReferral = await prisma.referral.create({
                data: {
                    userId: user.id,
                    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                }
            })
            return NextResponse.json(newReferral)
        }

        return NextResponse.json(referral)
    } catch (error: any) {
        logger.error('Fetch referrals failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
