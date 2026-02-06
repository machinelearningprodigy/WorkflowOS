"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Zap,
    Plug2,
    BarChart3,
    Settings,
    Users,
    CreditCard,
    Activity,
    Key
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workflows', href: '/dashboard/workflows', icon: Zap },
    { name: 'Integrations', href: '/dashboard/integrations', icon: Plug2 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Usage', href: '/dashboard/usage', icon: Activity },
]

const admin = [
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-72 border-r border-slate-100 bg-white flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight text-slate-900 leading-none mb-0.5">WorkflowOS</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Enterprise</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto scrollbar-hide">
                <div>
                    <div className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Menu</div>
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                                    pathname === item.href
                                        ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    pathname === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</div>
                    <div className="space-y-1">
                        {admin.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                                    pathname === item.href
                                        ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    pathname === item.href ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-4 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <h4 className="text-sm font-black mb-1">Help Center</h4>
                    <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">Need help with a workflow? Our engineers are here to assist.</p>
                    <Button variant="secondary" className="w-full h-9 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 text-white border-white/10">
                        Get Support
                    </Button>
                </div>
            </div>
        </aside>
    )
}
