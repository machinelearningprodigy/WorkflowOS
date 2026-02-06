"use client"

import * as React from "react"
import { useState } from "react"
import { Wand2, Sparkles, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function AIWorkflowInput({
    onGenerate,
    className,
}: {
    onGenerate: (prompt: string) => Promise<void>
    className?: string
}) {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setIsGenerating(true)
        try {
            await onGenerate(prompt)
            setPrompt("")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className={cn("relative rounded-2xl border bg-card p-6 shadow-xl shadow-primary/5", className)}>
            <div className="absolute -top-3 left-6 flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                <Sparkles className="h-3 w-3" />
                AI Builder
            </div>

            <div className="space-y-4">
                <Textarea
                    placeholder="Describe the workflow you want to build (e.g., 'When I get a new Stripe customer, summarize their LinkedIn profile and send a Slack message to the sales team')"
                    className="min-h-[120px] resize-none border-none bg-transparent p-0 text-lg leading-relaxed shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                />

                <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setPrompt("Send daily email summary of my GitHub stars using AI")}
                            className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors underline decoration-dotted"
                        >
                            GitHub Summary
                        </button>
                        <button
                            onClick={() => setPrompt("Monitor website for changes and notify me via Telegram")}
                            className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors underline decoration-dotted"
                        >
                            Website Watcher
                        </button>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!prompt || isGenerating}
                        size="lg"
                        className="group relative gap-2 overflow-hidden shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                                Generate Workflow
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}

                        <AnimatePresence>
                            {isGenerating && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                />
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>
        </div>
    )
}
