"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
}

export class SharedErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
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
                <div className="flex-1 flex items-center justify-center p-12 min-h-[400px]">
                    <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">Something went wrong</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                We've encountered an unexpected error. Our engineers have been notified.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                            <Button
                                onClick={() => this.setState({ hasError: false })}
                                className="w-full sm:w-auto bg-slate-900 text-white rounded-xl h-12 px-8 font-black shadow-xl shadow-slate-200 gap-2"
                            >
                                <RotateCcw className="h-4 w-4" /> Try Again
                            </Button>
                            <Link href="/" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto rounded-xl h-12 px-8 font-bold border-slate-200 gap-2">
                                    <Home className="h-4 w-4" /> Go Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
