"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    CheckCircle2,
    XCircle,
    Settings2,
    Zap,
    ExternalLink,
    MoreVertical,
    Activity
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Integration {
    id: string
    name: string
    icon: any
    status: 'connected' | 'disconnected' | 'error'
    description: string
    lastSync?: string
    category: string
}

export function IntegrationCard({
    integration,
    onConnect,
    onDisconnect,
    onSettings
}: {
    integration: Integration
    onConnect: (id: string) => void
    onDisconnect: (id: string) => void
    onSettings: (id: string) => void
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-110",
                            integration.status === 'connected' ? "bg-primary/5 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                        )}>
                            <integration.icon className="h-6 w-6" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onSettings(integration.id)}>
                                    <Settings2 className="h-4 w-4 mr-2" /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Activity className="h-4 w-4 mr-2" /> Usage Data
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => onDisconnect(integration.id)}>
                                    <XCircle className="h-4 w-4 mr-2" /> Disconnect
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="pt-4 space-y-1">
                        <CardTitle className="text-lg font-bold tracking-tight">{integration.name}</CardTitle>
                        <CardDescription className="line-clamp-2 text-xs min-h-[32px]">
                            {integration.description}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                        <Badge
                            variant="outline"
                            className={cn(
                                "gap-1.5 px-2 py-0.5 capitalize text-[10px] font-bold tracking-wider",
                                integration.status === 'connected' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                    integration.status === 'error' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                        "bg-muted text-muted-foreground"
                            )}
                        >
                            {integration.status === 'connected' ? <CheckCircle2 className="h-3 w-3" /> :
                                integration.status === 'error' ? <XCircle className="h-3 w-3" /> :
                                    <Zap className="h-3 w-3" />}
                            {integration.status}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium italic">
                            {integration.lastSync ? `Sync ${integration.lastSync}` : 'Never synced'}
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    {integration.status === 'connected' ? (
                        <Button variant="secondary" size="sm" className="w-full gap-2 text-xs h-9 bg-muted/50 hover:bg-muted" onClick={() => onSettings(integration.id)}>
                            <Settings2 className="h-3.5 w-3.5" />
                            Manage Integration
                        </Button>
                    ) : (
                        <Button size="sm" className="w-full gap-2 text-xs h-9 shadow-lg shadow-primary/20" onClick={() => onConnect(integration.id)}>
                            <ExternalLink className="h-3.5 w-3.5" />
                            Connect {integration.name}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    )
}
