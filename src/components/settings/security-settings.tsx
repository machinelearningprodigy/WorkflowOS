"use client"

import * as React from "react"
import {
    ShieldCheck,
    Lock,
    Smartphone,
    History,
    LogOut,
    Key,
    ShieldAlert,
    ChevronRight,
    Settings2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function SecuritySettings() {
    const sessions = [
        { id: '1', device: 'Chrome on MacOS', location: 'San Francisco, CA', active: true, time: 'Current session' },
        { id: '2', device: 'Firefox on Windows', location: 'New York, NY', active: false, time: '2 days ago' },
        { id: '3', device: 'WorkflowOS Mobile (iOS)', location: 'London, UK', active: false, time: '1 week ago' },
    ]

    return (
        <div className="space-y-12">
            <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight">Security & Authentication</h2>
                <p className="text-sm text-muted-foreground">Manage your credentials, 2FA, and active login sessions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500 border border-emerald-500/20">
                            <Lock className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-sm tracking-tight uppercase">Access Control</h3>
                    </div>

                    <div className="divide-y border-2 border-border/50 rounded-2xl bg-card overflow-hidden">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold flex items-center gap-2">
                                        <Smartphone className="h-4 w-4 text-primary" /> Two-Factor Authentication (2FA)
                                    </Label>
                                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                                </div>
                                <Badge className="bg-emerald-500 text-white font-bold h-6 px-3">ENABLED</Badge>
                            </div>
                            <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 font-bold h-10">
                                <Settings2 className="h-4 w-4" /> Manage 2FA Methods
                            </Button>
                        </div>

                        <div className="p-6 flex items-center justify-between hover:bg-muted/10 transition-colors">
                            <div className="space-y-1">
                                <Label className="text-sm font-bold">Automatic Session Timeout</Label>
                                <p className="text-xs text-muted-foreground">Log out after 24 hours of inactivity.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="p-6">
                            <Button variant="secondary" className="w-full rounded-xl gap-2 font-bold h-11 bg-primary/5 text-primary hover:bg-primary/10">
                                <Key className="h-4 w-4" /> Update Account Password
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-500 border border-indigo-500/20">
                            <History className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-sm tracking-tight uppercase">Active Login Sessions</h3>
                    </div>

                    <div className="divide-y border-2 border-border/50 rounded-2xl bg-card/50 overflow-hidden shadow-inner">
                        {sessions.map((session) => (
                            <div key={session.id} className="p-4 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground bg-muted border",
                                        session.active && "bg-primary/10 text-primary border-primary/20"
                                    )}>
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold">{session.device}</h4>
                                            {session.active && <Badge className="text-[8px] h-3.5 px-1 bg-emerald-500">LIVE</Badge>}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{session.location} • {session.time}</p>
                                    </div>
                                </div>
                                {!session.active && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <div className="p-4 bg-muted/20 text-center">
                            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-transparent p-0">
                                Revoke All Remote Sessions <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            <div className="p-6 rounded-2xl bg-amber-500/5 border-2 border-dashed border-amber-500/20 flex gap-4">
                <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Security Audit Info</h4>
                    <p className="text-xs text-amber-500/80 leading-relaxed max-w-2xl">
                        Account activity is tracked globally for security audits. You can view your full audit log, including IP addresses and precise timestamps,
                        in the Organization Admin console.
                    </p>
                </div>
            </div>
        </div>
    )
}
