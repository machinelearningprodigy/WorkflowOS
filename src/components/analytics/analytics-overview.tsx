"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Zap, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
    {
        name: "Total Executions",
        value: "2,543",
        change: "+12.5%",
        trend: "up",
        description: "In the last 30 days",
        icon: Zap,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    {
        name: "Success Rate",
        value: "99.8%",
        change: "+0.2%",
        trend: "up",
        description: "Current completion rate",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50"
    },
    {
        name: "Avg. Duration",
        value: "1.2s",
        change: "-150ms",
        trend: "up",
        description: "Processing time per run",
        icon: Clock,
        color: "text-pink-600",
        bg: "bg-pink-50"
    },
    {
        name: "Active Triggers",
        value: "42",
        change: "+5",
        trend: "up",
        description: "Currently listening",
        icon: Target,
        color: "text-blue-600",
        bg: "bg-blue-50"
    }
]

export function AnalyticsOverview() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.name} className="overflow-hidden border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {stat.name}
                        </CardTitle>
                        <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="flex items-center gap-1 mt-1">
                            <span className={`text-xs font-bold flex items-center ${stat.trend === 'up' && stat.name !== 'Avg. Duration' ? 'text-green-600' : 'text-green-600'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </span>
                            <span className="text-xs text-slate-400">
                                {stat.description}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
