"use client"

import * as React from "react"
import {
    ArrowLeft,
    Trash2,
    RefreshCw,
    Zap,
    Database,
    ShieldCheck,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Integration } from "./integration-card"
import { cn } from "@/lib/utils"

export function IntegrationDetail({
    integration,
    onBack,
    onRefresh,
    onDisconnect
}: {
    integration: Integration
    onBack: () => void
    onRefresh: () => void
    onDisconnect: () => void
}) {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Browser
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={onDisconnect}>
                        <Trash2 className="h-4 w-4" />
                        Disconnect
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    <div className="flex items-start gap-6">
                        <div className="h-24 w-24 rounded-[2rem] bg-card border-2 border-border shadow-2xl flex items-center justify-center text-primary group ring-8 ring-primary/5 transition-all hover:scale-105">
                            <integration.icon className="h-12 w-12" />
                        </div>
                        <div className="pt-2 space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black tracking-tight">{integration.name}</h1>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 font-bold text-[10px] uppercase">Connected</Badge>
                            </div>
                            <p className="text-muted-foreground max-w-xl leading-relaxed">
                                {integration.description}
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-muted/20 p-1 border h-11 w-full max-w-md justify-start">
                            <TabsTrigger value="overview" className="px-6 h-9 data-[state=active]:bg-background">Overview</TabsTrigger>
                            <TabsTrigger value="actions" className="px-6 h-9 data-[state=active]:bg-background">Available Tasks</TabsTrigger>
                            <TabsTrigger value="security" className="px-6 h-9 data-[state=active]:bg-background">Security</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-8 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { label: 'Uptime', value: '99.9%', icon: Zap, color: 'text-amber-500' },
                                    { label: 'Total Calls', value: '1,240', icon: Database, color: 'text-blue-500' },
                                    { label: 'Last Sync', value: '2m ago', icon: RefreshCw, color: 'text-emerald-500' }
                                ].map((stat, i) => (
                                    <div key={i} className="rounded-2xl border bg-card/50 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                                        </div>
                                        <h3 className="text-2xl font-black">{stat.value}</h3>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-2xl border-2 border-dashed p-12 text-center bg-muted/10">
                                <AlertCircle className="h-8 w-8 text-muted-foreground/30 mx-auto mb-4" />
                                <h4 className="font-bold mb-1">Activity Feed</h4>
                                <p className="text-xs text-muted-foreground italic">Integration logs will start appearing here as you run workflows.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="actions" className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Send Automated Reply', 'Create Contact', 'Search Database', 'Sync Metadata'].map(action => (
                                    <div key={action} className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:border-primary/30 transition-all cursor-default">
                                        <span className="font-bold text-sm tracking-tight">{action}</span>
                                        <Badge variant="secondary" className="text-[8px] font-black tracking-widest bg-primary/5 text-primary">ACTION</Badge>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="security" className="mt-8 space-y-6">
                            <div className="rounded-2xl border bg-card/50 p-6 space-y-4">
                                <div className="flex items-center gap-3 border-b pb-4">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    <h4 className="font-bold text-sm">OAuth Scopes</h4>
                                </div>
                                <div className="space-y-3">
                                    {['read_user_profile', 'write_messages', 'offline_access'].map(scope => (
                                        <div key={scope} className="flex items-center justify-between text-xs font-mono py-1">
                                            <span className="text-muted-foreground">{scope}</span>
                                            <Badge className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="w-full md:w-80 space-y-4">
                    <div className="rounded-2xl border bg-primary shadow-2xl shadow-primary/20 p-6 text-primary-foreground">
                        <h4 className="font-black italic text-lg mb-2">Power User Tip</h4>
                        <p className="text-xs font-medium leading-relaxed opacity-90">
                            Combine {integration.name} with AI Summary to automate your entire workflow management system.
                        </p>
                        <Button className="w-full mt-6 bg-white text-primary hover:bg-white/90 font-bold text-xs" variant="secondary">
                            Open AI Builder
                        </Button>
                    </div>

                    <div className="rounded-2xl border bg-card/50 p-6 space-y-4 shadow-sm">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Admin Metadata</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-medium">
                                <span className="text-muted-foreground">Internal ID</span>
                                <span className="font-mono">{integration.id}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-medium">
                                <span className="text-muted-foreground">Provider</span>
                                <span className="font-bold">WorkflowOS Cloud</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
