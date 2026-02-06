
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { Parser } from 'json2csv'

/**
 * Route: GET /api/audit/export
 * Export audit logs for the organization.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = request.nextUrl
        const format = searchParams.get('format') || 'csv'
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        const query: any = {
            userId: user.id
        }

        if (startDate && endDate) {
            query.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        }

        const logs = await prisma.auditLog.findMany({
            where: query,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { email: true, name: true }
                }
            }
        })

        if (format === 'csv') {
            const fields = ['id', 'action', 'entityType', 'entityId', 'user.email', 'createdAt', 'metadata']
            const parser = new Parser({ fields })
            const csv = parser.parse(logs)

            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString()}.csv"`
                }
            })
        }

        return NextResponse.json(logs)
    } catch (error: any) {
        logger.error('Export audit logs failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
