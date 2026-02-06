"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, CheckCircle2, XCircle, Loader2, Terminal, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function IntegrationTest({
    integrationId,
    onTest
}: {
    integrationId: string
    onTest: () => Promise<any>
}) {
    const [status, setStatus] = React.useState<'idle' | 'testing' | 'success' | 'failed'>('idle')
    const [response, setResponse] = React.useState<any>(null)

    const handleTest = async () => {
        setStatus('testing')
        try {
            const res = await onTest()
            setResponse(res)
            setStatus('success')
        } catch (e) {
            setResponse({ error: "Connection handshake failed. Please check your credentials or network." })
            setStatus('failed')
        }
    }

    return (
        <div className="rounded-2xl border bg-card/50 overflow-hidden shadow-xl">
            <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Play className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm tracking-tight uppercase">Connectivity Diagnostic</h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold bg-background">OAUTH 2.0</Badge>
            </div>

            <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-bold">Initiate Handshake</p>
                        <p className="text-xs text-muted-foreground italic">We'll send a ping to verify that your session is still valid.</p>
                    </div>
                    <Button
                        onClick={handleTest}
                        disabled={status === 'testing'}
                        className={cn(
                            "gap-2 shadow-lg transition-all",
                            status === 'success' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" :
                                status === 'failed' ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" :
                                    "shadow-primary/20"
                        )}
                    >
                        {status === 'testing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                        {status === 'testing' ? 'Testing...' : status === 'success' ? 'Alive' : 'Run Test'}
                    </Button>
                </div>

                <AnimatePresence mode="wait">
                    {status !== 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 pt-4 border-t border-dashed"
                        >
                            <div className="flex items-center gap-2">
                                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Response Stream</span>
                            </div>

                            <div className={cn(
                                "rounded-xl border bg-zinc-950 p-4 font-mono text-[11px] leading-relaxed shadow-inner",
                                status === 'success' ? "text-emerald-400" : status === 'failed' ? "text-rose-400" : "text-zinc-400"
                            )}>
                                <pre className="whitespace-pre-wrap">
                                    {response ? JSON.stringify(response, null, 2) : "Initializing connection ping..."}
                                </pre>
                            </div>

                            {status === 'success' ? (
                                <div className="flex gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-emerald-600 text-[10px] font-medium font-bold">
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                    Handshake successful. Ready to automate!
                                </div>
                            ) : status === 'failed' ? (
                                <div className="flex gap-2 rounded-lg bg-rose-500/5 border border-rose-500/10 p-3 text-rose-600 text-[10px] font-medium font-bold">
                                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                                    Connectivity link severed. Try re-authenticating.
                                </div>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 bg-muted/30 border-t flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground font-medium italic">We never store your direct tokens in cleartext during tests.</p>
            </div>
        </div>
    )
}
