"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MoreVertical, GripVertical, Settings2, Trash2, Copy, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Step {
    id: string
    name: string
    type: string
    icon: any
    status?: 'active' | 'error' | 'pending'
    description?: string
}

export function WorkflowStep({
    step,
    index,
    onEdit,
    onDelete,
    onDuplicate
}: {
    step: Step
    index: number
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onDuplicate: (id: string) => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "group relative flex items-center gap-4 rounded-xl border bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                step.status === 'error' && "border-destructive/50 bg-destructive/5"
            )}
        >
            <div className="flex items-center gap-3 shrink-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-bold text-muted-foreground">
                    {index + 1}
                </div>
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                    <GripVertical className="h-4 w-4" />
                </div>
            </div>

            <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm",
                step.status === 'error' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-primary/5 text-primary border-primary/20"
            )}>
                <step.icon className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-sm tracking-tight truncate">{step.name}</h4>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold py-0.5 h-4 text-muted-foreground">
                        {step.type}
                    </Badge>
                    {step.status === 'error' && <AlertCircle className="h-3.5 w-3.5 text-destructive animate-pulse" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 italic font-medium">
                    {step.description || "No description for this step."}
                </p>
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-all rounded-full" onClick={() => onEdit(step.id)}>
                    <Settings2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 border-2 shadow-xl">
                        <DropdownMenuItem onClick={() => onDuplicate(step.id)}>
                            <Copy className="h-4 w-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive font-bold" onClick={() => onDelete(step.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Step
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    )
}
