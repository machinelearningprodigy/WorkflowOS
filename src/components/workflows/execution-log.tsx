"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    CheckCircle2,
    XCircle,
    Clock,
    Play,
    ChevronRight,
    Search,
    Filter
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface Execution {
    id: string
    workflowName: string
    status: 'completed' | 'failed' | 'running' | 'queued'
    startedAt: string
    duration: string
    trigger: string
}

export function ExecutionLog({
    executions = [],
    onViewDetail
}: {
    executions?: Execution[]
    onViewDetail: (id: string) => void
}) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search logs..." className="pl-9" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Status
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Date Range
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card/50 overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/50 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                        <tr>
                            <th className="p-4">Execution ID</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Trigger</th>
                            <th className="p-4">Started</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y border-border/50">
                        {executions.map((execution, index) => (
                            <motion.tr
                                key={execution.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-muted/30 transition-colors"
                                onClick={() => onViewDetail(execution.id)}
                            >
                                <td className="p-4 font-mono text-xs text-muted-foreground">
                                    {execution.id}
                                </td>
                                <td className="p-4">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "gap-1.5 px-2 py-0.5 capitalize",
                                            execution.status === 'completed' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                            execution.status === 'failed' && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                                            execution.status === 'running' && "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse"
                                        )}
                                    >
                                        {execution.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                                        {execution.status === 'failed' && <XCircle className="h-3 w-3" />}
                                        {execution.status === 'running' && <Play className="h-3 w-3 fill-current" />}
                                        {execution.status}
                                    </Badge>
                                </td>
                                <td className="p-4 font-medium text-card-foreground">
                                    {execution.trigger}
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    {execution.startedAt}
                                </td>
                                <td className="p-4 text-muted-foreground tabular-nums">
                                    {execution.duration}
                                </td>
                                <td className="p-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
