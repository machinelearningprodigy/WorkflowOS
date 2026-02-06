"use client"

import * as React from "react"
import { ChevronLeft, Cloud, Play, Save, Settings, Share2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function WorkflowHeader({
    name = "Untitled Workflow",
    status = "draft",
    isSaving = false,
}: {
    name?: string
    status?: "active" | "paused" | "draft"
    isSaving?: boolean
}) {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-card/50 px-6 backdrop-blur-sm shadow-sm ring-1 ring-border/5">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                    <Link href="/dashboard/workflows">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="h-6 w-px bg-border" />
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm font-bold tracking-tight uppercase">{name}</h1>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "h-5 text-[10px] uppercase tracking-wider",
                                status === "active" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                status === "paused" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                                status === "draft" && "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            )}
                        >
                            {status}
                        </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                        <Cloud className="h-3 w-3" />
                        {isSaving ? "Saving changes..." : "All changes saved"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
                <div className="h-6 w-px bg-border mx-1" />
                <Button size="sm" className="h-9 gap-2 shadow-lg shadow-primary/20">
                    <Play className="h-4 w-4 fill-current" />
                    Test Run
                </Button>
                <Button size="sm" variant="secondary" className="h-9 gap-2 border-primary/20 text-primary">
                    <Save className="h-4 w-4" />
                    Publish
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Export as JSON</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Workflow</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
