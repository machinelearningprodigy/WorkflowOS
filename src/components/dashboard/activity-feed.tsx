"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Zap,
    XCircle,
    RefreshCw,
    UserPlus,
    ShieldCheck,
    ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Fixed missing import
import { cn } from "@/lib/utils"

const ACTIVITIES = [
    { id: '1', user: 'Alice', email: 'alice@example.com', action: 'deployed', target: 'Stripe Sync', time: '2m ago', type: 'success', icon: Zap },
    { id: '2', user: 'Bob', email: 'bob@example.com', action: 'updated', target: 'Database Connector', time: '15m ago', type: 'info', icon: RefreshCw },
    { id: '3', user: 'System', avatar: 'S', action: 'failed', target: 'Daily Backup', time: '1h ago', type: 'error', icon: XCircle },
    { id: '4', user: 'Alex', email: 'alex@workflowos.io', action: 'invited', target: 'Sarah Jenkins', time: '2h ago', type: 'invite', icon: UserPlus },
    { id: '5', user: 'Sarah', email: 'sarah@example.com', action: 'verified', target: 'MFA Settings', time: '4h ago', type: 'security', icon: ShieldCheck },
]

export function ActivityFeed() {
    return (
        <Card className="col-span-1 border-border/50 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold tracking-tight">Activity Stream</CardTitle>
                    <CardDescription className="text-xs">Real-time pulses from across your organization.</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 text-emerald-500 border-emerald-500/20 px-2">LIVE</Badge>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y border-border/10">
                    {ACTIVITIES.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative flex items-start gap-4 p-4 transition-all hover:bg-muted/30"
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                    <AvatarImage src={`https://avatar.vercel.sh/${activity.email || 'system'}`} />
                                    <AvatarFallback className="font-bold text-[10px]">{activity.avatar || activity.user[0]}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background flex items-center justify-center shadow-sm",
                                    activity.type === 'success' ? "bg-emerald-500 text-white" :
                                        activity.type === 'error' ? "bg-rose-500 text-white" :
                                            activity.type === 'info' ? "bg-blue-500 text-white" :
                                                activity.type === 'security' ? "bg-indigo-500 text-white" :
                                                    "bg-amber-500 text-white"
                                )}>
                                    <activity.icon className="h-2.5 w-2.5" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className="text-xs font-bold leading-none truncate">{activity.user}</p>
                                    <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">{activity.time}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    {activity.action} <span className="text-foreground font-bold tracking-tight">{activity.target}</span>
                                </p>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="p-4 bg-muted/20 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-xs font-bold uppercase tracking-widest h-8 text-muted-foreground hover:text-primary gap-2">
                        View Full History <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
