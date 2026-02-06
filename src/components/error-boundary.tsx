"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center bg-card/50 backdrop-blur-xl rounded-3xl border-2 border-border/50 shadow-2xl">
                    <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-6 ring-8 ring-destructive/5">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-2 italic">Systems Breach...</h2>
                    <p className="text-sm text-muted-foreground mb-8 max-w-sm font-medium leading-relaxed">
                        We've hit an unexpected snag in the circuitry. Don't panic—our stabilizers are already working on a fix.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="default"
                        className="h-12 px-8 rounded-xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        Reboot Interface
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}
