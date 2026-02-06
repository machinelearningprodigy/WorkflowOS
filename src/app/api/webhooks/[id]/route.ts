import { NextRequest, NextResponse } from "next/server"
import { webhookService } from "@/lib/services/webhook.service"
import { logger } from "@/utils/logger"

/**
 * Public endpoint for incoming webhooks.
 * Route: POST /api/webhooks/[id]
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const slug = params.id

    try {
        const contentType = req.headers.get("content-type") || ""
        let payload = {}

        if (contentType.includes("application/json")) {
            payload = await req.json()
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
            const formData = await req.formData()
            payload = Object.fromEntries(formData.entries())
        } else {
            const text = await req.text()
            payload = { raw: text }
        }

        const headers = Object.fromEntries(req.headers.entries())

        const result = await webhookService.handleWebhook(slug, payload, headers)

        if (!result.success) {
            return NextResponse.json({
                error: result.error || "Failed to process webhook"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            run_id: result.runId,
            received_at: new Date().toISOString()
        })
    } catch (error: any) {
        logger.error(`Webhook API Error for ${slug}:`, error.message)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

/**
 * Route: GET /api/webhooks/[id]
 * Returns webhook status and endpoint info.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    return NextResponse.json({
        webhook_id: params.id,
        status: "active",
        endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/${params.id}`,
        allowed_methods: ["POST"]
    })
}
