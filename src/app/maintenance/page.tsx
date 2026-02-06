'use client'

import { Button } from "@/components/ui/button"
import { Clock, Hammer, Mail, Zap } from "lucide-react"

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="h-20 w-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center relative shadow-2xl shadow-indigo-500/20">
                    <Zap className="h-10 w-10 text-white" />
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-amber-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                        <Hammer className="h-4 w-4 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                        Powering up.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
                        We're currently performing some scheduled maintenance to improve the WorkflowOS engine. We'll be back online shortly.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                        <Clock className="h-6 w-6 text-indigo-400 mx-auto mb-3" />
                        <div className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Estimated Return</div>
                        <div className="text-xl font-bold">In 45 minutes</div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
                        <Mail className="h-6 w-6 text-pink-400 mx-auto mb-3" />
                        <div className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Get Notified</div>
                        <div className="text-xl font-bold underline cursor-pointer">Follow Status Page</div>
                    </div>
                </div>

                <div className="pt-8">
                    <p className="text-sm text-slate-500">
                        Thank you for your patience. Your workflows are still running in the background.
                    </p>
                </div>
            </div>
        </div>
    )
}
