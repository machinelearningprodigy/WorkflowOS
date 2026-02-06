"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ExternalLink, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function OAuthConnectButton({
    provider,
    isLoading = false,
    onClick,
    className
}: {
    provider: string
    isLoading?: boolean
    onClick: () => void
    className?: string
}) {
    return (
        <div className={cn("relative group", className)}>
            <Button
                onClick={onClick}
                disabled={isLoading}
                size="lg"
                className="w-full h-12 bg-primary dark:bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 gap-3 overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-3"
                        >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting to {provider}...
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-3"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <ExternalLink className="h-4 w-4" />
                            </div>
                            Sign in with {provider}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Shine Animation */}
                {!isLoading && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                    />
                )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                <ShieldCheck className="h-3 w-3" />
                Secure 256-bit OAuth Connector
            </div>
        </div>
    )
}
