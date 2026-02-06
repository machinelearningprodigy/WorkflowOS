import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/services/email.service'
import { logger } from '@/utils/logger'
import { validation } from '@/utils/validation'

/**
 * Route: POST /api/contact
 * Handles contact form submissions from the landing page.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, subject, message } = body

        // Validate inputs
        if (!name || !email || !message) {
            return NextResponse.json({
                error: 'Name, email, and message are required'
            }, { status: 400 })
        }

        const emailValidation = validation.email.safeParse(email)
        if (!emailValidation.success) {
            return NextResponse.json({
                error: 'Invalid email address'
            }, { status: 400 })
        }

        // Send notification to support team
        await sendEmail({
            to: process.env.SUPPORT_EMAIL || 'support@workflowos.com',
            subject: `Contact Form: ${subject || 'New Message'}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        })

        // Send confirmation to user
        await sendEmail({
            to: email,
            subject: 'We received your message - WorkflowOS',
            html: `
                <h2>Thank you for contacting us!</h2>
                <p>Hi ${name},</p>
                <p>We've received your message and will get back to you within 24 hours.</p>
                <p><strong>Your message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <br>
                <p>Best regards,<br>The WorkflowOS Team</p>
            `
        })

        logger.info(`Contact form submission from ${email}`)

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully'
        })
    } catch (error: any) {
        logger.error('Contact form error:', error.message)
        return NextResponse.json({
            error: 'Failed to send message. Please try again.'
        }, { status: 500 })
    }
}
