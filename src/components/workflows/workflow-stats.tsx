"use client"

import { motion } from "framer-motion"
import { Activity, CheckCircle2, AlertCircle, Timer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function WorkflowStats({
    stats = {
        totalRuns: 0,
        successRate: 0,
        avgDuration: "0s",
        activeWorkflows: 0
    }
}) {
    const cards = [
        {
            title: "Total Executions",
            value: stats.totalRuns,
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Success Rate",
            value: `${stats.successRate}%`,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Active Workflows",
            value: stats.activeWorkflows,
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Avg. Duration",
            value: stats.avgDuration,
            icon: Timer,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className={`rounded-xl p-3 ${card.bg}`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                                <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
