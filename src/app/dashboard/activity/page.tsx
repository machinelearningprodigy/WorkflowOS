'use client'

import { Activity as ActivityIcon, RefreshCw, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface Activity {
    id: string
    type: string
    description: string
    status: string
    timestamp: string
    metadata: any
}

export default function ActivityPage() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchActivity = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/activity')
            const data = await res.json()
            if (data.activities) {
                setActivities(data.activities)
            }
        } catch (error) {
            console.error("Failed to fetch activity", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchActivity()
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'workflow_execution':
                return <ActivityIcon className="h-4 w-4 text-indigo-500" />
            case 'workflow_update':
                return <RefreshCw className="h-4 w-4 text-emerald-500" />
            default:
                return <Clock className="h-4 w-4 text-slate-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
            case 'completed':
            case 'active':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Success</Badge>
            case 'failed':
            case 'error':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Failed</Badge>
            case 'running':
            case 'pending':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">In Progress</Badge>
            default:
                return <Badge variant="secondary" className="border-none">{status}</Badge>
        }
    }

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Recent Activity</h2>
                    <p className="text-muted-foreground">
                        Keep track of everything happening in your workspace.
                    </p>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-slate-50/50">
                <CardHeader>
                    <CardTitle className="text-lg">Activity Feed</CardTitle>
                    <CardDescription>A timeline of your recent workflows and processes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4 py-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border border-dashed">
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p>No recent activity found.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {activities.map((activity) => (
                                <div key={activity.id} className="relative flex items-start gap-4 group">
                                    <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white border shadow-sm z-10 group-hover:scale-110 transition-transform">
                                        {getIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 bg-white p-4 rounded-xl border shadow-sm group-hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-slate-900">{activity.description}</p>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                                                </p>
                                            </div>
                                            {getStatusBadge(activity.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
