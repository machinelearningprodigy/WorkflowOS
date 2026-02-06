'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Waypoints,
    Network,
    Settings,
    CreditCard,
    LogOut,
    Plus,
    Zap,
    Activity,
    User,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/auth/actions'
import { useState } from 'react'

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-500',
    },
    {
        label: 'Workflows',
        icon: Waypoints,
        href: '/dashboard/workflows',
        color: 'text-violet-500',
    },
    {
        label: 'Integrations',
        icon: Network,
        href: '/dashboard/integrations',
        color: 'text-pink-700',
    },
    {
        label: 'Activity',
        icon: Activity,
        href: '/dashboard/activity',
        color: 'text-orange-700',
    },
    {
        label: 'Billing',
        icon: CreditCard,
        href: '/dashboard/billing',
        color: 'text-emerald-500',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className={cn(
            "space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground transition-all duration-300 relative",
            collapsed ? "w-20" : "w-72"
        )}>
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 top-6 bg-background rounded-full border border-border text-muted-foreground hover:text-foreground z-50 h-8 w-8"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
            </Button>

            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className={cn("flex items-center pl-3 mb-14", collapsed ? "justify-center pl-0" : "")}>
                    <div className="relative h-8 w-8 mr-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    {!collapsed && (
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            WorkflowOS
                        </h1>
                    )}
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition',
                                pathname === route.href ? 'text-primary bg-primary/10' : 'text-muted-foreground',
                                collapsed ? "justify-center" : ""
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn('h-5 w-5 mr-3', route.color, collapsed ? "mr-0" : "")} />
                                {!collapsed && route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2">
                {/* User Section could go here */}
                {!collapsed && (
                    <div className="mb-4 px-3 py-4 bg-muted/40 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                                US
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">User</p>
                                <p className="text-xs text-muted-foreground truncate">user@example.com</p>
                            </div>
                        </div>
                    </div>
                )}

                <form action={signout}>
                    <Button variant="ghost" className={cn("w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent", collapsed ? "justify-center" : "")}>
                        <LogOut className={cn("h-5 w-5 mr-3", collapsed ? "mr-0" : "")} />
                        {!collapsed && "Sign Out"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
