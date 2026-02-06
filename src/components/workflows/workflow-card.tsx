"use client"

import { motion } from "framer-motion"
import { MoreHorizontal, Play, Pause, Edit2, Trash2, Clock, Activity } from "lucide-react"
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Workflow {
    id: string
    name: string
    description?: string
    status: 'active' | 'paused' | 'draft'
    lastRun?: string
    runCount: number
    successRate: number
}

export function WorkflowCard({
    workflow,
    onEdit,
    onToggle,
    onDelete,
    onExecute,
}: {
    workflow: Workflow
    onEdit: (id: string) => void
    onToggle: (id: string) => void
    onDelete: (id: string) => void
    onExecute: (id: string) => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold tracking-tight">
                                {workflow.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">
                                {workflow.description || "No description provided."}
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => onEdit(workflow.id)}>
                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onToggle(workflow.id)}>
                                    {workflow.status === 'active' ? (
                                        <><Pause className="mr-2 h-4 w-4" /> Pause</>
                                    ) : (
                                        <><Play className="mr-2 h-4 w-4" /> Resume</>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete(workflow.id)}
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant={workflow.status === 'active' ? 'default' : 'secondary'}
                            className={cn(
                                "capitalize",
                                workflow.status === 'active' && "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20",
                                workflow.status === 'paused' && "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                            )}
                        >
                            {workflow.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {workflow.lastRun ? `Last run ${workflow.lastRun}` : "Never run"}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total Runs</p>
                            <p className="text-lg font-bold tabular-nums">{workflow.runCount}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Success</p>
                            <p className="text-lg font-bold tabular-nums">{workflow.successRate}%</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-4">
                    <Button
                        onClick={() => onExecute(workflow.id)}
                        className="w-full gap-2 transition-all active:scale-95"
                        variant="outline"
                        disabled={workflow.status === 'paused'}
                    >
                        <Activity className="h-4 w-4" />
                        Run Workflow
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
