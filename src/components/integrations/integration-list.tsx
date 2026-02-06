"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Settings2, XCircle, CheckCircle2, MoreHorizontal, Activity, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function IntegrationList({
    integrations = []
}: {
    integrations: any[]
}) {
    return (
        <div className="rounded-2xl border bg-card/50 overflow-hidden backdrop-blur-sm shadow-xl shadow-primary/5">
            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Connections</h3>
                <Badge variant="outline" className="text-[10px] font-bold bg-primary/5 text-primary border-primary/20">{integrations.length} Linked</Badge>
            </div>
            <div className="divide-y border-border/50">
                {integrations.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold tracking-tight">{item.name}</h4>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.category} • Linked {item.lastSync}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Operational</span>
                                </div>
                                <p className="text-[9px] text-muted-foreground font-mono">ID: {item.id.slice(0, 8)}</p>
                            </div>

                            <div className="flex mr-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Settings2 className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Activity className="h-4 w-4 mr-2" /> Sync Status</DropdownMenuItem>
                                        <DropdownMenuItem><Zap className="h-4 w-4 mr-2" /> Re-authenticate</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><XCircle className="h-4 w-4 mr-2" /> Revoke Access</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {integrations.length === 0 && (
                    <div className="p-12 text-center bg-muted/10">
                        <p className="text-sm text-muted-foreground italic">No integrations connected yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
