"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

export function UsageMeter() {
    const usage = 72 // 72%
    const limit = 10000
    const current = 7200

    return (
        <Card className="border-slate-200">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Usage Limits</CardTitle>
                        <CardDescription>Executions reset in 12 days.</CardDescription>
                    </div>
                    {usage > 90 && (
                        <Badge variant="destructive" className="flex gap-1 animate-pulse">
                            <AlertCircle className="h-3 w-3" /> Running Low
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-600">Monthly Executions</span>
                        <span className="text-slate-900">{current.toLocaleString()} / {limit.toLocaleString()}</span>
                    </div>
                    <Progress value={usage} className="h-3 bg-slate-100" />
                    <p className="text-xs text-slate-400">
                        Approximately {limit - current} executions remaining this month.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Compute Time</div>
                        <div className="text-lg font-bold text-slate-900">42h 15m</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data Transfer</div>
                        <div className="text-lg font-bold text-slate-900">1.2 GB</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
