import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/webhooks/clerk
 * Handles Clerk webhook events for user lifecycle management.
 * Note: This is for Clerk-based auth. If using Supabase, this can be removed.
 */
export async function POST(req: NextRequest) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        logger.error('Clerk webhook secret not configured')
        return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    const headersList = headers()
    const svix_id = headersList.get('svix-id')
    const svix_timestamp = headersList.get('svix-timestamp')
    const svix_signature = headersList.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
    }

    const body = await req.text()

    const wh = new Webhook(WEBHOOK_SECRET)
    let evt: any

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (err: any) {
        logger.error('Clerk webhook verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const eventType = evt.type

    try {
        switch (eventType) {
            case 'user.created': {
                const { id, email_addresses, first_name, last_name, image_url } = evt.data

                await prisma.user.create({
                    data: {
                        id,
                        email: email_addresses[0]?.email_address || '',
                        name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
                        avatarUrl: image_url
                    }
                })

                logger.info(`User created via Clerk webhook: ${id}`)
                break
            }

            case 'user.updated': {
                const { id, email_addresses, first_name, last_name, image_url } = evt.data

                await prisma.user.update({
                    where: { id },
                    data: {
                        email: email_addresses[0]?.email_address,
                        name: `${first_name || ''} ${last_name || ''}`.trim(),
                        avatarUrl: image_url,
                        updatedAt: new Date()
                    }
                })

                logger.info(`User updated via Clerk webhook: ${id}`)
                break
            }

            case 'user.deleted': {
                const { id } = evt.data

                // Soft delete or hard delete based on requirements
                await prisma.user.update({
                    where: { id },
                    data: {
                        deletedAt: new Date()
                    }
                })

                logger.info(`User deleted via Clerk webhook: ${id}`)
                break
            }

            default:
                logger.info(`Unhandled Clerk event type: ${eventType}`)
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        logger.error(`Clerk webhook handler error: ${error.message}`)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}
