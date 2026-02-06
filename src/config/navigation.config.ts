import { LayoutDashboard, Zap, Plug2, BarChart3, Users, CreditCard, Key, Settings, Activity } from "lucide-react"

export const navigationConfig = {
    dashboard: [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Workflows', href: '/dashboard/workflows', icon: Zap },
        { name: 'Integrations', href: '/dashboard/integrations', icon: Plug2 },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Usage', href: '/dashboard/usage', icon: Activity },
    ],
    organization: [
        { name: 'Team', href: '/dashboard/team', icon: Users },
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
        { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    footer: {
        product: [
            { name: "Features", href: "/features" },
            { name: "Integrations", href: "/integrations" },
            { name: "Pricing", href: "/pricing" },
        ],
        legal: [
            { name: "Privacy", href: "/privacy" },
            { name: "Terms", href: "/terms" },
        ]
    }
}
