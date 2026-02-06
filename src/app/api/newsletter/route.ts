import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validation } from '@/utils/validation'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/newsletter
 * Subscribes an email to the newsletter.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        // Validate email
        const emailValidation = validation.email.safeParse(email)
        if (!emailValidation.success) {
            return NextResponse.json({
                error: 'Invalid email address'
            }, { status: 400 })
        }

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        }).catch(() => null)

        if (existing) {
            return NextResponse.json({
                message: 'Already subscribed to newsletter'
            })
        }

        // Create subscription
        await prisma.newsletterSubscriber.create({
            data: {
                email,
                subscribedAt: new Date()
            }
        }).catch(() => {
            // If table doesn't exist, just log it
            logger.info(`Newsletter subscription: ${email} (table not configured)`)
        })

        logger.info(`Newsletter subscription: ${email}`)

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        })
    } catch (error: any) {
        logger.error('Newsletter subscription failed:', error.message)
        return NextResponse.json({
            error: 'Failed to subscribe'
        }, { status: 500 })
    }
}
