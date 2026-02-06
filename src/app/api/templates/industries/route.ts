
import { NextRequest, NextResponse } from 'next/server'

/**
 * Route: GET /api/templates/industries
 * List template industries.
 */
export async function GET(request: NextRequest) {
    const industries = [
        "SaaS", "E-commerce", "Agency", "Enterprise", "Startup"
    ]
    return NextResponse.json(industries)
}
