
import { NextRequest, NextResponse } from 'next/server'

/**
 * Route: GET /api/plans
 * List available subscription plans.
 */
export async function GET(request: NextRequest) {
    // These could come from DB or Stripe Product API
    const plans = [
        {
            id: 'free',
            name: 'Free Tier',
            price: 0,
            features: ['5 Workflows', '100 runs/mo', 'Community Support']
        },
        {
            id: 'pro_monthly',
            name: 'Pro',
            price: 29,
            currency: 'USD',
            interval: 'month',
            features: ['Unlimited Workflows', '10k runs/mo', 'Priority Support', 'Advanced Analytics']
        },
        {
            id: 'team_monthly',
            name: 'Team',
            price: 99,
            currency: 'USD',
            interval: 'month',
            features: ['SSO', 'Audit Logs', 'Dedicated Success Manager']
        }
    ]

    return NextResponse.json(plans)
}
