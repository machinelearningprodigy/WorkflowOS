import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/services/email.service'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/feedback
 * Submits user feedback (bug reports, feature requests, general feedback).
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { type, message, screenshot } = body

        if (!type || !message) {
            return NextResponse.json({
                error: 'Type and message are required'
            }, { status: 400 })
        }

        const validTypes = ['bug', 'feature', 'general']
        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 })
        }

        // Store feedback in database
        const feedback = await prisma.feedback.create({
            data: {
                userId: user.id,
                type,
                message,
                screenshot,
                userAgent: request.headers.get('user-agent') || undefined
            }
        })

        // Send notification to team
        await sendEmail({
            to: process.env.FEEDBACK_EMAIL || 'feedback@workflowos.com',
            subject: `New ${type} feedback from ${user.email}`,
            html: `
                <h2>New Feedback Submission</h2>
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>From:</strong> ${user.email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                ${screenshot ? `<p><strong>Screenshot:</strong> <a href="${screenshot}">View</a></p>` : ''}
                <p><strong>User Agent:</strong> ${request.headers.get('user-agent')}</p>
            `
        })

        logger.info(`Feedback submitted by ${user.id}: ${type}`)

        return NextResponse.json({
            success: true,
            message: 'Thank you for your feedback!',
            feedbackId: feedback.id
        })
    } catch (error: any) {
        logger.error('Feedback submission failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
