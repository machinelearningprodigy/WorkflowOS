"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts"

const data = [
    { name: "Gmail", calls: 4200, color: "#ef4444" },
    { name: "Slack", calls: 3800, color: "#a855f7" },
    { name: "Stripe", calls: 2900, color: "#6366f1" },
    { name: "Airtable", calls: 2100, color: "#3b82f6" },
    { name: "Twilio", calls: 1500, color: "#f43f5e" },
]

export function IntegrationUsageChart() {
    return (
        <Card className="border-slate-200">
            <CardHeader>
                <CardTitle>Integration Usage</CardTitle>
                <CardDescription>Breakdown of API calls by provider.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 13, fontWeight: 500, fill: '#1e293b' }}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="calls" radius={[0, 4, 4, 0]} barSize={24}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
