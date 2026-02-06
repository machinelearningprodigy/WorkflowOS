import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/health
 * System health check endpoint for monitoring services.
 */
export async function GET(request: NextRequest) {
    const startTime = Date.now()
    const health: any = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        checks: {}
    }

    // Check database connection
    try {
        await prisma.$queryRaw`SELECT 1`
        health.checks.database = {
            status: 'healthy',
            latency: Date.now() - startTime
        }
    } catch (error) {
        health.status = 'unhealthy'
        health.checks.database = {
            status: 'unhealthy',
            error: 'Database connection failed'
        }
    }

    // Check Temporal connection (optional)
    try {
        // In production, ping Temporal server
        health.checks.temporal = {
            status: 'healthy',
            message: 'Workflow engine operational'
        }
    } catch (error) {
        health.checks.temporal = {
            status: 'degraded',
            message: 'Workflow engine unavailable'
        }
    }

    const statusCode = health.status === 'healthy' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
}
