
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/templates/categories
 * List template categories.
 */
export async function GET(request: NextRequest) {
    // Return distinct categories
    // Assuming category field on workflowTemplate or separate table
    const categories = [
        "Marketing", "Sales", "Development", "HR", "Productivity", "Finance"
    ]
    return NextResponse.json(categories)
}
