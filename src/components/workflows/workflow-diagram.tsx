"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Globe, Zap, Mail, Database, Terminal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface DiagramStep {
    id: string
    label: string
    type: 'trigger' | 'action' | 'condition' | 'ai'
    icon?: any
}

export function WorkflowDiagram({
    steps = []
}: {
    steps?: DiagramStep[]
}) {
    return (
        <div className="flex items-center gap-4 py-8 overflow-x-auto custom-scrollbar">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={cn(
                            "flex h-20 w-48 shrink-0 flex-col items-center justify-center gap-1.5 border-2 p-3 text-center transition-all",
                            step.type === 'trigger' ? "bg-blue-500/5 border-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/5" :
                                step.type === 'ai' ? "bg-purple-500/5 border-purple-500/20 text-purple-500 shadow-lg shadow-purple-500/5" :
                                    "bg-card border-border/50 text-card-foreground shadow-md"
                        )}>
                            <div className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg border",
                                step.type === 'trigger' ? "bg-blue-500/10 border-blue-500/20" :
                                    step.type === 'ai' ? "bg-purple-500/10 border-purple-500/20" :
                                        "bg-muted border-border"
                            )}>
                                <step.icon className="h-4 w-4" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest truncate w-full">
                                {step.label}
                            </p>
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                <Badge variant="outline" className="h-4 text-[7px] font-bold border-border/50 bg-background py-0 uppercase">
                                    {step.type}
                                </Badge>
                            </div>
                        </Card>
                    </motion.div>

                    {index < steps.length - 1 && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 24, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.05 }}
                            className="flex items-center"
                        >
                            <ArrowRight className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                        </motion.div>
                    )}
                </React.Fragment>
            ))}

            {steps.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
                    <Terminal className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs text-muted-foreground italic font-medium">No diagram data available for this workflow.</p>
                </div>
            )}
        </div>
    )
}

import { Badge } from "@/components/ui/badge"
