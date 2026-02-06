'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Pie, PieChart } from "recharts"
import { Info, Zap } from "lucide-react"

const integrationUsage = [
    { name: "Gmail", value: 4500, color: "#EA4335" },
    { name: "Slack", value: 3200, color: "#4A154B" },
    { name: "Stripe", value: 2100, color: "#635BFF" },
    { name: "Airtable", value: 1800, color: "#18BFFF" },
    { name: "Other", value: 882, color: "#CBD5E1" },
]

const dailyUsage = [
    { date: "Feb 01", count: 850 },
    { date: "Feb 02", count: 940 },
    { date: "Feb 03", count: 1100 },
    { date: "Feb 04", count: 1250 },
    { date: "Feb 05", count: 980 },
]

export default function UsagePage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Usage Breakdown</h2>
                <p className="text-muted-foreground">
                    Monitor your activity and resource consumption.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Executions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,482</div>
                        <Progress value={25} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">25% of 50,000 limit</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Integration Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45,102</div>
                        <p className="text-xs text-muted-foreground mt-2">Unlimited on Pro plan</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18 / 25</div>
                        <Progress value={72} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">7 slots remaining</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Data Transfer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2 GB</div>
                        <p className="text-xs text-muted-foreground mt-2">Across all executions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Activity</CardTitle>
                        <CardDescription>Number of workflow executions per day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailyUsage}>
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Usage by Integration</CardTitle>
                        <CardDescription>Breakdown of calls by platform</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={integrationUsage}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {integrationUsage.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        {integrationUsage.slice(0, 4).map((item, i) => (
                            <div key={i} className="flex items-center justify-between w-full text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span>{item.name}</span>
                                </div>
                                <span className="font-medium">{((item.value / 12482) * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Billing Impact</CardTitle>
                    <CardDescription>How your usage affects your next bill</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-4 p-4 border rounded-lg bg-orange-50 border-orange-100">
                        <Info className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <div className="text-sm font-semibold text-orange-900">Approaching execution limit</div>
                            <div className="text-sm text-orange-800/80">
                                You have used 85% of your allocated monthly executions. Consider upgrading to avoid service interruption once you reach 50,000 tasks.
                            </div>
                            <Badge className="mt-2 bg-orange-200 text-orange-900 hover:bg-orange-200 border-0">Upgrade Recommended</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
