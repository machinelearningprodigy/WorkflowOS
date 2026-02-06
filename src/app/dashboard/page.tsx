'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, ArrowUpRight, CheckCircle2, PlayCircle, Plus, Zap, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/dashboard/stats')
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return <div className="p-8 flex items-center justify-center h-full"><Loader2 className="animate-spin h-8 w-8 text-indigo-500" /></div>
    }

    const { stats, activity } = data || { stats: {}, activity: [] }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Overview of your automation status and activity.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/workflows/new">
                        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                            <Plus className="mr-2 h-4 w-4" /> Create Workflow
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Workflows
                        </CardTitle>
                        <Zap className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_workflows || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all projects
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Successful Runs
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.successful_runs || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total successful executions
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-violet-500 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Workflows
                        </CardTitle>
                        <PlayCircle className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.active_workflows || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently running
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg Duration
                        </CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.avg_duration_ms ? (stats.avg_duration_ms / 1000).toFixed(2) : 0}s</div>
                        <p className="text-xs text-muted-foreground">
                            Per execution
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Activity Feed */}
                <Card className="col-span-4 shadow-md">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {activity?.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                            ) : (
                                activity?.map((item: any) => (
                                    <div key={item.id} className="flex items-center">
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${item.status === 'completed'
                                            ? 'bg-green-100 border-green-200 text-green-600'
                                            : 'bg-red-100 border-red-200 text-red-600'
                                            }`}>
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.workflow_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.status === 'completed' ? 'Completed successfully' : 'Failed to execute'}
                                                {' '} • {(item.duration_ms / 1000).toFixed(2)}s
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                                            {new Date(item.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3 shadow-md bg-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/dashboard/workflows/new">
                            <div className="p-3 bg-muted/50 rounded-lg hover:bg-accent cursor-pointer transition flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-pink-500 flex items-center justify-center">
                                    <Plus className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">New Workflow</div>
                                    <div className="text-xs text-muted-foreground">Start from scratch manually</div>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                            </div>
                        </Link>
                        <Link href="/dashboard/integrations">
                            <div className="p-3 bg-muted/50 rounded-lg hover:bg-accent cursor-pointer transition flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-cyan-500 flex items-center justify-center">
                                    <Network className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">Connect App</div>
                                    <div className="text-xs text-muted-foreground">Browse integrations</div>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function Network({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></svg>
    )
}
