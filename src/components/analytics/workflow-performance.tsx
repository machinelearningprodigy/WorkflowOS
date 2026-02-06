"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const performanceData = [
    { name: "Slack Link Expander", executions: 1250, successRate: 99.8, avgDuration: "450ms" },
    { name: "Gmail Invoice Parser", executions: 840, successRate: 98.5, avgDuration: "1.2s" },
    { name: "Stripe Sync Handler", executions: 3200, successRate: 99.9, avgDuration: "800ms" },
    { name: "Customer Onboarding Webhook", executions: 450, successRate: 92.4, avgDuration: "2.1s" },
    { name: "Daily DB Backup", executions: 30, successRate: 100, avgDuration: "15s" },
]

export function WorkflowPerformance() {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>Individual metrics for your active workflows.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Workflow Name</TableHead>
                            <TableHead>Executions</TableHead>
                            <TableHead>Success Rate</TableHead>
                            <TableHead>Avg. Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {performanceData.map((workflow) => (
                            <TableRow key={workflow.name}>
                                <TableCell className="font-medium">{workflow.name}</TableCell>
                                <TableCell>{workflow.executions.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3 w-[200px]">
                                        <Progress value={workflow.successRate} className="h-2" />
                                        <span className="text-sm text-slate-500">{workflow.successRate}%</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                        {workflow.avgDuration}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
