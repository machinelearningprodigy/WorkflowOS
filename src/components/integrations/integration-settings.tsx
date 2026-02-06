"use client"

import * as React from "react"
import { Settings2, Save, Trash2, Info, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function IntegrationSettings({
    integration,
    onSave
}: {
    integration: any
    onSave: (settings: any) => void
}) {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Settings2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight">{integration.name} Settings</h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Instance Config • Active</p>
                        </div>
                    </div>
                    <Button size="sm" className="gap-2 shadow-lg shadow-primary/20" onClick={() => onSave({})}>
                        <Save className="h-4 w-4" />
                        Save Changes
                    </Button>
                </div>

                <div className="p-8 space-y-12">
                    <section className="space-y-6">
                        <div className="space-y-1">
                            <h4 className="font-bold text-sm">General Configuration</h4>
                            <p className="text-xs text-muted-foreground">Basic settings for this integration instance.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                                <Input defaultValue={integration.name} className="h-11 bg-muted/30 border-border/50" />
                                <p className="text-[10px] text-muted-foreground italic">Affects how this appears in the workflow builder.</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Instance ID</Label>
                                <Input readOnly defaultValue={integration.id} className="h-11 bg-zinc-950 font-mono text-[10px] text-zinc-400 border-none select-all" />
                                <p className="text-[10px] text-muted-foreground italic">Read-only system identifier.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pt-12 border-t border-dashed">
                        <div className="space-y-1">
                            <h4 className="font-bold text-sm text-primary">Advanced Features</h4>
                            <p className="text-xs text-muted-foreground">Toggle specific capabilities for this connection.</p>
                        </div>

                        <div className="divide-y border rounded-2xl bg-card overflow-hidden">
                            <div className="flex items-center justify-between p-6">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Auto-sync Events</Label>
                                    <p className="text-xs text-muted-foreground">Background synchronization of metadata every 10 minutes.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-6">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Log Execution Payloads</Label>
                                    <p className="text-xs text-muted-foreground">Stores full JSON response for every action (increases storage usage).</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between p-6">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm font-bold">Webhooks Passthrough</Label>
                                        <Badge className="h-4 text-[8px] bg-amber-500/10 text-amber-500 border-amber-500/20">BETA</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Directly forward 3rd party webhooks to this connection.</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </section>

                    <div className="flex gap-4 rounded-xl border border-rose-100 bg-rose-50 p-6 text-rose-800 dark:bg-rose-500/5 dark:border-rose-500/10 dark:text-rose-200">
                        <AlertCircle className="h-6 w-6 shrink-0 mt-1" />
                        <div className="space-y-2">
                            <h4 className="font-bold text-sm uppercase tracking-widest italic">Destructive Area</h4>
                            <p className="text-xs leading-relaxed opacity-80">
                                Disconnecting this integration will immediately pause all active workflows that depend on it. This action cannot be undone.
                            </p>
                            <Button variant="ghost" className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-bold p-0">
                                Revoke Connection Permanently
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
