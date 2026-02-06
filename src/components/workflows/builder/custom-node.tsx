"use client"

import * as React from "react"
import { Handle, Position, NodeProps } from "@xyflow/react"
import { Settings2, MoreVertical, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function CustomNode({ data, selected }: NodeProps<any>) {
    const Icon = (require("lucide-react") as any)[data.icon] || Settings2

    return (
        <div
            className={cn(
                "group relative flex min-w-[200px] flex-col rounded-xl border bg-card p-0 shadow-sm transition-all",
                selected ? "border-primary ring-2 ring-primary/20" : "border-border/50",
                data.status === 'error' && "border-destructive ring-2 ring-destructive/20"
            )}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!h-3 !w-3 !bg-primary transition-all group-hover:!scale-125"
            />

            <div className="flex items-center gap-3 border-b border-border/50 p-3 bg-muted/30">
                <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                    data.type === 'trigger' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        data.type === 'condition' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                    <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="truncate text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {data.type}
                    </p>
                    <p className="truncate text-sm font-semibold">{data.label}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={data.onConfigClick}>
                            <Settings2 className="mr-2 h-4 w-4" /> Edit Config
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <AlertCircle className="mr-2 h-4 w-4" /> Delete Node
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="p-3">
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {data.description || "Configure this step to continue."}
                </p>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!h-3 !w-3 !bg-primary transition-all group-hover:!scale-125"
            />
        </div>
    )
}
