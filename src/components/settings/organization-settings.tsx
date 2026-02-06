"use client"

import * as React from "react"
import { Building2, Save, Globe, Shield, Zap, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export function OrganizationSettings({
    org = { name: "Prodigy AI", domain: "prodigy.ai", plan: "Enterprise" }
}: {
    org?: any
}) {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Organization Configuration</h2>
                    <p className="text-sm text-muted-foreground">Configure global settings and branding for your workspace.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6 rounded-xl">
                    <Save className="h-4 w-4" />
                    Update Workspace
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight uppercase">General Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Workspace Name</Label>
                                <Input defaultValue={org.name} className="h-12 bg-muted/30 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verified Domain</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input defaultValue={org.domain} className="h-12 pl-10 bg-muted/30 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-500/10 p-2 rounded-lg">
                                <Shield className="h-4 w-4 text-indigo-500" />
                            </div>
                            <h3 className="font-bold text-sm tracking-tight uppercase">Security & Compliance</h3>
                        </div>

                        <div className="divide-y border-2 border-border/50 rounded-2xl bg-card overflow-hidden">
                            {[
                                { title: "Enforce MFA", desc: "Require multi-factor authentication for all team members.", checked: true },
                                { title: "Domain Restricted Signup", desc: "Only allow users with @prodigy.ai email to join.", checked: false },
                                { title: "Audit Log Streaming", desc: "Push organization events to an external SIEM provider.", checked: true, badge: "PRO" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 transition-colors hover:bg-muted/10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-sm font-bold">{item.title}</Label>
                                            {item.badge && <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black">{item.badge}</Badge>}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked={item.checked} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-8 flex flex-col items-center text-center">
                        <Badge className="bg-primary text-white text-[9px] font-black uppercase mb-4 px-3">Active Subscription</Badge>
                        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4 scale-110">
                            <Zap className="h-8 w-8 fill-current" />
                        </div>
                        <h4 className="text-xl font-black italic tracking-tight">{org.plan}</h4>
                        <p className="text-xs text-muted-foreground mt-2 mb-6 font-medium">Your next billing cycle starts Feb 28, 2026.</p>
                        <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10 font-bold h-11 rounded-xl">
                            Manage Billing
                        </Button>
                    </div>

                    <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm relative overflow-hidden group">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Workspace Logo</h4>
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground/50 transition-all group-hover:border-primary/50 group-hover:text-primary">
                                <ImageIcon className="h-8 w-8" />
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-widest">Update Branding</Button>
                        </div>
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                            <Building2 className="h-16 w-16" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
