"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Play,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronRight,
    Terminal,
    Database,
    Zap,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface StepExecution {
    id: string
    name: string
    status: 'completed' | 'failed' | 'running'
    startTime: string
    duration: string
    input: any
    output: any
    error?: string
}

export function ExecutionDetail({
    executionId,
    steps = [],
    onRetry
}: {
    executionId: string
    steps: StepExecution[]
    onRetry: () => void
}) {
    const [expandedSteps, setExpandedSteps] = React.useState<Set<string>>(new Set([steps[0]?.id]))

    const toggleStep = (id: string) => {
        const next = new Set(expandedSteps)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setExpandedSteps(next)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-xl font-bold tracking-tight">Execution Info</h2>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground">{executionId}</p>
                </div>
                <Button onClick={onRetry} variant="outline" className="gap-2">
                    <Zap className="h-4 w-4" />
                    Retry Execution
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3 space-y-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="rounded-xl border bg-card overflow-hidden">
                            <button
                                onClick={() => toggleStep(step.id)}
                                className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center border-2",
                                            step.status === 'completed' ? "bg-emerald-500 border-emerald-600 text-white" :
                                                step.status === 'failed' ? "bg-rose-500 border-rose-600 text-white" :
                                                    "bg-blue-500 border-blue-600 text-white animate-pulse"
                                        )}>
                                            {step.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                                            {step.status === 'failed' && <XCircle className="h-4 w-4" />}
                                            {step.status === 'running' && <Play className="h-4 w-4 fill-current ml-0.5" />}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="w-0.5 h-4 bg-border -mb-4 mt-1" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-sm">{step.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{step.duration} • {step.startTime}</p>
                                    </div>
                                </div>
                                {expandedSteps.has(step.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>

                            <AnimatePresence>
                                {expandedSteps.has(step.id) && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 border-t space-y-4 bg-muted/5">
                                            {step.error && (
                                                <div className="flex gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
                                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                                    <p className="font-medium">{step.error}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                        <Database className="h-3 w-3" /> Input
                                                    </div>
                                                    <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-400 text-[10px] font-mono overflow-x-auto border border-border/50 shadow-inner">
                                                        {JSON.stringify(step.input, null, 2)}
                                                    </pre>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                        <Database className="h-3 w-3" /> Output
                                                    </div>
                                                    <pre className="p-3 rounded-lg bg-zinc-950 text-emerald-400 text-[10px] font-mono overflow-x-auto border border-border/50 shadow-inner">
                                                        {JSON.stringify(step.output, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Execution Meta</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Total Steps</span>
                                <span className="font-bold">{steps.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Success Rate</span>
                                <span className="font-bold text-emerald-500">100%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Env</span>
                                <span className="font-bold">Production</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
