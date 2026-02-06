"use client"

import * as React from "react"
import { Mail, MessageSquare, Monitor, Zap, Save, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export function NotificationSettings({
    onSave
}: {
    onSave: (settings: any) => void
}) {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Notification Channels</h2>
                    <p className="text-sm text-muted-foreground">Choose how and when you want to be alerted about your workflows.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6 rounded-xl" onClick={() => onSave({})}>
                    <Save className="h-4 w-4" />
                    Save Preferences
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <Monitor className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight uppercase">Platform Alerts</h3>
                        </div>

                        <div className="divide-y border-2 border-border/50 rounded-2xl bg-card overflow-hidden">
                            <div className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold">In-App Notifications</Label>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Display alerts in the dashboard bell icon.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold">Desktop Push</Label>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Show browser notifications even when WorkflowOS is in the background.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500">
                                <Mail className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight uppercase">Email Digests</h3>
                        </div>

                        <div className="divide-y border-2 border-border/50 rounded-2xl bg-card overflow-hidden">
                            <div className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold">Workflow Failure Alerts</Label>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Instant email whenever an active workflow errors out.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold">Weekly Performance Summary</Label>
                                    <p className="text-xs text-muted-foreground leading-relaxed">A high-level overview of execution stats and AI usage.</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <h4 className="font-bold text-sm">External Channels</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Integrate notifications directly into your team's workflow using Slack or Discord.
                        </p>
                        <Button variant="outline" className="w-full h-10 rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5">
                            <Zap className="h-3.5 w-3.5 fill-current" />
                            Configure slack-bot
                        </Button>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <SlidersHorizontal className="h-3 w-3" /> Advanced Rules
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-medium p-2 rounded-lg bg-muted/30">
                                <span>Quiet Hours</span>
                                <Badge variant="outline" className="text-[8px] bg-background">ENABLED</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic px-2">Notifications are suppressed between 10 PM and 7 AM UTC.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
