"use client"

import * as React from "react"
import { Play, Bug, Terminal, Send, Trash2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function TestWorkflow({
    workflowId,
    onRun
}: {
    workflowId: string
    onRun: (data: any) => Promise<any>
}) {
    const [testData, setTestData] = React.useState('{\n  "status": "active",\n  "user": {\n    "id": "usr_123",\n    "email": "test@example.com"\n  }\n}')
    const [isRunning, setIsRunning] = React.useState(false)
    const [result, setResult] = React.useState<any>(null)

    const handleRun = async () => {
        try {
            setIsRunning(true)
            const parsedData = JSON.parse(testData)
            const res = await onRun(parsedData)
            setResult(res)
        } catch (e) {
            setResult({ error: "Invalid JSON or execution failed" })
        } finally {
            setIsRunning(false)
        }
    }

    return (
        <div className="flex flex-col h-full rounded-xl border bg-background overflow-hidden shadow-2xl">
            <div className="p-6 border-b bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                        <Bug className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Run Test Simulation</h2>
                        <p className="text-xs text-muted-foreground">Input test data to see how your workflow behaves.</p>
                    </div>
                </div>
                <Badge variant="outline" className="h-6 gap-1.5 px-3 bg-blue-500/5 text-blue-500 border-blue-500/20">
                    SANDBOX MODE
                </Badge>
            </div>

            <div className="flex-1 grid grid-cols-2 overflow-hidden">
                <div className="flex flex-col p-6 border-r space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="uppercase tracking-widest text-[10px] font-bold text-muted-foreground">JSON Input Payload</Label>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground" onClick={() => setTestData('')}>
                            <Trash2 className="h-3 w-3 mr-1" /> Clear
                        </Button>
                    </div>
                    <div className="flex-1 relative">
                        <Terminal className="absolute top-4 left-4 h-4 w-4 text-muted-foreground/30" />
                        <Textarea
                            className="h-full font-mono text-xs bg-zinc-950 text-emerald-400 border-none resize-none p-4 pl-10 focus-visible:ring-1 focus-visible:ring-emerald-500/20"
                            spellCheck={false}
                            value={testData}
                            onChange={(e) => setTestData(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full gap-2 shadow-lg shadow-primary/20 h-12"
                        disabled={isRunning}
                        onClick={handleRun}
                    >
                        {isRunning ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                <Bug className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        {isRunning ? 'Executing...' : 'Start Test Execution'}
                    </Button>
                </div>

                <div className="flex flex-col p-6 bg-muted/5 space-y-4 overflow-hidden">
                    <Label className="uppercase tracking-widest text-[10px] font-bold text-muted-foreground">Execution Results</Label>
                    <div className="flex-1 rounded-xl border bg-zinc-950 p-6 overflow-auto custom-scrollbar shadow-inner">
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center space-y-3"
                                >
                                    <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700 animate-pulse">
                                        <Terminal className="h-6 w-6" />
                                    </div>
                                    <p className="text-xs text-zinc-500 max-w-[200px]">Result output will appear here after manual trigger.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-2 text-emerald-500 mb-4">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Execution Completed</span>
                                    </div>
                                    <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
